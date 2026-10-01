<?php

namespace App\Http\Middleware;

use App\Models\Regional;
use App\Support\InstitutionalBrand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $draftScope = null;
        $currentRegional = null;
        $availableRegionals = [];

        if ($user) {
            $user->loadMissing('profile');
            $draftScope = $request->session()->get('ui_draft_scope');
            if (! \is_string($draftScope) || $draftScope === '') {
                $draftScope = (string) Str::uuid();
                $request->session()->put('ui_draft_scope', $draftScope);
            }

            if ($user->is_global) {
                $activeRegionalId = $request->session()->get('active_regional_id');
                if ($activeRegionalId) {
                    $active = Regional::find($activeRegionalId);
                    if ($active) {
                        $active->loadMissing(['cities' => fn ($q) => $q->where('active', true)->orderByDesc('is_headquarters')->orderBy('name')]);
                        $currentRegional = [
                            'id' => $active->id,
                            'name' => $active->name,
                            'code' => $active->code,
                            'city' => $active->city,
                            'state' => $active->state,
                            'cities' => $active->cities->map(fn ($c) => [
                                'id' => $c->id,
                                'name' => $c->name,
                                'state' => $c->state,
                                'is_headquarters' => (bool) $c->is_headquarters,
                            ])->values()->all(),
                        ];
                    }
                }
                $availableRegionals = Regional::where('active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code'])
                    ->toArray();
            } else {
                if ($user->regional_id) {
                    if (! $user->relationLoaded('regional')) {
                        $user->load('regional');
                    }
                    if ($user->regional) {
                        $user->regional->loadMissing(['cities' => fn ($q) => $q->where('active', true)->orderByDesc('is_headquarters')->orderBy('name')]);
                        $currentRegional = [
                            'id' => $user->regional->id,
                            'name' => $user->regional->name,
                            'code' => $user->regional->code,
                            'city' => $user->regional->city,
                            'state' => $user->regional->state,
                            'cities' => $user->regional->cities->map(fn ($c) => [
                                'id' => $c->id,
                                'name' => $c->name,
                                'state' => $c->state,
                                'is_headquarters' => (bool) $c->is_headquarters,
                            ])->values()->all(),
                        ];
                    }
                }
            }
        }

        return [
            ...parent::share($request),
            ...InstitutionalBrand::published(),
            'auth' => [
                'user' => $user,
                'hasMemberProfile' => (bool) $user?->member_id,
                'permissions' => $user ? collect(['cadastros', 'cobrancas', 'caixa', 'relatorios', 'administracao', 'institucional'])->flatMap(fn (string $area) => collect(['view', 'edit'])->filter(fn (string $action) => $user->canAccess($area, $action))->map(fn (string $action) => ['area' => $area, 'action' => $action])->values())->values() : [],
                'draftScope' => $draftScope,
            ],
            'currentRegional' => $currentRegional,
            'availableRegionals' => $availableRegionals,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
