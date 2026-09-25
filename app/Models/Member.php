<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Member extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'joined_at', 'status', 'left_at',
        'cpf', 'birth_date', 'postal_code', 'address_line', 'address_number',
        'address_complement', 'neighborhood', 'city', 'state',
        'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_phone',
        'companion_name', 'companion_phone',
    ];

    protected function casts(): array
    {
        return ['joined_at' => 'date', 'left_at' => 'date', 'birth_date' => 'date'];
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

    /** @return HasOne<User, $this> */
    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }
}
