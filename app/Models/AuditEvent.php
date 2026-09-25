<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditEvent extends Model
{
    public $timestamps = false;

    protected $fillable = ['entity', 'entity_id', 'action', 'user_id', 'before', 'after', 'occurred_at'];

    protected function casts(): array
    {
        return ['before' => 'array', 'after' => 'array', 'occurred_at' => 'datetime'];
    }
}
