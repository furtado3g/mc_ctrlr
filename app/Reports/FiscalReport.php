<?php

namespace App\Reports;

use App\Models\CashMovement;
use Illuminate\Support\Carbon;

class FiscalReport
{
    /** @return list<array<string, mixed>> */
    public function rows(string $start, string $end): array
    {
        $rows = [];
        $movements = CashMovement::with('payment')->where('status', 'active')
            ->whereBetween('occurred_at', [$start, $end])->orderBy('occurred_at')->orderBy('id')
            ->get();
        foreach ($movements as $movement) {
            $rows[] = [
                'movement_id' => $movement->id,
                'date' => Carbon::parse($movement->occurred_at)->toDateString(),
                'type' => $movement->type, 'category' => $movement->category,
                'description' => $movement->description, 'source' => $movement->source,
                'reference' => $movement->payment?->reference,
                'amount_cents' => $movement->amount_cents,
            ];
        }

        return $rows;
    }
}
