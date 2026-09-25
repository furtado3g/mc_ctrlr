<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Fee extends Model
{
    protected $fillable = ['member_id', 'billing_period_id', 'issued_amount_cents', 'adjustment_cents', 'adjustment_reason'];

    protected function casts(): array
    {
        return ['issued_amount_cents' => 'integer', 'adjustment_cents' => 'integer'];
    }

    /** @return BelongsTo<Member, $this> */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /** @return BelongsTo<BillingPeriod, $this> */
    public function billingPeriod(): BelongsTo
    {
        return $this->belongsTo(BillingPeriod::class);
    }

    /** @return HasMany<Payment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function getPaidCentsAttribute(): int
    {
        return (int) $this->payments()->where('status', 'confirmed')->sum('amount_cents');
    }

    public function getBalanceCentsAttribute(): int
    {
        return $this->issued_amount_cents + $this->adjustment_cents - $this->paid_cents;
    }

    public function getStatusAttribute(): string
    {
        if ($this->balance_cents === 0) {
            return 'paid';
        }
        if ($this->paid_cents > 0) {
            return 'partial';
        }

        return $this->billingPeriod && Carbon::parse($this->billingPeriod->due_at)->lt(today()) ? 'overdue' : 'open';
    }
}
