<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    public $timestamps = false;

    protected $fillable = ['cash_movement_id', 'path', 'original_name', 'mime_type', 'size_bytes', 'uploaded_by', 'uploaded_at'];

    protected function casts(): array
    {
        return ['uploaded_at' => 'datetime'];
    }
}
