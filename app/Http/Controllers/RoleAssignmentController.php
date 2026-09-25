<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleAssignmentRequest;
use App\Models\Member;
use App\Models\RoleAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class RoleAssignmentController extends Controller
{
    public function store(RoleAssignmentRequest $request, Member $member): RedirectResponse
    {
        $data = $request->validated();
        $this->assertNoOverlap($member->id, $data, null);
        $member->roleAssignments()->create($data);

        return back();
    }

    public function update(RoleAssignmentRequest $request, RoleAssignment $assignment): RedirectResponse
    {
        $data = $request->validated();
        $this->assertNoOverlap($assignment->member_id, $data, $assignment->id);
        $assignment->update($data);

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
