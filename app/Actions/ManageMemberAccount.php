<?php

namespace App\Actions;

use App\Models\Member;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ManageMemberAccount
{
    /** @param array{name: string, email: string, password: string} $data */
    public function create(Member $member, array $data, User $actor, RecordAuditEvent $audit): User
    {
        return DB::transaction(function () use ($member, $data, $actor, $audit) {
            if ($member->user()->exists()) {
                throw ValidationException::withMessages(['account' => 'Este membro já possui uma conta vinculada.']);
            }

            $user = User::create([...$data, 'member_id' => $member->id, 'active' => true, 'email_verified_at' => now()]);
            $audit->execute('member_account', $user->id, 'linked', null, ['member_id' => $member->id, 'email' => $user->email, 'active' => true], $actor->id);

            return $user;
        });
    }

    public function setActive(User $user, bool $active, User $actor, RecordAuditEvent $audit): void
    {
        DB::transaction(function () use ($user, $active, $actor, $audit) {
            $user = User::query()->lockForUpdate()->findOrFail($user->id);
            if ($user->active === $active) {
                return;
            }
            $hadAccessAdministrator = $this->hasAccessAdministrator();
            $before = ['member_id' => $user->member_id, 'active' => $user->active];
            $user->update(['active' => $active]);
            if ($hadAccessAdministrator && ! $this->hasAccessAdministrator()) {
                throw ValidationException::withMessages(['active' => 'A alteração removeria o último administrador de acessos.']);
            }
            $audit->execute('member_account', $user->id, $active ? 'activated' : 'deactivated', $before, ['member_id' => $user->member_id, 'active' => $user->active], $actor->id);
        });
    }

    private function hasAccessAdministrator(): bool
    {
        return User::query()->where('active', true)->get()->contains(fn (User $user) => $user->canAccess('administracao', 'edit'));
    }
}
