<?php

namespace App\Actions;

use App\Models\CashCorrection;
use App\Models\CashMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ManageCashMovement
{
    /** @param array<string, mixed> $data */
    public function create(array $data, int $userId): CashMovement
    {
        return DB::transaction(function () use ($data, $userId) {
            $movement = CashMovement::create([...$data, 'source' => 'manual', 'status' => 'active', 'created_by' => $userId]);
            app(RecordAuditEvent::class)->execute('cash_movement', $movement->id, 'create', null, $movement->toArray(), $userId);

            return $movement;
        });
    }

    /** @param array<string, mixed> $changes */
    public function change(CashMovement $movement, array $changes, string $reason, int $userId, bool $reverse = false): void
    {
        DB::transaction(function () use ($movement, $changes, $reason, $userId, $reverse) {
            $movement = CashMovement::lockForUpdate()->findOrFail($movement->id);
            if ($movement->source !== 'manual' || $movement->status !== 'active') {
                throw ValidationException::withMessages(['movement' => 'Somente lançamento manual ativo pode ser alterado aqui.']);
            }
            $before = $movement->toArray();
            $movement->update($reverse ? ['status' => 'reversed'] : $changes);
            $after = $movement->fresh()->toArray();
            CashCorrection::create([
                'cash_movement_id' => $movement->id, 'action' => $reverse ? 'reverse' : 'correct',
                'reason' => $reason, 'before' => $before, 'after' => $after,
                'user_id' => $userId, 'created_at' => now(),
            ]);
            app(RecordAuditEvent::class)->execute('cash_movement', $movement->id, $reverse ? 'reverse' : 'correct', $before, $after, $userId);
        });
    }
}
