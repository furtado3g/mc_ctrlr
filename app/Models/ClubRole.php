<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClubRole extends Model
{
    protected $fillable = ['name', 'sort_order', 'active', 'access_group_id'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    /** @return HasMany<RoleAssignment, $this> */
    public function assignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }

    /** @return BelongsTo<AccessGroup, $this> */
    public function accessGroup(): BelongsTo
    {
        return $this->belongsTo(AccessGroup::class);
    }
}
