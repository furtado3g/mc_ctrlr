<?php

namespace App\Http\Controllers;

use App\Actions\AssertAccessAdministratorRemains;
use App\Actions\RecordAuditEvent;
use App\Models\PermissionGrant;
use App\Models\User;
use App\Support\SessionTableQuery;
use App\Support\TableQueryRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(Request $request, SessionTableQuery $queries, TableQueryRules $rules): Response
    {
        Gate::authorize('administracao.view');

        $schema = $rules->schema('admin_users');
        $query = $queries->get($request->user()->id, 'admin_users', ['search' => '', 'filters' => [], 'sort' => $schema['default_sort'], 'direction' => 'asc', 'page' => 1, 'per_page' => 30]);
        $users = User::with('permissionGrants')->when($query['search'] !== '', fn ($builder) => $builder->where(fn ($where) => $where->where('name', 'like', '%'.$query['search'].'%')->orWhere('email', 'like', '%'.$query['search'].'%')))->when(isset($query['filters']['active']), fn ($builder) => $builder->where('active', filter_var($query['filters']['active'], FILTER_VALIDATE_BOOLEAN)));
        $total = (clone $users)->count();
        $lastPage = max(1, (int) ceil($total / $query['per_page']));
        $query['page'] = min($query['page'], $lastPage);
        $queries->put($request->user()->id, 'admin_users', $query);
        $rows = $users->orderBy($query['sort'], $query['direction'])->orderBy('id')->forPage($query['page'], $query['per_page'])->get();

        return Inertia::render('admin/users', ['users' => ['data' => $rows, 'total' => $total], 'tableQuery' => $query]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('administracao.edit');
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:12',
        ]);
        User::create([...$data, 'active' => true, 'email_verified_at' => now()]);

        return back();
    }

    public function permissions(Request $request, User $user, RecordAuditEvent $audit, AssertAccessAdministratorRemains $accessAdmin): RedirectResponse
    {
        Gate::authorize('administracao.edit');
        $data = $request->validate([
            'active' => 'required|boolean',
            'permissions' => 'array',
            'permissions.*.area' => 'required|in:cadastros,cobrancas,caixa,relatorios,administracao,institucional',
            'permissions.*.action' => 'required|in:view,edit',
        ]);
        abort_if($user->id === $request->user()->id && ! $data['active'], 422, 'Não é possível desativar sua própria conta.');
        $keepsAdmin = false;
        foreach ($data['permissions'] ?? [] as $grant) {
            if ($grant['area'] === 'administracao' && $grant['action'] === 'edit') {
                $keepsAdmin = true;
            }
        }
        abort_if($user->id === $request->user()->id && ! $keepsAdmin, 422, 'Não é possível remover sua própria permissão de administração.');
        $hadAccessAdministrator = $accessAdmin->exists();
        DB::transaction(function () use ($user, $data, $request, $audit, $accessAdmin, $hadAccessAdministrator) {
            $before = ['active' => $user->active, 'permissions' => $user->permissionGrants()->get(['area', 'action'])->toArray()];
            $user->update(['active' => $data['active']]);
            $user->permissionGrants()->delete();
            foreach ($data['permissions'] ?? [] as $grant) {
                PermissionGrant::firstOrCreate(
                    ['user_id' => $user->id, 'area' => $grant['area'], 'action' => $grant['action']],
                    ['granted_by' => $request->user()->id, 'granted_at' => now()],
                );
            }
            $audit->execute('admin_account', $user->id, 'permissions_updated', $before, ['active' => $user->active, 'permissions' => $user->permissionGrants()->get(['area', 'action'])->toArray()], $request->user()->id);
            $accessAdmin->execute($hadAccessAdministrator);
        });

        return back();
    }
}
