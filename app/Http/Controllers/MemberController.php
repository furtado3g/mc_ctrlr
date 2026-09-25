<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemberRequest;
use App\Models\ClubRole;
use App\Models\Member;
use App\Support\SessionTableQuery;
use App\Support\TableQueryRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(Request $request, SessionTableQuery $queries, TableQueryRules $rules): Response
    {
        Gate::authorize('cadastros.view');
        $schema = $rules->schema('members');
        $query = $queries->get($request->user()->id, 'members', ['search' => '', 'filters' => [], 'sort' => $schema['default_sort'], 'direction' => 'asc', 'page' => 1, 'per_page' => 30]);
        $members = Member::query()->when($query['search'] !== '', fn ($builder) => $builder->where(function ($where) use ($query) {
            $term = '%'.addcslashes($query['search'], '%_\\').'%';
            $where->where('name', 'like', $term)->orWhere('email', 'like', $term)->orWhere('phone', 'like', $term);
        }))->when(isset($query['filters']['status']), fn ($builder) => $builder->where('status', $query['filters']['status']));
        $total = (clone $members)->count();
        $lastPage = max(1, (int) ceil($total / $query['per_page']));
        $query['page'] = min($query['page'], $lastPage);
        $queries->put($request->user()->id, 'members', $query);
        $rows = $members->select(['id', 'name', 'email', 'phone', 'joined_at', 'status', 'left_at'])
            ->orderBy($query['sort'], $query['direction'])->orderBy('id')->forPage($query['page'], $query['per_page'])->get();

        return Inertia::render('members/index', [
            'members' => ['data' => $rows, 'total' => $total, 'current_page' => $query['page'], 'last_page' => $lastPage, 'per_page' => $query['per_page']],
            'tableQuery' => $query,
        ]);
    }

    public function store(MemberRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['left_at'] = $data['status'] === 'active' ? null : ($data['left_at'] ?? today());
        $member = Member::create($data);

        return redirect("/members/{$member->id}");
    }

    public function show(Member $member): Response
    {
        Gate::authorize('cadastros.view');
        $user = request()->user();
        $canManageAccounts = $user->canAccess('administracao', 'edit');
        $canEditMembers = $user->canAccess('cadastros', 'edit');
        $member->load(['motorcycleLinks.motorcycle', 'roleAssignments.clubRole']);
        $member->setRelation('user', $canManageAccounts ? $member->user()->first() : null);

        return Inertia::render('members/show', [
            'member' => $member,
            'canManageAccounts' => $canManageAccounts,
            'canEditMembers' => $canEditMembers,
            'roles' => ClubRole::where('active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function update(MemberRequest $request, Member $member): RedirectResponse
    {
        $data = $request->validated();
        $data['left_at'] = $data['status'] === 'active' ? null : ($data['left_at'] ?? today());
        $member->update($data);

        return back();
    }
}
