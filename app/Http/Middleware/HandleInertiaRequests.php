<?php

namespace App\Http\Middleware;

use App\Services\Cache\AppCacheManagerInterface;
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

            $cache = app(AppCacheManagerInterface::class);

            if ($user->is_global) {
                $activeRegionalId = $request->session()->get('active_regional_id');
                if ($activeRegionalId) {
                    $currentRegional = $cache->getActiveRegionalWithCities((int) $activeRegionalId);
                }
                $availableRegionals = $cache->getActiveRegionals();
            } else {
                if ($user->regional_id) {
                    $currentRegional = $cache->getActiveRegionalWithCities((int) $user->regional_id);
                }
            }
        }

        $cache = app(AppCacheManagerInterface::class);

        return [
            ...parent::share($request),
            ...InstitutionalBrand::published(),
            'auth' => [
                'user' => $user,
                'hasMemberProfile' => (bool) $user?->member_id,
                'permissions' => $user ? $cache->getUserPermissions($user) : [],
                'draftScope' => $draftScope,
            ],
            'currentRegional' => $currentRegional,
            'availableRegionals' => $availableRegionals,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
