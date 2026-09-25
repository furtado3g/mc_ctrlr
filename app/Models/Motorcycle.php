<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Motorcycle extends Model
{
    protected $fillable = ['identifier', 'manufacturer', 'model', 'year'];

    /** @return HasMany<MemberMotorcycle, $this> */
    public function memberLinks(): HasMany
    {
        return $this->hasMany(MemberMotorcycle::class);
    }
}
