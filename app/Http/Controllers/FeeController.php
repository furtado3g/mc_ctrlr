<?php

namespace App\Http\Controllers;

use App\Models\BillingPeriod;
use App\Models\Fee;
use App\Support\SessionTableQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FeeController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('cobrancas.view');
        $query = app(SessionTableQuery::class)->get($request->user()->id, 'fees', ['search' => '', 'filters' => [], 'sort' => 'id', 'direction' => 'desc', 'page' => 1, 'per_page' => 30]);
        $fees = Fee::with(['member', 'billingPeriod'])->when(isset($query['filters']['period']), fn ($builder) => $builder->where('billing_period_id', $query['filters']['period']))
            ->when($query['search'] !== '', fn ($builder) => $builder->whereHas('member', fn ($member) => $member->where('name', 'like', '%'.$query['search'].'%')))
            ->when(isset($query['filters']['status']), function ($builder) use ($query) {
                $paid = '(SELECT COALESCE(SUM(amount_cents), 0) FROM payments WHERE payments.fee_id = fees.id AND payments.status = \'confirmed\')';
                $balance = '(fees.issued_amount_cents + fees.adjustment_cents - '.$paid.')';
                match ($query['filters']['status']) {
                    'paid' => $builder->whereRaw($balance.' <= 0'),
                    'partial' => $builder->whereRaw($paid.' > 0 AND '.$balance.' > 0'),
                    'overdue' => $builder->join('billing_periods as fee_filter_periods', 'fee_filter_periods.id', '=', 'fees.billing_period_id')->whereRaw($paid.' = 0 AND '.$balance.' > 0')->whereDate('fee_filter_periods.due_at', '<', today()),
                    default => $builder->join('billing_periods as fee_filter_periods', 'fee_filter_periods.id', '=', 'fees.billing_period_id')->whereRaw($paid.' = 0 AND '.$balance.' > 0')->whereDate('fee_filter_periods.due_at', '>=', today()),
                };
            });
        $total = (clone $fees)->count();
        $lastPage = max(1, (int) ceil($total / $query['per_page']));
        $query['page'] = min($query['page'], $lastPage);
        app(SessionTableQuery::class)->put($request->user()->id, 'fees', $query);
        $sort = match ($query['sort']) {
            'member_name' => ['members.name', true], 'competence' => ['billing_periods.competence', true], 'due_at' => ['billing_periods.due_at', true], 'balance_cents' => ['(fees.issued_amount_cents + fees.adjustment_cents - COALESCE((SELECT SUM(amount_cents) FROM payments WHERE payments.fee_id = fees.id AND payments.status = ?), 0))', false], default => ['fees.'.(in_array($query['sort'], ['id', 'issued_amount_cents']) ? $query['sort'] : 'id'), false]
        };
        $builder = clone $fees;
        if ($sort[1]) {
            if (in_array($query['sort'], ['member_name'], true)) {
                $builder->join('members', 'members.id', '=', 'fees.member_id');
            }
            if (in_array($query['sort'], ['competence', 'due_at'], true)) {
                $builder->join('billing_periods', 'billing_periods.id', '=', 'fees.billing_period_id');
            }
            $builder->select('fees.*');
        }
        $direction = $query['direction'] === 'desc' ? 'desc' : 'asc';
        if ($query['sort'] === 'balance_cents') {
            $builder->orderByRaw('(fees.issued_amount_cents + fees.adjustment_cents - COALESCE((SELECT SUM(amount_cents) FROM payments WHERE payments.fee_id = fees.id AND payments.status = ?), 0)) '.$direction, ['confirmed']);
        } else {
            $builder->orderBy($sort[0], $direction);
        }
        $rows = $builder->orderBy('fees.id')->forPage($query['page'], $query['per_page'])->get();
        $rows->transform(fn ($fee) => [...$fee->toArray(), 'balance_cents' => $fee->balance_cents, 'status' => $fee->status]);

        return Inertia::render('fees/index', ['fees' => ['data' => $rows, 'total' => $total], 'periods' => BillingPeriod::orderByDesc('competence')->get(), 'tableQuery' => $query]);
    }

    public function show(Fee $fee): Response
    {
        Gate::authorize('cobrancas.view');
        $fee->load(['member', 'billingPeriod', 'payments']);

        return Inertia::render('fees/show', ['fee' => [...$fee->toArray(), 'balance_cents' => $fee->balance_cents, 'status' => $fee->status]]);
    }
}
