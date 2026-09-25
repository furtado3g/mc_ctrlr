<?php

namespace App\Http\Controllers;

use App\Reports\CashLedger;
use App\Reports\CsvExporter;
use App\Reports\FeeReport;
use App\Reports\FiscalReport;
use App\Support\SessionTableQuery;
use App\Support\TableQueryRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /** @return array{string, string, array<string, mixed>} */
    private function filters(Request $request, string $table): array
    {
        $defaultFilters = ['start' => now()->startOfYear()->toDateString(), 'end' => today()->toDateString()];
        $query = app(SessionTableQuery::class)->get($request->user()->id, $table, ['search' => '', 'filters' => $defaultFilters, 'sort' => app(TableQueryRules::class)->schema($table)['default_sort'], 'direction' => 'asc', 'page' => 1, 'per_page' => 30]);
        $query = app(TableQueryRules::class)->normalize($table, $query);
        $start = $query['filters']['start'] ?? $defaultFilters['start'];
        $end = $query['filters']['end'] ?? $defaultFilters['end'];
        abort_if($end < $start, 422, 'A data final deve ser igual ou posterior à data inicial.');

        return [$start, $end, [...$query['filters'], 'tableQuery' => $query]];
    }

    /** @param list<array<string, mixed>> $rows
     * @param  array<string, mixed>  $query
     * @return array{list<array<string, mixed>>, int, array<string, mixed>}
     */
    private function tableRows(array $rows, array $query, bool $paginate = true): array
    {
        if (isset($query['filters']['type'])) {
            $rows = array_values(array_filter($rows, static fn (array $row): bool => ($row['type'] ?? null) === $query['filters']['type']));
        }
        $search = mb_strtolower($query['search']);
        if ($search !== '') {
            $rows = array_values(array_filter($rows, static function (array $row) use ($search): bool {
                foreach ($row as $value) {
                    if (is_scalar($value) && str_contains(mb_strtolower((string) $value), $search)) {
                        return true;
                    }
                }

                return false;
            }));
        }
        $sort = $query['sort'];
        $direction = $query['direction'] === 'desc' ? -1 : 1;
        usort($rows, static function (array $left, array $right) use ($sort, $direction): int {
            $comparison = ($left[$sort] ?? null) <=> ($right[$sort] ?? null);

            return $comparison === 0
                ? (($left['fee_id'] ?? $left['movement_id'] ?? 0) <=> ($right['fee_id'] ?? $right['movement_id'] ?? 0))
                : $comparison * $direction;
        });
        $total = count($rows);
        if (! $paginate) {
            return [$rows, $total, $query];
        }
        $lastPage = max(1, (int) ceil($total / $query['per_page']));
        $query['page'] = min($query['page'], $lastPage);

        return [array_slice($rows, ($query['page'] - 1) * $query['per_page'], $query['per_page']), $total, $query];
    }

    public function fees(Request $request, FeeReport $report, CsvExporter $csv): Response|StreamedResponse
    {
        Gate::authorize('relatorios.view');
        [$start, $end, $data] = $this->filters($request, 'reports.fees');
        $rows = $report->rows($start, $end, (bool) ($data['overdue'] ?? false));
        $totals = ['issued_cents' => array_sum(array_column($rows, 'issued_cents')), 'paid_cents' => array_sum(array_column($rows, 'paid_cents')), 'balance_cents' => array_sum(array_column($rows, 'balance_cents'))];
        [$rows, $total, $query] = $this->tableRows($rows, $data['tableQuery']);
        app(SessionTableQuery::class)->put($request->user()->id, 'reports.fees', $query);
        if ($request->query('format') === 'csv') {
            return $csv->download('mensalidades', $rows, $start, $end, $totals);
        }

        return Inertia::render('reports/fees', ['rows' => $rows, 'total' => $total, 'start' => $start, 'end' => $end, 'overdue' => (bool) ($data['overdue'] ?? false), 'tableQuery' => $query, 'totals' => $totals]);
    }

    public function cash(Request $request, FiscalReport $report, CashLedger $ledger, CsvExporter $csv): Response|StreamedResponse
    {
        Gate::authorize('relatorios.view');
        [$start, $end, $data] = $this->filters($request, 'reports.cash');
        $rows = $report->rows($start, $end);
        $totals = $ledger->totals($start, $end);
        [$rows, $total, $query] = $this->tableRows($rows, $data['tableQuery']);
        app(SessionTableQuery::class)->put($request->user()->id, 'reports.cash', $query);
        if ($request->query('format') === 'csv') {
            return $csv->download('caixa', $rows, $start, $end, $totals);
        }

        return Inertia::render('reports/cash', ['rows' => $rows, 'total' => $total, 'start' => $start, 'end' => $end, 'tableQuery' => $query, 'totals' => $totals]);
    }

    public function fiscal(Request $request, FiscalReport $report, CashLedger $ledger, CsvExporter $csv): Response|StreamedResponse
    {
        Gate::authorize('relatorios.view');
        [$start, $end, $data] = $this->filters($request, 'reports.fiscal');
        $rows = $report->rows($start, $end);
        $totals = $ledger->totals($start, $end);
        [$rows, $total, $query] = $this->tableRows($rows, $data['tableQuery']);
        app(SessionTableQuery::class)->put($request->user()->id, 'reports.fiscal', $query);
        if ($request->query('format') === 'csv') {
            return $csv->download('suporte-fiscal', $rows, $start, $end, $totals);
        }

        return Inertia::render('reports/fiscal', ['rows' => $rows, 'total' => $total, 'start' => $start, 'end' => $end, 'tableQuery' => $query, 'totals' => $totals]);
    }

    public function feesCsv(Request $request, FeeReport $report, CsvExporter $csv): StreamedResponse
    {
        Gate::authorize('relatorios.view');
        [$start, $end, $data] = $this->filters($request, 'reports.fees');
        $rows = $report->rows($start, $end, (bool) ($data['overdue'] ?? false));
        $totals = ['issued_cents' => array_sum(array_column($rows, 'issued_cents')), 'paid_cents' => array_sum(array_column($rows, 'paid_cents')), 'balance_cents' => array_sum(array_column($rows, 'balance_cents'))];
        [$rows] = $this->tableRows($rows, $data['tableQuery'], false);

        return $csv->download('mensalidades', $rows, $start, $end, $totals);
    }

    public function cashCsv(Request $request, FiscalReport $report, CashLedger $ledger, CsvExporter $csv): StreamedResponse
    {
        Gate::authorize('relatorios.view');
        [$start, $end, $data] = $this->filters($request, 'reports.cash');

        [$rows] = $this->tableRows($report->rows($start, $end), $data['tableQuery'], false);

        return $csv->download('caixa', $rows, $start, $end, $ledger->totals($start, $end));
    }

    public function fiscalCsv(Request $request, FiscalReport $report, CashLedger $ledger, CsvExporter $csv): StreamedResponse
    {
        Gate::authorize('relatorios.view');
        [$start, $end, $data] = $this->filters($request, 'reports.fiscal');

        [$rows] = $this->tableRows($report->rows($start, $end), $data['tableQuery'], false);

        return $csv->download('suporte-fiscal', $rows, $start, $end, $ledger->totals($start, $end));
    }
}
