<?php

namespace Tests\Feature;

use App\Models\ClubRole;
use App\Models\Member;
use App\Models\MemberMotorcycle;
use App\Models\PermissionGrant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MotoclubMembersTest extends TestCase
{
    use RefreshDatabase;

    private function editor(): User
    {
        $user = User::factory()->create();
        foreach (['view', 'edit'] as $action) {
            PermissionGrant::create(['user_id' => $user->id, 'area' => 'cadastros', 'action' => $action, 'granted_by' => $user->id, 'granted_at' => now()]);
        }

        return $user;
    }

    public function test_member_motorcycle_and_role_history_survive_status_changes(): void
    {
        $this->actingAs($this->editor());
        $this->post('/members', ['name' => 'Ana', 'joined_at' => '2026-09-01', 'status' => 'active'])->assertRedirect();
        $member = Member::firstOrFail();
        $this->post("/members/{$member->id}/motorcycles", [
            'identifier' => 'abc1234', 'manufacturer' => 'Honda', 'model' => 'CB 500', 'started_at' => '2026-09-01',
        ])->assertRedirect();
        $this->post("/members/{$member->id}/motorcycles", [
            'identifier' => 'xyz9876', 'manufacturer' => 'Yamaha', 'model' => 'MT-07', 'started_at' => '2026-09-01',
        ])->assertRedirect();
        $this->assertDatabaseHas('motorcycles', ['identifier' => 'ABC1234']);
        $link = MemberMotorcycle::firstOrFail();
        $this->patch("/member-motorcycles/{$link->id}", [
            'identifier' => 'ABC1234', 'manufacturer' => 'Honda', 'model' => 'CB 500',
            'started_at' => '2026-09-01', 'ended_at' => '2026-09-20',
        ])->assertRedirect();
        $role = ClubRole::create(['name' => 'Presidente', 'sort_order' => 1, 'active' => true]);
        $this->post("/members/{$member->id}/role-assignments", ['club_role_id' => $role->id, 'started_at' => '2026-09-01'])->assertRedirect();
        $this->patch("/members/{$member->id}", ['name' => 'Ana', 'joined_at' => '2026-09-01', 'status' => 'left', 'left_at' => '2026-09-25'])->assertRedirect();
        $this->get("/members/{$member->id}")->assertOk();
        $this->patch("/members/{$member->id}", ['name' => 'Ana', 'joined_at' => '2026-09-01', 'status' => 'active'])->assertRedirect();
        $this->assertDatabaseCount('member_motorcycles', 2);
        $this->assertDatabaseCount('role_assignments', 1);
        $this->assertDatabaseHas('member_motorcycles', ['id' => $link->id, 'ended_at' => '2026-09-20']);
        $this->assertSame('active', $member->fresh()->status);
    }

    public function test_hierarchy_does_not_grant_administrative_access(): void
    {
        $member = Member::create(['name' => 'Bruno', 'joined_at' => '2026-01-01', 'status' => 'active']);
        $role = ClubRole::create(['name' => 'Tesoureiro', 'sort_order' => 1, 'active' => true]);
        $member->roleAssignments()->create(['club_role_id' => $role->id, 'started_at' => '2026-01-01']);
        $this->actingAs(User::factory()->create())->get('/cash')->assertForbidden();
    }
}
