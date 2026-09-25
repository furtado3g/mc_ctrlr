<?php

namespace App\Actions;

use App\Models\BillingPeriod;
use App\Models\Fee;
use App\Models\Member;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GenerateFees
{
    /** @return array{created: int, existing: int} */
    public function execute(BillingPeriod $period, int $userId): array
    {
        return DB::transaction(function () use ($period, $userId) {
            $period = BillingPeriod::lockForUpdate()->findOrFail($period->id);
            if ($period->status !== 'open') {
                throw ValidationException::withMessages(['period' => 'Período encerrado.']);
            }
            $ids = Member::where('status', 'active')->pluck('id');
            $created = 0;
            foreach ($ids as $id) {
                $created += Fee::insertOrIgnore([
                    'member_id' => $id,
                    'billing_period_id' => $period->id,
                    'issued_amount_cents' => $period->default_amount_cents,
                    'adjustment_cents' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            app(RecordAuditEvent::class)->execute('billing_period', $period->id, 'generate_fees', null, ['created' => $created], $userId);

            return ['created' => $created, 'existing' => $ids->count() - $created];
        });
    }
}
