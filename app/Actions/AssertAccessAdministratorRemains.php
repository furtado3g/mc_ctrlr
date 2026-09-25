<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Validation\ValidationException;

class AssertAccessAdministratorRemains
{
    public function exists(): bool
    {
        return User::query()->where('active', true)->get()->contains(
            fn (User $user): bool => $user->canAccess('administracao', 'edit'),
        );
    }

    public function execute(bool $hadAccessAdministrator = true): void
    {
        if ($hadAccessAdministrator && ! $this->exists()) {
            throw ValidationException::withMessages(['access' => 'A alteração deixaria o motoclube sem administrador de acessos.']);
        }
    }
}
