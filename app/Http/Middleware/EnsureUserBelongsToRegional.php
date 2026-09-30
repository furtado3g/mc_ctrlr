<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserBelongsToRegional
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        // Global users have full access across regionals
        if ($user->is_global) {
            return $next($request);
        }

        // Regional users must have an assigned and active regional
        if ($user->regional_id === null) {
            abort(403, 'Usuário sem regional atribuída. Contate o administrador.');
        }

        if (! $user->relationLoaded('regional')) {
            $user->load('regional');
        }

        if (! $user->regional || ! $user->regional->active) {
            abort(403, 'A regional vinculada a este usuário está inativa.');
        }

        return $next($request);
    }
}
