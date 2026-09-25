<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BillingPeriod extends Model
{
    protected $fillable = ['competence', 'due_at', 'default_amount_cents', 'status'];

    protected function casts(): array
    {
        return ['due_at' => 'date', 'default_amount_cents' => 'integer'];
    }

    /** @return HasMany<Fee, $this> */
    public function fees(): HasMany
    {
        return $this->hasMany(Fee::class);
    }
}
