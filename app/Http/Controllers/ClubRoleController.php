<?php

namespace App\Http\Controllers;

use App\Actions\AssertAccessAdministratorRemains;
use App\Actions\RecordAuditEvent;
use App\Http\Requests\ClubRoleRequest;
use App\Models\ClubRole;
use App\Support\SessionTableQuery;
use App\Support\TableQueryRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ClubRoleController extends Controller
{
    public function index(Request $request, SessionTableQuery $queries, TableQueryRules $rules): Response
    {
        Gate::authorize('cadastros.view');

        $schema = $rules->schema('roles');
        $query = $queries->get($request->user()->id, 'roles', ['search' => '', 'filters' => [], 'sort' => $schema['default_sort'], 'direction' => 'asc', 'page' => 1, 'per_page' => 30]);
        $roles = ClubRole::query()->when($query['search'] !== '', fn ($builder) => $builder->where('name', 'like', '%'.$query['search'].'%'))->when(isset($query['filters']['active']), fn ($builder) => $builder->where('active', filter_var($query['filters']['active'], FILTER_VALIDATE_BOOLEAN)));
        $total = (clone $roles)->count();
        $lastPage = max(1, (int) ceil($total / $query['per_page']));
        $query['page'] = min($query['page'], $lastPage);
        $queries->put($request->user()->id, 'roles', $query);
        $rows = $roles->orderBy($query['sort'], $query['direction'])->orderBy('id')->forPage($query['page'], $query['per_page'])->get();

        return Inertia::render('club-roles/index', ['roles' => ['data' => $rows, 'total' => $total], 'formOrder' => ClubRole::max('sort_order') + 1, 'tableQuery' => $query]);
    }

    public function store(ClubRoleRequest $request): RedirectResponse
    {
        ClubRole::create($request->validated());

        return back();
    }

    public function update(ClubRoleRequest $request, ClubRole $role, RecordAuditEvent $audit, AssertAccessAdministratorRemains $accessAdmin): RedirectResponse
    {
        $data = $request->validated();
        $hadAccessAdministrator = $accessAdmin->exists();
        DB::transaction(function () use ($role, $data, $request, $audit, $accessAdmin, $hadAccessAdministrator) {
            $before = $role->only(['name', 'sort_order', 'active', 'access_group_id']);
            $role->update($data);
            $audit->execute('club_role', $role->id, 'updated', $before, $role->only(['name', 'sort_order', 'active', 'access_group_id']), $request->user()->id);
            $accessAdmin->execute($hadAccessAdministrator);
        });

        return back();
    }
}
