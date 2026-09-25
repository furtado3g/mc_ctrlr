<?php

namespace App\Http\Controllers;

use App\Actions\AssertAccessAdministratorRemains;
use App\Actions\RecordAuditEvent;
use App\Http\Requests\RoleAssignmentRequest;
use App\Models\Member;
use App\Models\RoleAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RoleAssignmentController extends Controller
{
    public function store(RoleAssignmentRequest $request, Member $member, RecordAuditEvent $audit, AssertAccessAdministratorRemains $accessAdmin): RedirectResponse
    {
        $data = $request->validated();
        $this->assertNoOverlap($member->id, $data, null);
        $hadAccessAdministrator = $accessAdmin->exists();
        DB::transaction(function () use ($member, $data, $request, $audit, $accessAdmin, $hadAccessAdministrator) {
            $assignment = $member->roleAssignments()->create($data);
            $audit->execute('role_assignment', $assignment->id, 'created', null, $assignment->only(['member_id', 'club_role_id', 'started_at', 'ended_at']), $request->user()->id);
            $accessAdmin->execute($hadAccessAdministrator);
        });

        return back();
    }

    public function update(RoleAssignmentRequest $request, RoleAssignment $assignment, RecordAuditEvent $audit, AssertAccessAdministratorRemains $accessAdmin): RedirectResponse
    {
        $data = $request->validated();
        $this->assertNoOverlap($assignment->member_id, $data, $assignment->id);
        $hadAccessAdministrator = $accessAdmin->exists();
        DB::transaction(function () use ($assignment, $data, $request, $audit, $accessAdmin, $hadAccessAdministrator) {
            $before = $assignment->only(['member_id', 'club_role_id', 'started_at', 'ended_at']);
            $assignment->update($data);
            $audit->execute('role_assignment', $assignment->id, 'updated', $before, $assignment->only(['member_id', 'club_role_id', 'started_at', 'ended_at']), $request->user()->id);
            $accessAdmin->execute($hadAccessAdministrator);
        });

        return back();
    }

    /** @param array<string, mixed> $data */
    private function assertNoOverlap(int $memberId, array $data, ?int $except): void
    {
        $query = RoleAssignment::where('member_id', $memberId)
            ->where('club_role_id', $data['club_role_id'])
            ->where('started_at', '<=', $data['ended_at'] ?? '9999-12-31')
            ->where(fn ($q) => $q->whereNull('ended_at')->orWhere('ended_at', '>=', $data['started_at']));
        if ($except) {
            $query->whereKeyNot($except);
        }
        if ($query->exists()) {
            throw ValidationException::withMessages(['started_at' => 'Vigência sobreposta para o mesmo cargo.']);
        }
    }
}
