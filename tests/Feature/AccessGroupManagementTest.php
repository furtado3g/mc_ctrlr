<?php

namespace Tests\Feature;

use App\Models\AccessGroup;
use App\Models\AuditEvent;
use App\Models\ClubRole;
use App\Models\Member;
use App\Models\PermissionGrant;
use App\Models\RoleAssignment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccessGroupManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_administrator_can_manage_groups_and_role_association_is_audited(): void
    {
        $admin = User::factory()->create();
        PermissionGrant::create(['user_id' => $admin->id, 'area' => 'administracao', 'action' => 'view', 'granted_by' => $admin->id, 'granted_at' => now()]);
        PermissionGrant::create(['user_id' => $admin->id, 'area' => 'administracao', 'action' => 'edit', 'granted_by' => $admin->id, 'granted_at' => now()]);
        $role = ClubRole::create(['name' => 'Presidente', 'sort_order' => 1, 'active' => true]);

        $this->actingAs($admin)->post('/access-groups', ['name' => 'Diretoria', 'active' => true, 'permissions' => [['area' => 'cadastros', 'action' => 'view'], ['area' => 'cadastros', 'action' => 'view'], ['area' => 'relatorios', 'action' => 'view']]])->assertRedirect();
        $group = AccessGroup::firstOrFail();
        $this->patch("/club-roles/{$role->id}/access-group", ['access_group_id' => $group->id])->assertRedirect();

        $this->assertDatabaseHas('club_roles', ['id' => $role->id, 'access_group_id' => $group->id]);
        $event = AuditEvent::where('entity', 'club_role')->firstOrFail();
        $this->assertSame(['access_group_id' => null], $event->before);
        $this->assertSame(['access_group_id' => $group->id], $event->after);
        $this->assertSame($admin->id, $event->user_id);
        $this->assertDatabaseCount('access_group_permissions', 2);
        $this->actingAs($admin)->post('/access-groups', ['name' => 'Inválido', 'active' => true, 'permissions' => [['area' => 'desconhecida', 'action' => 'view']]])->assertSessionHasErrors('permissions.0.area');
    }

    public function test_administrator_can_grant_the_specific_membership_date_permission_only_as_a_valid_pair(): void
    {
        $admin = User::factory()->create();
        PermissionGrant::create(['user_id' => $admin->id, 'area' => 'administracao', 'action' => 'view', 'granted_by' => $admin->id, 'granted_at' => now()]);
        PermissionGrant::create(['user_id' => $admin->id, 'area' => 'administracao', 'action' => 'edit', 'granted_by' => $admin->id, 'granted_at' => now()]);

        $this->actingAs($admin)->post('/access-groups', [
            'name' => 'Secretaria',
            'active' => true,
            'permissions' => [['area' => 'membros', 'action' => 'edit_joined_at']],
        ])->assertRedirect();

        $group = AccessGroup::where('name', 'Secretaria')->firstOrFail();
        $this->assertDatabaseHas('access_group_permissions', [
            'access_group_id' => $group->id,
            'area' => 'membros',
            'action' => 'edit_joined_at',
        ]);

        $this->actingAs($admin)->post('/access-groups', [
            'name' => 'Permissão inválida',
            'active' => true,
            'permissions' => [['area' => 'membros', 'action' => 'view']],
        ])->assertSessionHasErrors('permissions.0.action');
    }

    public function test_user_without_access_administration_cannot_change_groups(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->post('/access-groups', ['name' => 'Bloqueado', 'active' => true, 'permissions' => []])->assertForbidden();
    }

    public function test_group_change_cannot_remove_the_last_access_administrator(): void
    {
        $group = AccessGroup::create(['name' => 'Administração', 'active' => true]);
        $group->permissions()->create(['area' => 'administracao', 'action' => 'edit']);
        $group->permissions()->create(['area' => 'administracao', 'action' => 'view']);
        $role = ClubRole::create(['name' => 'Conselheira', 'sort_order' => 1, 'active' => true, 'access_group_id' => $group->id]);
        $member = Member::create(['name' => 'Marta', 'joined_at' => today(), 'status' => 'active']);
        RoleAssignment::create(['member_id' => $member->id, 'club_role_id' => $role->id, 'started_at' => today()->subDay()]);
        $manager = User::factory()->create(['member_id' => $member->id]);

        $this->actingAs($manager)->patch("/access-groups/{$group->id}", ['name' => 'Administração', 'active' => true, 'permissions' => []])->assertSessionHasErrors('access');

        $this->assertDatabaseHas('access_group_permissions', ['access_group_id' => $group->id, 'area' => 'administracao', 'action' => 'edit']);
    }

    public function test_administrator_can_provision_and_deactivate_a_member_account_with_audit(): void
    {
        $admin = User::factory()->create();
        PermissionGrant::create(['user_id' => $admin->id, 'area' => 'administracao', 'action' => 'edit', 'granted_by' => $admin->id, 'granted_at' => now()]);
        $member = Member::create(['name' => 'Carlos', 'joined_at' => today(), 'status' => 'active']);

        $this->actingAs($admin)->post("/members/{$member->id}/account", ['name' => 'Carlos MC', 'email' => 'carlos@example.test', 'password' => 'Initial-password1!'])->assertRedirect();
        $account = $member->user()->firstOrFail();
        $this->assertTrue($account->active);
        $this->assertDatabaseHas('audit_events', ['entity' => 'member_account', 'entity_id' => $account->id, 'action' => 'linked']);

        $this->actingAs($admin)->patch("/members/{$member->id}/account", ['active' => false])->assertRedirect();
        $this->assertFalse($account->fresh()->active);
        $this->assertDatabaseHas('audit_events', ['entity' => 'member_account', 'entity_id' => $account->id, 'action' => 'deactivated']);
    }
}
