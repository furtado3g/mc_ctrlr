<?php

namespace App\Http\Controllers;

use App\Actions\SetActiveRegionalContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RegionalContextController extends Controller
{
    /**
     * Update the active regional context in session.
     */
    public function update(Request $request, SetActiveRegionalContext $action): RedirectResponse
    {
        $user = $request->user();

        if (! $user || ! $user->is_global) {
            abort(403, 'Apenas usuários com escopo global podem alternar o contexto regional.');
        }

        $data = $request->validate([
            'regional_id' => 'nullable|integer',
        ]);

        $regionalId = isset($data['regional_id']) && $data['regional_id'] !== ''
            ? (int) $data['regional_id']
            : null;

        $action->execute($user, $regionalId);

        return back();
    }
}
