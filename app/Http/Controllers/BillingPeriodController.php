<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditEvent;
use App\Http\Requests\BillingPeriodRequest;
use App\Models\BillingPeriod;
use App\Support\SessionTableQuery;
use App\Support\TableQueryRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BillingPeriodController extends Controller
{
    public function index(Request $request, SessionTableQuery $queries, TableQueryRules $rules): Response
    {
        Gate::authorize('cobrancas.view');

        $schema = $rules->schema('periods');
        $query = $queries->get($request->user()->id, 'periods', ['search' => '', 'filters' => [], 'sort' => $schema['default_sort'], 'direction' => 'desc', 'page' => 1, 'per_page' => 30]);
        $periods = BillingPeriod::query()->when($query['search'] !== '', fn ($builder) => $builder->where('competence', 'like', '%'.$query['search'].'%'))->when(isset($query['filters']['status']), fn ($builder) => $builder->where('status', $query['filters']['status']));
        $total = (clone $periods)->count();
        $lastPage = max(1, (int) ceil($total / $query['per_page']));
        $query['page'] = min($query['page'], $lastPage);
        $queries->put($request->user()->id, 'periods', $query);
        $rows = $periods->orderBy($query['sort'], $query['direction'])->orderBy('id')->forPage($query['page'], $query['per_page'])->get();

        return Inertia::render('billing-periods/index', ['periods' => ['data' => $rows, 'total' => $total], 'tableQuery' => $query]);
    }

    public function store(BillingPeriodRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $period = BillingPeriod::create($request->validated());
            app(RecordAuditEvent::class)->execute('billing_period', $period->id, 'create', null, $period->toArray(), $request->user()->id);
        });

        return back();
    }

    public function update(BillingPeriodRequest $request, BillingPeriod $period): RedirectResponse
    {
        DB::transaction(function () use ($request, $period) {
            $period = BillingPeriod::lockForUpdate()->findOrFail($period->id);
            $before = $period->toArray();
            $period->update($request->validated());
            app(RecordAuditEvent::class)->execute('billing_period', $period->id, 'update', $before, $period->fresh()->toArray(), $request->user()->id);
        });

        return back();
    }
}
