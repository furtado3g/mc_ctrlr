<?php

namespace App\Http\Controllers;

use App\Actions\ManageMemberAccount;
use App\Actions\RecordAuditEvent;
use App\Http\Requests\MemberAccountRequest;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MemberAccountController extends Controller
{
    public function store(MemberAccountRequest $request, Member $member, ManageMemberAccount $accounts, RecordAuditEvent $audit): RedirectResponse
    {
        Gate::authorize('administracao.edit');
        /** @var array{name: string, email: string, password: string} $data */
        $data = $request->validated();
        $accounts->create($member, $data, $request->user(), $audit);

        return back();
    }

    public function update(Request $request, Member $member, ManageMemberAccount $accounts, RecordAuditEvent $audit): RedirectResponse
    {
        Gate::authorize('administracao.edit');
        $data = $request->validate(['active' => ['required', 'boolean']]);
        $user = $member->user()->firstOrFail();
        $accounts->setActive($user, $data['active'], $request->user(), $audit);

        return back();
    }
}
