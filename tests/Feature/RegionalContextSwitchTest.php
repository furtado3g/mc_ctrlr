<?php

namespace Tests\Feature;

use App\Models\PermissionGrant;
use App\Models\Regional;
use App\Models\RegionalCity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionalContextSwitchTest extends TestCase
{
    use RefreshDatabase;

    public function test_global_user_can_switch_active_regional_and_receive_cities_in_props(): void
    {
        $admin = User::factory()->create([
            'is_global' => true,
            'regional_id' => null,
            'active' => true,
        ]);
        PermissionGrant::create(['user_id' => $admin->id, 'area' => 'administracao', 'action' => 'view', 'granted_by' => $admin->id, 'granted_at' => now()]);

        $regional = Regional::create([
            'name' => 'Regional Sul',
            'code' => 'SUL',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);

        RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Curitiba',
            'state' => 'PR',
            'is_headquarters' => true,
            'active' => true,
        ]);
        RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Londrina',
            'state' => 'PR',
            'is_headquarters' => false,
            'active' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/context/regional', [
            'regional_id' => $regional->id,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('active_regional_id', $regional->id);

        // Verify shared Inertia props on next request
        $listResponse = $this->actingAs($admin)->get('/admin/regionals');
        $listResponse->assertOk();

        $currentRegionalProp = $listResponse->viewData('page')['props']['currentRegional'];
        $this->assertNotNull($currentRegionalProp);
        $this->assertSame($regional->id, $currentRegionalProp['id']);
        $this->assertCount(2, $currentRegionalProp['cities']);
        $this->assertSame('Curitiba', $currentRegionalProp['cities'][0]['name']);
        $this->assertTrue($currentRegionalProp['cities'][0]['is_headquarters']);

        // Switch to consolidated (null)
        $response2 = $this->actingAs($admin)->post('/admin/context/regional', [
            'regional_id' => null,
        ]);

        $response2->assertRedirect();
        $response2->assertSessionMissing('active_regional_id');
    }

    public function test_regional_operator_receives_assigned_regional_cities_in_props(): void
    {
        $regional = Regional::create([
            'name' => 'Regional Sul',
            'code' => 'SUL',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);
        RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Curitiba',
            'state' => 'PR',
            'is_headquarters' => true,
            'active' => true,
        ]);

        $localUser = User::factory()->create([
            'is_global' => false,
            'regional_id' => $regional->id,
            'active' => true,
        ]);
        PermissionGrant::create(['user_id' => $localUser->id, 'area' => 'cadastros', 'action' => 'view', 'granted_by' => $localUser->id, 'granted_at' => now()]);

        $response = $this->actingAs($localUser)->get('/members');
        $response->assertOk();

        $currentRegionalProp = $response->viewData('page')['props']['currentRegional'];
        $this->assertNotNull($currentRegionalProp);
        $this->assertSame($regional->id, $currentRegionalProp['id']);
        $this->assertCount(1, $currentRegionalProp['cities']);
    }

    public function test_non_global_user_is_forbidden_from_switching_regional_context(): void
    {
        $regional = Regional::create([
            'name' => 'Regional Sul',
            'code' => 'SUL',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);

        $otherRegional = Regional::create([
            'name' => 'Regional Sudeste',
            'code' => 'SE',
            'city' => 'São Paulo',
            'state' => 'SP',
            'active' => true,
        ]);

        $localUser = User::factory()->create([
            'is_global' => false,
            'regional_id' => $regional->id,
            'active' => true,
        ]);

        $this->actingAs($localUser)->post('/admin/context/regional', [
            'regional_id' => $otherRegional->id,
        ])->assertForbidden();
    }
}
