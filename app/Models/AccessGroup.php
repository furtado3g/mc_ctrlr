<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccessGroup extends Model
{
    protected $fillable = ['name', 'active'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    /** @return HasMany<AccessGroupPermission, $this> */
    public function permissions(): HasMany
    {
        return $this->hasMany(AccessGroupPermission::class);
    }

    /** @return HasMany<ClubRole, $this> */
    public function roles(): HasMany
    {
        return $this->hasMany(ClubRole::class);
    }
}
