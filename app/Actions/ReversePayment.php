<?php

namespace App\Actions;

use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReversePayment
{
    public function execute(Payment $payment, string $reason, int $userId): void
    {
        DB::transaction(function () use ($payment, $reason, $userId) {
            $payment = Payment::lockForUpdate()->findOrFail($payment->id);
            if ($payment->status !== 'confirmed') {
                throw ValidationException::withMessages(['payment' => 'Pagamento já estornado.']);
            }
            $before = $payment->toArray();
            $payment->update(['status' => 'reversed', 'reverse_reason' => $reason, 'reversed_by' => $userId, 'reversed_at' => now()]);
            $payment->cashMovement()->update(['status' => 'reversed']);
            app(RecordAuditEvent::class)->execute('payment', $payment->id, 'reverse', $before, $payment->fresh()->toArray(), $userId);
        }, 3);
    }
}
