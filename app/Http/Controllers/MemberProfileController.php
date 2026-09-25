<?php

namespace App\Http\Controllers;

use App\Actions\RecordAuditEvent;
use App\Http\Requests\MemberProfileRequest;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MemberProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $member = $this->ownMember($request);
        $member->load(['motorcycleLinks.motorcycle']);

        return Inertia::render('member-profile/index', [
            'member' => $member,
            'canEditJoinedAt' => $request->user()->canAccess('membros', 'edit_joined_at'),
        ]);
    }

    public function update(MemberProfileRequest $request): RedirectResponse
    {
        $this->ownMember($request)->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Perfil atualizado.']);

        return back();
    }

    public function updateMembershipDate(Request $request, RecordAuditEvent $audit): RedirectResponse
    {
        $member = $this->ownMember($request);
        abort_unless($request->user()->canAccess('membros', 'edit_joined_at'), 403);

        $data = $request->validate([
            'joined_at' => ['required', 'date', 'before_or_equal:today'],
        ]);
        $before = substr((string) $member->getRawOriginal('joined_at'), 0, 10);
        $after = $data['joined_at'];

        DB::transaction(function () use ($member, $before, $after, $audit, $request) {
            $member->update(['joined_at' => $after]);
            if ($before !== $after) {
                $audit->execute('member', $member->id, 'membership_date_changed', ['joined_at' => $before], ['joined_at' => $after], $request->user()->id);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data de ingresso atualizada.']);

        return back();
    }

    private function ownMember(Request $request): Member
    {
        $member = $request->user()?->member;
        if (! $member instanceof Member) {
            abort(403);
        }

        return $member;
    }
}
