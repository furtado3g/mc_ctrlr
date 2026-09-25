<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashCorrection extends Model
{
    public $timestamps = false;

    protected $fillable = ['cash_movement_id', 'action', 'reason', 'before', 'after', 'user_id', 'created_at'];

    protected function casts(): array
    {
        return ['before' => 'array', 'after' => 'array', 'created_at' => 'datetime'];
    }
}
