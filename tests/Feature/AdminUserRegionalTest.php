<?php

namespace Tests\Feature;

use App\Models\PermissionGrant;
use App\Models\Regional;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserRegionalTest extends TestCase
{
    use RefreshDatabase;

    private function createGlobalAdmin(): User
    {
        $admin = User::factory()->create([
            'is_global' => true,
            'regional_id' => null,
            'active' => true,
        ]);

        PermissionGrant::create(['user_id' => $admin->id, 'area' => 'administracao', 'action' => 'view', 'granted_by' => $admin->id, 'granted_at' => now()]);
        PermissionGrant::create(['user_id' => $admin->id, 'area' => 'administracao', 'action' => 'edit', 'granted_by' => $admin->id, 'granted_at' => now()]);

        return $admin;
    }

    public function test_global_admin_can_create_regional_operator(): void
    {
        $admin = $this->createGlobalAdmin();
        $regional = Regional::create([
            'name' => 'Regional Sul',
            'code' => 'SUL',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/users', [
            'name' => 'Operador Sul',
            'email' => 'operador.sul@motoclube.com',
            'password' => 'secretPassword123!',
            'is_global' => false,
            'regional_id' => $regional->id,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('users', [
            'name' => 'Operador Sul',
            'email' => 'operador.sul@motoclube.com',
            'is_global' => false,
            'regional_id' => $regional->id,
        ]);
    }

    public function test_regional_operator_requires_valid_active_regional(): void
    {
        $admin = $this->createGlobalAdmin();

        $response = $this->actingAs($admin)->post('/admin/users', [
            'name' => 'Operador Sem Regional',
            'email' => 'sem.regional@motoclube.com',
            'password' => 'secretPassword123!',
            'is_global' => false,
            'regional_id' => null,
        ]);

        $response->assertSessionHasErrors('regional_id');
    }

    public function test_non_global_user_cannot_access_user_management(): void
    {
        $regional = Regional::create([
            'name' => 'Regional Centro',
            'code' => 'CENTRO',
            'city' => 'Brasília',
            'state' => 'DF',
            'active' => true,
        ]);

        $localUser = User::factory()->create([
            'is_global' => false,
            'regional_id' => $regional->id,
            'active' => true,
        ]);
        PermissionGrant::create(['user_id' => $localUser->id, 'area' => 'administracao', 'action' => 'view', 'granted_by' => $localUser->id, 'granted_at' => now()]);

        $this->actingAs($localUser)->get('/admin/users')->assertForbidden();
    }
}
