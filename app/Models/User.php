<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'active', 'email_verified_at', 'member_id'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /** @return HasMany<PermissionGrant, $this> */
    public function permissionGrants(): HasMany
    {
        return $this->hasMany(PermissionGrant::class);
    }

    public function canAccess(string $area, string $action): bool
    {
        if (! $this->active) {
            return false;
        }

        if ($area === 'membros' && $action === 'edit_joined_at' && $this->member_id === null) {
            return false;
        }

        if ($this->member_id === null) {
            return $this->permissionGrants()->where('area', $area)->where('action', $action)->exists();
        }

        $assignment = RoleAssignment::query()
            ->where('member_id', $this->member_id)
            ->whereDate('started_at', '<=', today())
            ->where(fn ($query) => $query->whereNull('ended_at')->orWhereDate('ended_at', '>=', today()))
            ->whereHas('clubRole', fn ($query) => $query->where('active', true))
            ->join('club_roles', 'role_assignments.club_role_id', '=', 'club_roles.id')
            ->orderBy('club_roles.sort_order')
            ->orderBy('role_assignments.id')
            ->select('role_assignments.*')
            ->first();

        if (! $assignment || ! $assignment->clubRole->access_group_id) {
            return false;
        }

        return AccessGroupPermission::query()
            ->where('area', $area)->where('action', $action)
            ->whereHas('accessGroup', fn ($query) => $query->where('active', true)->whereKey($assignment->clubRole->access_group_id))
            ->exists();
    }

    /** @return BelongsTo<Member, $this> */
    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            /* @chisel-2fa */
            'two_factor_confirmed_at' => 'datetime',
            /* @end-chisel-2fa */
        ];
    }
}
