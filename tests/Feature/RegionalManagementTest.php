<?php

namespace Tests\Feature;

use App\Models\AuditEvent;
use App\Models\Member;
use App\Models\PermissionGrant;
use App\Models\Regional;
use App\Models\RegionalCity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionalManagementTest extends TestCase
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

    public function test_global_admin_can_list_and_create_regional_with_multiple_cities(): void
    {
        $admin = $this->createGlobalAdmin();

        $this->actingAs($admin)->get('/admin/regionals')->assertOk();

        $response = $this->actingAs($admin)->post('/admin/regionals', [
            'name' => 'Regional Sul',
            'code' => 'SUL',
            'cities' => [
                ['name' => 'Curitiba', 'state' => 'PR', 'is_headquarters' => true],
                ['name' => 'Londrina', 'state' => 'PR', 'is_headquarters' => false],
                ['name' => 'Joinville', 'state' => 'SC', 'is_headquarters' => false],
            ],
        ]);

        $response->assertRedirect('/admin/regionals');

        $regional = Regional::where('code', 'SUL')->first();
        $this->assertNotNull($regional);
        $this->assertSame('Regional Sul', $regional->name);
        $this->assertSame('Curitiba', $regional->city);
        $this->assertSame('PR', $regional->state);
        $this->assertTrue($regional->active);

        $this->assertDatabaseHas('regional_cities', [
            'regional_id' => $regional->id,
            'name' => 'Curitiba',
            'state' => 'PR',
            'is_headquarters' => true,
        ]);
        $this->assertDatabaseHas('regional_cities', [
            'regional_id' => $regional->id,
            'name' => 'Londrina',
            'state' => 'PR',
            'is_headquarters' => false,
        ]);
        $this->assertDatabaseHas('regional_cities', [
            'regional_id' => $regional->id,
            'name' => 'Joinville',
            'state' => 'SC',
            'is_headquarters' => false,
        ]);

        $audit = AuditEvent::where('entity', 'regional')->first();
        $this->assertNotNull($audit);
        $this->assertSame('regional_created', $audit->action);
        $this->assertSame($admin->id, $audit->user_id);
    }

    public function test_regional_creation_requires_at_least_one_city_and_exactly_one_headquarters(): void
    {
        $admin = $this->createGlobalAdmin();

        // No cities
        $res1 = $this->actingAs($admin)->post('/admin/regionals', [
            'name' => 'Regional Sem Cidades',
            'code' => 'SEM-CID',
            'cities' => [],
        ]);
        $res1->assertSessionHasErrors('cities');

        // No headquarters
        $res2 = $this->actingAs($admin)->post('/admin/regionals', [
            'name' => 'Regional Sem Sede',
            'code' => 'SEM-SEDE',
            'cities' => [
                ['name' => 'Curitiba', 'state' => 'PR', 'is_headquarters' => false],
                ['name' => 'Maringá', 'state' => 'PR', 'is_headquarters' => false],
            ],
        ]);
        $res2->assertSessionHasErrors('cities');

        // Multiple headquarters
        $res3 = $this->actingAs($admin)->post('/admin/regionals', [
            'name' => 'Regional Dupla Sede',
            'code' => 'DUP-SEDE',
            'cities' => [
                ['name' => 'Curitiba', 'state' => 'PR', 'is_headquarters' => true],
                ['name' => 'Maringá', 'state' => 'PR', 'is_headquarters' => true],
            ],
        ]);
        $res3->assertSessionHasErrors('cities');
    }

    public function test_regional_code_must_be_unique(): void
    {
        $admin = $this->createGlobalAdmin();

        $regional = Regional::create([
            'name' => 'Regional Existente',
            'code' => 'EXIST',
            'city' => 'Porto Alegre',
            'state' => 'RS',
            'active' => true,
        ]);
        RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Porto Alegre',
            'state' => 'RS',
            'is_headquarters' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/regionals', [
            'name' => 'Outra Regional',
            'code' => 'exist',
            'cities' => [
                ['name' => 'Passo Fundo', 'state' => 'RS', 'is_headquarters' => true],
            ],
        ]);

        $response->assertSessionHasErrors('code');
    }

    public function test_global_admin_can_update_regional_and_sync_cities(): void
    {
        $admin = $this->createGlobalAdmin();

        $regional = Regional::create([
            'name' => 'Regional Antiga',
            'code' => 'ANT',
            'city' => 'Joinville',
            'state' => 'SC',
            'active' => true,
        ]);
        $cityJoinville = RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Joinville',
            'state' => 'SC',
            'is_headquarters' => true,
        ]);

        $response = $this->actingAs($admin)->patch("/admin/regionals/{$regional->id}", [
            'name' => 'Regional Santa Catarina',
            'code' => 'ANT',
            'cities' => [
                ['id' => $cityJoinville->id, 'name' => 'Joinville', 'state' => 'SC', 'is_headquarters' => false],
                ['name' => 'Florianópolis', 'state' => 'SC', 'is_headquarters' => true],
            ],
        ]);

        $response->assertRedirect('/admin/regionals');

        $regional->refresh();
        $this->assertSame('Regional Santa Catarina', $regional->name);
        $this->assertSame('Florianópolis', $regional->city);

        $this->assertDatabaseHas('regional_cities', [
            'regional_id' => $regional->id,
            'name' => 'Florianópolis',
            'is_headquarters' => true,
        ]);
        $this->assertDatabaseHas('regional_cities', [
            'id' => $cityJoinville->id,
            'is_headquarters' => false,
        ]);
    }

    public function test_cannot_remove_city_with_attached_members(): void
    {
        $admin = $this->createGlobalAdmin();

        $regional = Regional::create([
            'name' => 'Regional Sul',
            'code' => 'SUL-TEST',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);
        $cityCuritiba = RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Curitiba',
            'state' => 'PR',
            'is_headquarters' => true,
        ]);
        $cityLondrina = RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Londrina',
            'state' => 'PR',
            'is_headquarters' => false,
        ]);

        // Attach member to Londrina
        Member::create([
            'regional_id' => $regional->id,
            'regional_city_id' => $cityLondrina->id,
            'name' => 'Membro de Londrina',
            'email' => 'membro.ldn@motoclube.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
        ]);

        // Attempt to update regional removing Londrina
        $response = $this->actingAs($admin)->patch("/admin/regionals/{$regional->id}", [
            'name' => 'Regional Sul',
            'code' => 'SUL-TEST',
            'cities' => [
                ['id' => $cityCuritiba->id, 'name' => 'Curitiba', 'state' => 'PR', 'is_headquarters' => true],
            ],
        ]);

        $response->assertSessionHasErrors('cities');
        $this->assertDatabaseHas('regional_cities', ['id' => $cityLondrina->id]);
    }

    public function test_global_admin_can_toggle_regional_status_except_matriz(): void
    {
        $admin = $this->createGlobalAdmin();

        $regional = Regional::create([
            'name' => 'Regional Teste',
            'code' => 'TESTE',
            'city' => 'Santos',
            'state' => 'SP',
            'active' => true,
        ]);

        $this->actingAs($admin)->post("/admin/regionals/{$regional->id}/toggle-status")
            ->assertRedirect();

        $this->assertFalse($regional->fresh()->active);

        // Matriz (id = 1) cannot be deactivated
        $matriz = Regional::find(1);
        if ($matriz) {
            $this->actingAs($admin)->post("/admin/regionals/{$matriz->id}/toggle-status")
                ->assertSessionHasErrors('error');
            $this->assertTrue($matriz->fresh()->active);
        }
    }

    public function test_non_global_user_is_forbidden_from_managing_regionals(): void
    {
        $regional = Regional::create([
            'name' => 'Regional Local',
            'code' => 'LOCAL',
            'city' => 'Campinas',
            'state' => 'SP',
            'active' => true,
        ]);

        $localUser = User::factory()->create([
            'is_global' => false,
            'regional_id' => $regional->id,
            'active' => true,
        ]);
        PermissionGrant::create(['user_id' => $localUser->id, 'area' => 'administracao', 'action' => 'view', 'granted_by' => $localUser->id, 'granted_at' => now()]);
        PermissionGrant::create(['user_id' => $localUser->id, 'area' => 'administracao', 'action' => 'edit', 'granted_by' => $localUser->id, 'granted_at' => now()]);

        $this->actingAs($localUser)->get('/admin/regionals')->assertForbidden();
        $this->actingAs($localUser)->post('/admin/regionals', [
            'name' => 'Inválido',
            'code' => 'INV',
            'cities' => [
                ['name' => 'Campinas', 'state' => 'SP', 'is_headquarters' => true],
            ],
        ])->assertForbidden();
    }
}
