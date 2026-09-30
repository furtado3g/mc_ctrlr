<?php

namespace Tests\Feature;

use App\Models\CashMovement;
use App\Models\Member;
use App\Models\PermissionGrant;
use App\Models\Regional;
use App\Models\RegionalCity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionalIsolationTest extends TestCase
{
    use RefreshDatabase;

    private function createRegionalUser(Regional $regional, array $areas = ['cadastros', 'cobrancas', 'caixa']): User
    {
        $user = User::factory()->create([
            'is_global' => false,
            'regional_id' => $regional->id,
            'active' => true,
        ]);

        foreach ($areas as $area) {
            PermissionGrant::create(['user_id' => $user->id, 'area' => $area, 'action' => 'view', 'granted_by' => $user->id, 'granted_at' => now()]);
            PermissionGrant::create(['user_id' => $user->id, 'area' => $area, 'action' => 'edit', 'granted_by' => $user->id, 'granted_at' => now()]);
        }

        return $user;
    }

    public function test_member_creation_automatically_attaches_operator_regional(): void
    {
        $regionalSul = Regional::create([
            'name' => 'Regional Sul',
            'code' => 'SUL',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);

        $operatorSul = $this->createRegionalUser($regionalSul);

        $response = $this->actingAs($operatorSul)->post('/members', [
            'name' => 'Membro Regional Sul',
            'email' => 'membro.sul@motoclube.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
        ]);

        $response->assertRedirect();

        $member = Member::where('email', 'membro.sul@motoclube.com')->first();
        $this->assertNotNull($member);
        $this->assertEquals($regionalSul->id, $member->regional_id);
    }

    public function test_regional_operator_only_sees_members_of_own_regional(): void
    {
        $regionalA = Regional::create([
            'name' => 'Regional A',
            'code' => 'REG-A',
            'city' => 'Cidade A',
            'state' => 'SP',
            'active' => true,
        ]);

        $regionalB = Regional::create([
            'name' => 'Regional B',
            'code' => 'REG-B',
            'city' => 'Cidade B',
            'state' => 'RJ',
            'active' => true,
        ]);

        $operatorA = $this->createRegionalUser($regionalA);

        $memberA = Member::create([
            'name' => 'Membro de A',
            'email' => 'membro.a@test.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
            'regional_id' => $regionalA->id,
        ]);

        $memberB = Member::create([
            'name' => 'Membro de B',
            'email' => 'membro.b@test.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
            'regional_id' => $regionalB->id,
        ]);

        $response = $this->actingAs($operatorA)->get('/members');
        $response->assertOk();

        $data = $response->viewData('page')['props']['members']['data'];
        $ids = collect($data)->pluck('id')->toArray();

        $this->assertContains($memberA->id, $ids);
        $this->assertNotContains($memberB->id, $ids);
    }

    public function test_regional_operator_cannot_view_or_edit_member_from_another_regional_via_idor(): void
    {
        $regionalA = Regional::create([
            'name' => 'Regional A',
            'code' => 'REG-A',
            'city' => 'Cidade A',
            'state' => 'SP',
            'active' => true,
        ]);

        $regionalB = Regional::create([
            'name' => 'Regional B',
            'code' => 'REG-B',
            'city' => 'Cidade B',
            'state' => 'RJ',
            'active' => true,
        ]);

        $operatorA = $this->createRegionalUser($regionalA);

        $memberB = Member::create([
            'name' => 'Membro da Regional B',
            'email' => 'membro.b@test.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
            'regional_id' => $regionalB->id,
        ]);

        // Attempt direct GET show
        $this->actingAs($operatorA)->get("/members/{$memberB->id}")->assertForbidden();

        // Attempt direct PATCH update
        $this->actingAs($operatorA)->patch("/members/{$memberB->id}", [
            'name' => 'Nome Injetado por IDOR',
            'joined_at' => '2026-01-01',
            'status' => 'active',
        ])->assertForbidden();

        $this->assertDatabaseMissing('members', [
            'id' => $memberB->id,
            'name' => 'Nome Injetado por IDOR',
        ]);
    }

    public function test_cash_movement_and_ledger_are_strictly_isolated_by_regional(): void
    {
        $regionalA = Regional::create([
            'name' => 'Regional A',
            'code' => 'REG-A',
            'city' => 'Cidade A',
            'state' => 'SP',
            'active' => true,
        ]);

        $regionalB = Regional::create([
            'name' => 'Regional B',
            'code' => 'REG-B',
            'city' => 'Cidade B',
            'state' => 'RJ',
            'active' => true,
        ]);

        $operatorA = $this->createRegionalUser($regionalA);
        $operatorB = $this->createRegionalUser($regionalB);

        // Operator A creates movement of R$ 500,00
        $this->actingAs($operatorA)->post('/cash/movements', [
            'type' => 'in',
            'amount_cents' => 50000,
            'occurred_at' => '2026-09-15',
            'category' => 'Mensalidade',
            'description' => 'Recebimento de mensalidades Regional A',
        ])->assertRedirect();

        // Operator B creates movement of R$ 120,00
        $this->actingAs($operatorB)->post('/cash/movements', [
            'type' => 'in',
            'amount_cents' => 12000,
            'occurred_at' => '2026-09-15',
            'category' => 'Doação',
            'description' => 'Doação recebida Regional B',
        ])->assertRedirect();

        // Check Operator A cash view
        $responseA = $this->actingAs($operatorA)->get('/cash');
        $responseA->assertOk();
        $totalsA = $responseA->viewData('page')['props']['totals'];
        $this->assertEquals(50000, $totalsA['income_cents']);
        $this->assertEquals(50000, $totalsA['closing_cents']);

        // Check Operator B cash view
        $responseB = $this->actingAs($operatorB)->get('/cash');
        $responseB->assertOk();
        $totalsB = $responseB->viewData('page')['props']['totals'];
        $this->assertEquals(12000, $totalsB['income_cents']);
        $this->assertEquals(12000, $totalsB['closing_cents']);
    }

    public function test_regional_operator_cannot_correct_or_reverse_cash_movement_of_another_regional(): void
    {
        $regionalA = Regional::create([
            'name' => 'Regional A',
            'code' => 'REG-A',
            'city' => 'Cidade A',
            'state' => 'SP',
            'active' => true,
        ]);

        $regionalB = Regional::create([
            'name' => 'Regional B',
            'code' => 'REG-B',
            'city' => 'Cidade B',
            'state' => 'RJ',
            'active' => true,
        ]);

        $operatorA = $this->createRegionalUser($regionalA);

        $movementB = CashMovement::create([
            'type' => 'in',
            'amount_cents' => 30000,
            'occurred_at' => '2026-09-10',
            'category' => 'Evento',
            'description' => 'Inscrição evento Regional B',
            'source' => 'manual',
            'status' => 'active',
            'created_by' => $operatorA->id,
            'regional_id' => $regionalB->id,
        ]);

        // Attempt correction via IDOR
        $this->actingAs($operatorA)->post("/cash/movements/{$movementB->id}/corrections", [
            'type' => 'in',
            'amount_cents' => 10000,
            'occurred_at' => '2026-09-10',
            'category' => 'Evento',
            'description' => 'Valor adulterado',
            'reason' => 'Tentativa indevida',
        ])->assertForbidden();

        // Attempt reversal via IDOR
        $this->actingAs($operatorA)->post("/cash/movements/{$movementB->id}/reverse", [
            'reason' => 'Estorno indevido',
        ])->assertForbidden();
    }

    public function test_member_can_be_assigned_to_city_of_active_regional(): void
    {
        $regional = Regional::create([
            'name' => 'Regional Sul',
            'code' => 'SUL',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);
        $cityCuritiba = RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Curitiba',
            'state' => 'PR',
            'is_headquarters' => true,
            'active' => true,
        ]);

        $operator = $this->createRegionalUser($regional);

        $response = $this->actingAs($operator)->post('/members', [
            'name' => 'Membro Curitiba',
            'email' => 'membro.cwb@test.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
            'regional_city_id' => $cityCuritiba->id,
        ]);

        $response->assertRedirect();

        $member = Member::where('email', 'membro.cwb@test.com')->first();
        $this->assertNotNull($member);
        $this->assertSame($regional->id, $member->regional_id);
        $this->assertSame($cityCuritiba->id, $member->regional_city_id);
    }

    public function test_member_cannot_be_assigned_to_city_of_another_regional_anti_idor(): void
    {
        $regionalA = Regional::create([
            'name' => 'Regional A',
            'code' => 'REG-A',
            'city' => 'Cidade A',
            'state' => 'SP',
            'active' => true,
        ]);

        $regionalB = Regional::create([
            'name' => 'Regional B',
            'code' => 'REG-B',
            'city' => 'Cidade B',
            'state' => 'RJ',
            'active' => true,
        ]);
        $cityB = RegionalCity::create([
            'regional_id' => $regionalB->id,
            'name' => 'Cidade B',
            'state' => 'RJ',
            'is_headquarters' => true,
            'active' => true,
        ]);

        $operatorA = $this->createRegionalUser($regionalA);

        $response = $this->actingAs($operatorA)->post('/members', [
            'name' => 'Membro IDOR',
            'email' => 'membro.idor@test.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
            'regional_city_id' => $cityB->id,
        ]);

        $response->assertSessionHasErrors('regional_city_id');
        $this->assertDatabaseMissing('members', ['email' => 'membro.idor@test.com']);
    }

    public function test_members_can_be_filtered_by_regional_city(): void
    {
        $regional = Regional::create([
            'name' => 'Regional Sul',
            'code' => 'SUL',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);
        $city1 = RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Curitiba',
            'state' => 'PR',
            'is_headquarters' => true,
            'active' => true,
        ]);
        $city2 = RegionalCity::create([
            'regional_id' => $regional->id,
            'name' => 'Londrina',
            'state' => 'PR',
            'is_headquarters' => false,
            'active' => true,
        ]);

        $operator = $this->createRegionalUser($regional);

        $m1 = Member::create([
            'name' => 'Membro 1',
            'email' => 'm1@test.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
            'regional_id' => $regional->id,
            'regional_city_id' => $city1->id,
        ]);

        $m2 = Member::create([
            'name' => 'Membro 2',
            'email' => 'm2@test.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
            'regional_id' => $regional->id,
            'regional_city_id' => $city2->id,
        ]);

        // Filter by city 1
        $res1 = $this->actingAs($operator)->get("/members?regional_city_id={$city1->id}");
        $res1->assertOk();
        $ids1 = collect($res1->viewData('page')['props']['members']['data'])->pluck('id')->toArray();
        $this->assertContains($m1->id, $ids1);
        $this->assertNotContains($m2->id, $ids1);
    }
}
