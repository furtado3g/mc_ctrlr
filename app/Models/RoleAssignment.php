<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoleAssignment extends Model
{
    protected $fillable = ['member_id', 'club_role_id', 'started_at', 'ended_at'];

    protected function casts(): array
    {
        return ['started_at' => 'date', 'ended_at' => 'date'];
    }

    /** @return BelongsTo<ClubRole, $this> */
    public function clubRole(): BelongsTo
    {
        return $this->belongsTo(ClubRole::class);
    }

    /** @return BelongsTo<Member, $this> */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
