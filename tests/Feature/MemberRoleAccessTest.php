<?php

namespace Tests\Feature;

use App\Models\AccessGroup;
use App\Models\AccessGroupPermission;
use App\Models\ClubRole;
use App\Models\Member;
use App\Models\RoleAssignment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberRoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_account_inherits_only_current_role_group_permissions_and_updates_immediately(): void
    {
        $member = Member::create(['name' => 'Joana', 'joined_at' => today(), 'status' => 'active']);
        $group = AccessGroup::create(['name' => 'Leitura', 'active' => true]);
        AccessGroupPermission::create(['access_group_id' => $group->id, 'area' => 'cadastros', 'action' => 'view']);
        $role = ClubRole::create(['name' => 'Secretária', 'sort_order' => 2, 'active' => true, 'access_group_id' => $group->id]);
        RoleAssignment::create(['member_id' => $member->id, 'club_role_id' => $role->id, 'started_at' => today()->subMonth()]);
        $user = User::factory()->create(['member_id' => $member->id]);

        $this->actingAs($user)->get('/members')->assertOk();
        $this->actingAs($user)->get('/cash')->assertForbidden();
        $this->actingAs($user)->post('/members', ['name' => 'Ataque', 'joined_at' => today()->toDateString(), 'status' => 'active'])->assertForbidden();

        $group->permissions()->create(['area' => 'caixa', 'action' => 'view']);
        $this->actingAs($user)->get('/cash')->assertOk();
        $group->update(['active' => false]);
        $this->actingAs($user)->get('/cash')->assertForbidden();
        $group->update(['active' => true]);
        $role->update(['active' => false]);
        $this->actingAs($user)->get('/cash')->assertForbidden();
    }

    public function test_expired_role_assignment_does_not_grant_access(): void
    {
        $member = Member::create(['name' => 'Rui', 'joined_at' => today(), 'status' => 'active']);
        $group = AccessGroup::create(['name' => 'Caixa', 'active' => true]);
        $group->permissions()->create(['area' => 'caixa', 'action' => 'view']);
        $role = ClubRole::create(['name' => 'Tesoureiro', 'sort_order' => 1, 'active' => true, 'access_group_id' => $group->id]);
        RoleAssignment::create(['member_id' => $member->id, 'club_role_id' => $role->id, 'started_at' => today()->subYear(), 'ended_at' => today()->subDay()]);
        $user = User::factory()->create(['member_id' => $member->id]);

        $this->assertFalse($user->canAccess('caixa', 'view'));
        $this->actingAs($user)->get('/cash')->assertForbidden();
    }

    public function test_overlapping_roles_use_only_the_highest_precedence_role(): void
    {
        $member = Member::create(['name' => 'Lia', 'joined_at' => today(), 'status' => 'active']);
        $group = AccessGroup::create(['name' => 'Presidência', 'active' => true]);
        $group->permissions()->create(['area' => 'cadastros', 'action' => 'view']);
        $higher = ClubRole::create(['name' => 'Presidente', 'sort_order' => 1, 'active' => true, 'access_group_id' => $group->id]);
        $lower = ClubRole::create(['name' => 'Diretora', 'sort_order' => 2, 'active' => true]);
        RoleAssignment::create(['member_id' => $member->id, 'club_role_id' => $higher->id, 'started_at' => today()->subDay()]);
        RoleAssignment::create(['member_id' => $member->id, 'club_role_id' => $lower->id, 'started_at' => today()->subDay()]);
        $user = User::factory()->create(['member_id' => $member->id]);

        $this->assertTrue($user->canAccess('cadastros', 'view'));
        $higher->update(['access_group_id' => null]);
        $this->assertFalse($user->fresh()->canAccess('cadastros', 'view'));
    }

    public function test_unlinked_administrator_keeps_direct_permission_grants(): void
    {
        $admin = User::factory()->create();
        $admin->permissionGrants()->create(['area' => 'caixa', 'action' => 'view', 'granted_by' => $admin->id, 'granted_at' => now()]);

        $this->assertTrue($admin->canAccess('caixa', 'view'));
    }
}
