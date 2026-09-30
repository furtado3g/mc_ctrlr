<?php

namespace App\Reports;

use App\Models\Fee;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class FeeReport
{
    /** @return Builder<Fee> */
    public function query(string $start, string $end, ?int $regionalId = null): Builder
    {
        return Fee::with(['member', 'billingPeriod', 'regional'])
            ->whereHas('billingPeriod', fn ($query) => $query->whereBetween('due_at', [$start, $end]))
            ->when($regionalId !== null, fn ($query) => $query->where('regional_id', $regionalId));
    }

    /** @return list<array<string, mixed>> */
    public function rows(string $start, string $end, bool $overdueOnly = false, ?int $regionalId = null): array
    {
        $rows = [];
        foreach ($this->query($start, $end, $regionalId)->get() as $fee) {
            $row = [
                'fee_id' => $fee->id,
                'regional_id' => $fee->regional_id,
                'regional_code' => $fee->regional?->code,
                'member' => $fee->member->name,
                'competence' => $fee->billingPeriod->competence,
                'due_at' => Carbon::parse($fee->billingPeriod->due_at)->toDateString(),
                'issued_cents' => $fee->issued_amount_cents + $fee->adjustment_cents,
                'paid_cents' => $fee->paid_cents,
                'balance_cents' => $fee->balance_cents,
                'status' => $fee->status,
            ];
            if (! $overdueOnly || ($row['balance_cents'] > 0 && $row['due_at'] < today()->toDateString())) {
                $rows[] = $row;
            }
        }

        return $rows;
    }
}
