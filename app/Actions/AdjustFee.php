<?php

namespace App\Actions;

use App\Models\Fee;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdjustFee
{
    public function execute(Fee $fee, int $deltaCents, string $reason, int $userId): Fee
    {
        return DB::transaction(function () use ($fee, $deltaCents, $reason, $userId) {
            $fee = Fee::lockForUpdate()->findOrFail($fee->id);
            $before = $fee->toArray();
            if ($fee->balance_cents + $deltaCents < 0) {
                throw ValidationException::withMessages(['amount_cents' => 'O ajuste deixaria saldo negativo.']);
            }
            $fee->update(['adjustment_cents' => $fee->adjustment_cents + $deltaCents, 'adjustment_reason' => $reason]);
            app(RecordAuditEvent::class)->execute('fee', $fee->id, 'adjust', $before, $fee->fresh()->toArray(), $userId);

            return $fee;
        });
    }
}
