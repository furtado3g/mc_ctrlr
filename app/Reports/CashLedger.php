<?php

namespace App\Reports;

use App\Models\CashMovement;

class CashLedger
{
    /** @return array{opening_cents: int, income_cents: int, expense_cents: int, closing_cents: int} */
    public function totals(string $start, string $end): array
    {
        $base = CashMovement::where('status', 'active');
        $opening = (clone $base)->whereDate('occurred_at', '<', $start)
            ->selectRaw("COALESCE(SUM(CASE WHEN type = 'in' THEN amount_cents ELSE -amount_cents END), 0) AS total")
            ->value('total');
        $rows = (clone $base)->whereBetween('occurred_at', [$start, $end])
            ->selectRaw('type, COALESCE(SUM(amount_cents), 0) AS total')
            ->groupBy('type')->pluck('total', 'type');
        $income = (int) ($rows['in'] ?? 0);
        $expense = (int) ($rows['out'] ?? 0);

        return ['opening_cents' => (int) $opening, 'income_cents' => $income, 'expense_cents' => $expense, 'closing_cents' => (int) $opening + $income - $expense];
    }
}
