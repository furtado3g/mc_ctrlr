<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermissionGrant extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'area', 'action', 'granted_by', 'granted_at'];

    protected function casts(): array
    {
        return ['granted_at' => 'datetime'];
    }
}
