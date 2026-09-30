<?php

namespace App\Reports;

use App\Models\CashMovement;
use Illuminate\Support\Carbon;

class FiscalReport
{
    /** @return list<array<string, mixed>> */
    public function rows(string $start, string $end, ?int $regionalId = null): array
    {
        $rows = [];
        $movements = CashMovement::with(['payment', 'regional'])
            ->where('status', 'active')
            ->whereBetween('occurred_at', [$start, $end])
            ->when($regionalId !== null, fn ($query) => $query->where('regional_id', $regionalId))
            ->orderBy('occurred_at')
            ->orderBy('id')
            ->get();

        foreach ($movements as $movement) {
            $rows[] = [
                'movement_id' => $movement->id,
                'regional_id' => $movement->regional_id,
                'regional_code' => $movement->regional?->code,
                'date' => Carbon::parse($movement->occurred_at)->toDateString(),
                'type' => $movement->type,
                'category' => $movement->category,
                'description' => $movement->description,
                'source' => $movement->source,
                'reference' => $movement->payment?->reference,
                'amount_cents' => $movement->amount_cents,
            ];
        }

        return $rows;
    }
}
