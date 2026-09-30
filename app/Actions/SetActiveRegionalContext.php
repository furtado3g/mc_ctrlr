<?php

namespace App\Actions;

use App\Models\Regional;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class SetActiveRegionalContext
{
    /**
     * Set the active regional context in session for a global user.
     *
     * @throws ValidationException
     */
    public function execute(User $user, ?int $regionalId): void
    {
        if (! $user->is_global) {
            abort(403, 'Apenas usuários com escopo global podem alternar o contexto regional.');
        }

        if ($regionalId === null) {
            session()->forget('active_regional_id');

            return;
        }

        $regional = Regional::where('id', $regionalId)->where('active', true)->first();

        if (! $regional) {
            throw ValidationException::withMessages([
                'regional_id' => 'A regional selecionada não foi encontrada ou está inativa.',
            ]);
        }

        session(['active_regional_id' => $regional->id]);
    }
}
