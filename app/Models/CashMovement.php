<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CashMovement extends Model
{
    protected $fillable = ['type', 'amount_cents', 'occurred_at', 'category', 'description', 'source', 'payment_id', 'status', 'created_by'];

    protected function casts(): array
    {
        return ['occurred_at' => 'date', 'amount_cents' => 'integer'];
    }

    /** @return BelongsTo<Payment, $this> */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /** @return HasOne<Receipt, $this> */
    public function receipt(): HasOne
    {
        return $this->hasOne(Receipt::class);
    }

    /** @return HasMany<CashCorrection, $this> */
    public function corrections(): HasMany
    {
        return $this->hasMany(CashCorrection::class);
    }
}
