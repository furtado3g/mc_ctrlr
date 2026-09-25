<?php

namespace Tests\Feature;

use App\Models\AccessGroup;
use App\Models\AccessGroupPermission;
use App\Models\AuditEvent;
use App\Models\ClubRole;
use App\Models\Member;
use App\Models\RoleAssignment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AccessGroupMembershipDatePermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_member_can_change_membership_date_only_when_current_role_group_grants_the_specific_permission(): void
    {
        [$user, $member] = $this->memberWithPermission();

        $this->actingAs($user)->get('/me/profile')
            ->assertInertia(fn (Assert $page) => $page->where('canEditJoinedAt', true));
        $this->actingAs($user)->patch('/me/profile/membership-date', ['joined_at' => '2020-05-06'])->assertRedirect();

        $this->assertDatabaseHas('members', ['id' => $member->id, 'joined_at' => '2020-05-06']);
        $this->assertDatabaseHas('audit_events', [
            'entity' => 'member',
            'entity_id' => $member->id,
            'action' => 'membership_date_changed',
            'user_id' => $user->id,
        ]);
        $this->assertFalse($user->fresh()->canAccess('cadastros', 'edit'));
    }

    public function test_member_can_see_date_but_cannot_change_it_without_specific_permission(): void
    {
        $member = Member::create(['name' => 'Joana', 'joined_at' => '2021-04-03', 'status' => 'active']);
        $user = User::factory()->create(['member_id' => $member->id]);

        $this->actingAs($user)->get('/me/profile')
            ->assertInertia(fn (Assert $page) => $page
                ->where('member.joined_at', fn (string $date) => str_starts_with($date, '2021-04-03'))
                ->where('canEditJoinedAt', false));
        $this->actingAs($user)->patch('/me/profile/membership-date', ['joined_at' => '2020-05-06'])->assertForbidden();
        $this->assertDatabaseHas('members', ['id' => $member->id, 'joined_at' => '2021-04-03']);
        $this->assertSame(0, AuditEvent::where('entity', 'member')->count());
    }

    public function test_inactive_role_or_group_does_not_grant_membership_date_permission(): void
    {
        [$user, $member, $role, $group] = $this->memberWithPermission();
        $role->update(['active' => false]);

        $this->actingAs($user)->patch('/me/profile/membership-date', ['joined_at' => '2020-05-06'])->assertForbidden();
        $role->update(['active' => true]);
        $group->update(['active' => false]);
        $this->actingAs($user)->patch('/me/profile/membership-date', ['joined_at' => '2020-05-06'])->assertForbidden();
        $this->assertDatabaseHas('members', ['id' => $member->id, 'joined_at' => $member->joined_at->toDateString()]);
    }

    /** @return array{User, Member, ClubRole, AccessGroup} */
    private function memberWithPermission(): array
    {
        $member = Member::create(['name' => 'Joana', 'joined_at' => '2021-04-03', 'status' => 'active']);
        $group = AccessGroup::create(['name' => 'Ingresso', 'active' => true]);
        AccessGroupPermission::create(['access_group_id' => $group->id, 'area' => 'membros', 'action' => 'edit_joined_at']);
        $role = ClubRole::create(['name' => 'Secretária', 'sort_order' => 1, 'active' => true, 'access_group_id' => $group->id]);
        RoleAssignment::create(['member_id' => $member->id, 'club_role_id' => $role->id, 'started_at' => today()->subMonth()]);
        $user = User::factory()->create(['member_id' => $member->id]);

        return [$user, $member, $role, $group];
    }
}
