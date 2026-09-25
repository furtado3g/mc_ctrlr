<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'joined_at', 'status', 'left_at'];

    protected function casts(): array
    {
        return ['joined_at' => 'date', 'left_at' => 'date'];
    }

    /** @return HasMany<MemberMotorcycle, $this> */
    public function motorcycleLinks(): HasMany
    {
        return $this->hasMany(MemberMotorcycle::class);
    }

    /** @return HasMany<RoleAssignment, $this> */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }

    /** @return HasMany<Fee, $this> */
    public function fees(): HasMany
    {
        return $this->hasMany(Fee::class);
    }
}
