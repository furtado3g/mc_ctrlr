<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $code
 * @property string $city
 * @property string $state
 * @property bool $active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'code', 'city', 'state', 'active'])]
class Regional extends Model
{
    use HasFactory;

    /**
     * @return HasMany<RegionalCity, $this>
     */
    public function cities(): HasMany
    {
        return $this->hasMany(RegionalCity::class);
    }

    /**
     * @return HasOne<RegionalCity, $this>
     */
    public function headquartersCity(): HasOne
    {
        return $this->hasOne(RegionalCity::class)->where('is_headquarters', true);
    }

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return HasMany<Member, $this>
     */
    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    /**
     * @return HasMany<BillingPeriod, $this>
     */
    public function billingPeriods(): HasMany
    {
        return $this->hasMany(BillingPeriod::class);
    }

    /**
     * @return HasMany<Fee, $this>
     */
    public function fees(): HasMany
    {
        return $this->hasMany(Fee::class);
    }

    /**
     * @return HasMany<CashMovement, $this>
     */
    public function cashMovements(): HasMany
    {
        return $this->hasMany(CashMovement::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }
}
