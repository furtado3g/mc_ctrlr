<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Payment extends Model
{
    protected $fillable = ['fee_id', 'amount_cents', 'paid_at', 'method', 'reference', 'status', 'recorded_by', 'reverse_reason', 'reversed_by', 'reversed_at'];

    protected function casts(): array
    {
        return ['paid_at' => 'date', 'amount_cents' => 'integer', 'reversed_at' => 'datetime'];
    }

    /** @return BelongsTo<Fee, $this> */
    public function fee(): BelongsTo
    {
        return $this->belongsTo(Fee::class);
    }

    /** @return HasOne<CashMovement, $this> */
    public function cashMovement(): HasOne
    {
        return $this->hasOne(CashMovement::class);
    }
}
