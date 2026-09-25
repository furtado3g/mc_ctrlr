<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccessGroupPermission extends Model
{
    public $timestamps = false;

    protected $fillable = ['access_group_id', 'area', 'action'];

    /** @return BelongsTo<AccessGroup, $this> */
    public function accessGroup(): BelongsTo
    {
        return $this->belongsTo(AccessGroup::class);
    }
}
