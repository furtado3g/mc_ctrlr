<?php

namespace App\Http\Controllers;

use App\Actions\AssertAccessAdministratorRemains;
use App\Actions\RecordAuditEvent;
use App\Http\Requests\AccessGroupRequest;
use App\Http\Requests\RoleAccessGroupRequest;
use App\Models\AccessGroup;
use App\Models\AccessGroupPermission;
use App\Models\ClubRole;
use App\Support\AccessPermissionCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AccessGroupController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('administracao.view');

        return Inertia::render('access-groups/index', [
            'groups' => AccessGroup::with('permissions')->withCount('roles')->orderBy('name')->get(),
            'roles' => ClubRole::with('accessGroup.permissions')->orderBy('sort_order')->get(),
            'areas' => AccessPermissionCatalog::AREAS,
            'actions' => AccessPermissionCatalog::ACTIONS,
            'specialPermissions' => AccessPermissionCatalog::special(),
        ]);
    }

    public function store(AccessGroupRequest $request, RecordAuditEvent $audit): RedirectResponse
    {
        Gate::authorize('administracao.edit');
        $data = $request->validated();
        DB::transaction(function () use ($data, $request, $audit) {
            $group = AccessGroup::create(['name' => $data['name'], 'active' => $data['active']]);
            $this->syncPermissions($group, $data['permissions']);
            $audit->execute('access_group', $group->id, 'created', null, $this->snapshot($group), $request->user()->id);
        });

        return back();
    }

    public function update(AccessGroupRequest $request, AccessGroup $group, RecordAuditEvent $audit, AssertAccessAdministratorRemains $accessAdmin): RedirectResponse
    {
        Gate::authorize('administracao.edit');
        $data = $request->validated();
        $hadAccessAdministrator = $accessAdmin->exists();
        DB::transaction(function () use ($data, $group, $request, $audit, $accessAdmin, $hadAccessAdministrator) {
            $before = $this->snapshot($group);
            $group->update(['name' => $data['name'], 'active' => $data['active']]);
            $this->syncPermissions($group, $data['permissions']);
            $group->refresh();
            $audit->execute('access_group', $group->id, 'updated', $before, $this->snapshot($group), $request->user()->id);
            $accessAdmin->execute($hadAccessAdministrator);
        });

        return back();
    }

    public function destroy(Request $request, AccessGroup $group, RecordAuditEvent $audit, AssertAccessAdministratorRemains $accessAdmin): RedirectResponse
    {
        Gate::authorize('administracao.edit');
        abort_if($group->roles()->exists(), 422, 'Desassocie este grupo dos cargos antes de removê-lo.');
        $hadAccessAdministrator = $accessAdmin->exists();
        DB::transaction(function () use ($group, $request, $audit, $accessAdmin, $hadAccessAdministrator) {
            $before = $this->snapshot($group);
            $group->delete();
            $audit->execute('access_group', $group->id, 'deleted', $before, null, $request->user()->id);
            $accessAdmin->execute($hadAccessAdministrator);
        });

        return back();
    }

    public function associateRole(RoleAccessGroupRequest $request, ClubRole $role, RecordAuditEvent $audit, AssertAccessAdministratorRemains $accessAdmin): RedirectResponse
    {
        Gate::authorize('administracao.edit');
        $data = $request->validated();
        $hadAccessAdministrator = $accessAdmin->exists();
        DB::transaction(function () use ($role, $data, $request, $audit, $accessAdmin, $hadAccessAdministrator) {
            $before = ['access_group_id' => $role->access_group_id];
            $role->update(['access_group_id' => $data['access_group_id'] ?? null]);
            $audit->execute('club_role', $role->id, 'access_group_changed', $before, ['access_group_id' => $role->access_group_id], $request->user()->id);
            $accessAdmin->execute($hadAccessAdministrator);
        });

        return back();
    }

    /** @param list<array{area: string, action: string}> $permissions */
    private function syncPermissions(AccessGroup $group, array $permissions): void
    {
        $unique = collect($permissions)->unique(fn ($permission) => $permission['area'].'.'.$permission['action']);
        $group->permissions()->delete();
        foreach ($unique as $permission) {
            AccessGroupPermission::create(['access_group_id' => $group->id, ...$permission]);
        }
    }

    /** @return array<string, mixed> */
    private function snapshot(AccessGroup $group): array
    {
        return ['name' => $group->name, 'active' => $group->active, 'permissions' => $group->permissions()->orderBy('area')->orderBy('action')->get(['area', 'action'])->toArray()];
    }
}
