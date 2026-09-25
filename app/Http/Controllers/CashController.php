<?php

namespace App\Http\Controllers;

use App\Models\CashMovement;
use App\Reports\CashLedger;
use App\Support\SessionTableQuery;
use App\Support\TableQueryRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CashController extends Controller
{
    public function index(Request $request, CashLedger $ledger): Response
    {
        Gate::authorize('caixa.view');
        $schema = app(TableQueryRules::class)->schema('cash');
        $query = app(SessionTableQuery::class)->get($request->user()->id, 'cash', ['search' => '', 'filters' => ['start' => now()->startOfMonth()->toDateString(), 'end' => today()->toDateString()], 'sort' => $schema['default_sort'], 'direction' => 'desc', 'page' => 1, 'per_page' => 30]);
        $filterValidator = app(TableQueryRules::class)->normalize('cash', $query);
        $query = $filterValidator;
        $start = $query['filters']['start'] ?? now()->startOfMonth()->toDateString();
        $end = $query['filters']['end'] ?? today()->toDateString();
        $base = CashMovement::query()->whereBetween('occurred_at', [$start, $end])->when(isset($query['filters']['type']), fn ($builder) => $builder->where('type', $query['filters']['type']))->when($query['search'] !== '', fn ($builder) => $builder->where(fn ($where) => $where->where('description', 'like', '%'.$query['search'].'%')->orWhere('category', 'like', '%'.$query['search'].'%')));
        $total = (clone $base)->count();
        $lastPage = max(1, (int) ceil($total / $query['per_page']));
        $query['page'] = min($query['page'], $lastPage);
        app(SessionTableQuery::class)->put($request->user()->id, 'cash', $query);
        $sort = in_array($query['sort'], ['id', 'occurred_at', 'type', 'amount_cents', 'category'], true) ? $query['sort'] : 'occurred_at';
        $direction = $query['direction'] === 'desc' ? 'desc' : 'asc';
        $rows = $base->with(['receipt', 'corrections'])->orderBy($sort, $direction)->orderBy('id')->forPage($query['page'], $query['per_page'])->get();

        return Inertia::render('cash/index', [
            'start' => $start, 'end' => $end, 'tableQuery' => $query,
            'totals' => $ledger->totals($start, $end),
            'movements' => ['data' => $rows, 'total' => $total],
        ]);
    }
}
