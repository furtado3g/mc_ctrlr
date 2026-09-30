<?php

namespace App\Http\Controllers;

use App\Actions\AssertAccessAdministratorRemains;
use App\Actions\RecordAuditEvent;
use App\Models\PermissionGrant;
use App\Models\Regional;
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
        $user = $request->user();
        abort_if(! $user || ! $user->is_global, 403, 'Acesso restrito à administração global.');

        Gate::authorize('administracao.view');

        $schema = $rules->schema('admin_users');
        $query = $queries->get($user->id, 'admin_users', ['search' => '', 'filters' => [], 'sort' => $schema['default_sort'], 'direction' => 'asc', 'page' => 1, 'per_page' => 30]);
        $users = User::with(['permissionGrants', 'regional'])->when($query['search'] !== '', fn ($builder) => $builder->where(fn ($where) => $where->where('name', 'like', '%'.$query['search'].'%')->orWhere('email', 'like', '%'.$query['search'].'%')))->when(isset($query['filters']['active']), fn ($builder) => $builder->where('active', filter_var($query['filters']['active'], FILTER_VALIDATE_BOOLEAN)));
        $total = (clone $users)->count();
        $lastPage = max(1, (int) ceil($total / $query['per_page']));
        $query['page'] = min($query['page'], $lastPage);
        $queries->put($user->id, 'admin_users', $query);
        $rows = $users->orderBy($query['sort'], $query['direction'])->orderBy('id')->forPage($query['page'], $query['per_page'])->get();

        $availableRegionals = Regional::where('active', true)->orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('admin/users', [
            'users' => ['data' => $rows, 'total' => $total],
            'tableQuery' => $query,
            'availableRegionals' => $availableRegionals,
        ]);
    }

    public function store(Request $request, RecordAuditEvent $audit): RedirectResponse
    {
        $admin = $request->user();
        abort_if(! $admin || ! $admin->is_global, 403, 'Acesso restrito à administração global.');

        Gate::authorize('administracao.edit');

        $isGlobal = $request->boolean('is_global');

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:12',
            'is_global' => 'nullable|boolean',
            'regional_id' => $isGlobal ? 'nullable' : 'required|exists:regionals,id',
        ]);

        $data['is_global'] = $isGlobal;
        $data['regional_id'] = $isGlobal ? null : (int) $data['regional_id'];

        $createdUser = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'is_global' => $data['is_global'],
            'regional_id' => $data['regional_id'],
            'active' => true,
            'email_verified_at' => now(),
        ]);

        $audit->execute(
            'admin_account',
            $createdUser->id,
            'user_created',
            null,
            $createdUser->only(['name', 'email', 'is_global', 'regional_id', 'active']),
            $admin->id
        );

        return back()->with('success', 'Usuário criado com sucesso.');
    }

    public function permissions(Request $request, User $user, RecordAuditEvent $audit, AssertAccessAdministratorRemains $accessAdmin): RedirectResponse
    {
        $admin = $request->user();
        abort_if(! $admin || ! $admin->is_global, 403, 'Acesso restrito à administração global.');

        Gate::authorize('administracao.edit');

        $data = $request->validate([
            'active' => 'required|boolean',
            'is_global' => 'nullable|boolean',
            'regional_id' => 'nullable|exists:regionals,id',
            'permissions' => 'array',
            'permissions.*.area' => 'required|in:cadastros,cobrancas,caixa,relatorios,administracao,institucional',
            'permissions.*.action' => 'required|in:view,edit',
        ]);

        abort_if($user->id === $admin->id && ! $data['active'], 422, 'Não é possível desativar sua própria conta.');

        $keepsAdmin = false;
        foreach ($data['permissions'] ?? [] as $grant) {
            if ($grant['area'] === 'administracao' && $grant['action'] === 'edit') {
                $keepsAdmin = true;
            }
        }
        abort_if($user->id === $admin->id && ! $keepsAdmin, 422, 'Não é possível remover sua própria permissão de administração.');

        $hadAccessAdministrator = $accessAdmin->exists();

        DB::transaction(function () use ($user, $data, $admin, $audit, $accessAdmin, $hadAccessAdministrator) {
            $before = [
                'active' => $user->active,
                'is_global' => $user->is_global,
                'regional_id' => $user->regional_id,
                'permissions' => $user->permissionGrants()->get(['area', 'action'])->toArray(),
            ];

            $updateData = ['active' => $data['active']];
            if (\array_key_exists('is_global', $data)) {
                $updateData['is_global'] = (bool) $data['is_global'];
                $updateData['regional_id'] = $updateData['is_global'] ? null : ($data['regional_id'] ?? $user->regional_id);
            }

            $user->update($updateData);
            $user->permissionGrants()->delete();

            foreach ($data['permissions'] ?? [] as $grant) {
                PermissionGrant::firstOrCreate(
                    ['user_id' => $user->id, 'area' => $grant['area'], 'action' => $grant['action']],
                    ['granted_by' => $admin->id, 'granted_at' => now()],
                );
            }

            $audit->execute(
                'admin_account',
                $user->id,
                'permissions_updated',
                $before,
                [
                    'active' => $user->active,
                    'is_global' => $user->is_global,
                    'regional_id' => $user->regional_id,
                    'permissions' => $user->permissionGrants()->get(['area', 'action'])->toArray(),
                ],
                $admin->id
            );

            $accessAdmin->execute($hadAccessAdministrator);
        });

        return back()->with('success', 'Permissões atualizadas com sucesso.');
    }
}
