<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberMotorcycle extends Model
{
    protected $fillable = ['member_id', 'motorcycle_id', 'started_at', 'ended_at'];

    protected function casts(): array
    {
        return ['started_at' => 'date', 'ended_at' => 'date'];
    }

    /** @return BelongsTo<Motorcycle, $this> */
    public function motorcycle(): BelongsTo
    {
        return $this->belongsTo(Motorcycle::class);
    }

    /** @return BelongsTo<Member, $this> */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
