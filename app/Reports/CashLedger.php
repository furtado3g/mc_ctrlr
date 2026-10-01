<?php

namespace App\Reports;

use App\Models\CashMovement;

class CashLedger
{
    /** @return array{opening_cents: int, income_cents: int, expense_cents: int, closing_cents: int} */
    public function totals(?string $start = null, ?string $end = null, ?int $regionalId = null): array
    {
        $regionalId ??= auth()->user()?->regional_id ?? (auth()->user()?->is_global ? session('active_regional_id') : null);

        $base = CashMovement::where('status', 'active')
            ->when($regionalId !== null, fn ($query) => $query->where('regional_id', $regionalId));

        $openingQuery = (clone $base);
        if ($start !== null) {
            $openingQuery->whereDate('occurred_at', '<', $start);
        } else {
            $openingQuery->whereRaw('1 = 0');
        }
        $opening = $openingQuery
            ->selectRaw("COALESCE(SUM(CASE WHEN type = 'in' THEN amount_cents ELSE -amount_cents END), 0) AS total")
            ->value('total');

        $rowsQuery = (clone $base);
        if ($start !== null && $end !== null) {
            $rowsQuery->whereBetween('occurred_at', [$start, $end]);
        } elseif ($start !== null) {
            $rowsQuery->whereDate('occurred_at', '>=', $start);
        } elseif ($end !== null) {
            $rowsQuery->whereDate('occurred_at', '<=', $end);
        }
        $rows = $rowsQuery
            ->selectRaw('type, COALESCE(SUM(amount_cents), 0) AS total')
            ->groupBy('type')->pluck('total', 'type');
        $income = (int) ($rows['in'] ?? 0);
        $expense = (int) ($rows['out'] ?? 0);

        return ['opening_cents' => (int) $opening, 'income_cents' => $income, 'expense_cents' => $expense, 'closing_cents' => (int) $opening + $income - $expense];
    }
}
