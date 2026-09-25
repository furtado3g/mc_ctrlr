<?php

namespace App\Actions;

use App\Models\CashMovement;
use App\Models\Fee;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecordPayment
{
    /** @param array<string, mixed> $data */
    public function execute(Fee $fee, array $data, int $userId): Payment
    {
        return DB::transaction(function () use ($fee, $data, $userId) {
            $fee = Fee::lockForUpdate()->findOrFail($fee->id);
            $amount = (int) $data['amount_cents'];
            if ($amount <= 0 || $amount > $fee->balance_cents) {
                throw ValidationException::withMessages(['amount_cents' => 'Valor maior que o saldo pendente ou inválido.']);
            }
            $payment = Payment::create([
                'fee_id' => $fee->id,
                'amount_cents' => $amount,
                'paid_at' => $data['paid_at'],
                'method' => $data['method'],
                'reference' => $data['reference'] ?? null,
                'status' => 'confirmed',
                'recorded_by' => $userId,
            ]);
            CashMovement::create([
                'type' => 'in', 'amount_cents' => $amount, 'occurred_at' => $data['paid_at'],
                'category' => 'Mensalidade', 'description' => "Mensalidade #{$fee->id}",
                'source' => 'payment', 'payment_id' => $payment->id, 'status' => 'active', 'created_by' => $userId,
            ]);
            app(RecordAuditEvent::class)->execute('payment', $payment->id, 'confirm', null, $payment->toArray(), $userId);

            return $payment;
        }, 3);
    }
}
