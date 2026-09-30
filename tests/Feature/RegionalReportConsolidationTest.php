<?php

namespace Tests\Feature;

use App\Models\BillingPeriod;
use App\Models\CashMovement;
use App\Models\Fee;
use App\Models\Member;
use App\Models\PermissionGrant;
use App\Models\Regional;
use App\Models\User;
use App\Reports\FeeReport;
use App\Reports\FiscalReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionalReportConsolidationTest extends TestCase
{
    use RefreshDatabase;

    private function createGlobalAdmin(): User
    {
        $admin = User::factory()->create([
            'is_global' => true,
            'regional_id' => null,
            'active' => true,
        ]);

        foreach (['relatorios', 'caixa', 'cobrancas'] as $area) {
            PermissionGrant::create(['user_id' => $admin->id, 'area' => $area, 'action' => 'view', 'granted_by' => $admin->id, 'granted_at' => now()]);
            PermissionGrant::create(['user_id' => $admin->id, 'area' => $area, 'action' => 'edit', 'granted_by' => $admin->id, 'granted_at' => now()]);
        }

        return $admin;
    }

    private function createRegionalUser(Regional $regional): User
    {
        $user = User::factory()->create([
            'is_global' => false,
            'regional_id' => $regional->id,
            'active' => true,
        ]);

        foreach (['relatorios', 'caixa', 'cobrancas'] as $area) {
            PermissionGrant::create(['user_id' => $user->id, 'area' => $area, 'action' => 'view', 'granted_by' => $user->id, 'granted_at' => now()]);
            PermissionGrant::create(['user_id' => $user->id, 'area' => $area, 'action' => 'edit', 'granted_by' => $user->id, 'granted_at' => now()]);
        }

        return $user;
    }

    public function test_fiscal_report_consolidates_all_regionals_for_global_admin(): void
    {
        $admin = $this->createGlobalAdmin();

        $regionalA = Regional::create([
            'name' => 'Regional A',
            'code' => 'REG-A',
            'city' => 'São Paulo',
            'state' => 'SP',
            'active' => true,
        ]);

        $regionalB = Regional::create([
            'name' => 'Regional B',
            'code' => 'REG-B',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);

        CashMovement::create([
            'type' => 'in',
            'amount_cents' => 20000,
            'occurred_at' => '2026-09-10',
            'category' => 'Mensalidade',
            'description' => 'Receita A',
            'source' => 'manual',
            'status' => 'active',
            'created_by' => $admin->id,
            'regional_id' => $regionalA->id,
        ]);

        CashMovement::create([
            'type' => 'in',
            'amount_cents' => 35000,
            'occurred_at' => '2026-09-12',
            'category' => 'Doação',
            'description' => 'Receita B',
            'source' => 'manual',
            'status' => 'active',
            'created_by' => $admin->id,
            'regional_id' => $regionalB->id,
        ]);

        $report = new FiscalReport;
        $this->actingAs($admin);

        // Consolidated view (no active regional)
        $allRows = $report->rows('2026-09-01', '2026-09-30');
        $this->assertCount(2, $allRows);
        $totalCents = collect($allRows)->sum('amount_cents');
        $this->assertEquals(55000, $totalCents);

        // Filtered by Regional A
        $rowsA = $report->rows('2026-09-01', '2026-09-30', $regionalA->id);
        $this->assertCount(1, $rowsA);
        $this->assertEquals(20000, $rowsA[0]['amount_cents']);
    }

    public function test_regional_operator_only_sees_fiscal_report_of_own_regional(): void
    {
        $regionalA = Regional::create([
            'name' => 'Regional A',
            'code' => 'REG-A',
            'city' => 'São Paulo',
            'state' => 'SP',
            'active' => true,
        ]);

        $regionalB = Regional::create([
            'name' => 'Regional B',
            'code' => 'REG-B',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);

        $operatorA = $this->createRegionalUser($regionalA);

        CashMovement::create([
            'type' => 'in',
            'amount_cents' => 15000,
            'occurred_at' => '2026-09-10',
            'category' => 'Mensalidade',
            'description' => 'Receita A',
            'source' => 'manual',
            'status' => 'active',
            'created_by' => $operatorA->id,
            'regional_id' => $regionalA->id,
        ]);

        CashMovement::create([
            'type' => 'in',
            'amount_cents' => 45000,
            'occurred_at' => '2026-09-12',
            'category' => 'Doação',
            'description' => 'Receita B',
            'source' => 'manual',
            'status' => 'active',
            'created_by' => $operatorA->id,
            'regional_id' => $regionalB->id,
        ]);

        $report = new FiscalReport;
        $this->actingAs($operatorA);

        $rows = $report->rows('2026-09-01', '2026-09-30');
        $this->assertCount(1, $rows);
        $this->assertEquals(15000, $rows[0]['amount_cents']);
    }

    public function test_fee_report_isolates_by_regional(): void
    {
        $regionalA = Regional::create([
            'name' => 'Regional A',
            'code' => 'REG-A',
            'city' => 'São Paulo',
            'state' => 'SP',
            'active' => true,
        ]);

        $regionalB = Regional::create([
            'name' => 'Regional B',
            'code' => 'REG-B',
            'city' => 'Curitiba',
            'state' => 'PR',
            'active' => true,
        ]);

        $operatorA = $this->createRegionalUser($regionalA);

        $memberA = Member::create([
            'name' => 'Membro A',
            'email' => 'membro.a@test.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
            'regional_id' => $regionalA->id,
        ]);

        $memberB = Member::create([
            'name' => 'Membro B',
            'email' => 'membro.b@test.com',
            'joined_at' => '2026-01-01',
            'status' => 'active',
            'regional_id' => $regionalB->id,
        ]);

        $periodA = BillingPeriod::create([
            'competence' => '2026-09',
            'due_at' => '2026-09-10',
            'default_amount_cents' => 5000,
            'status' => 'open',
            'regional_id' => $regionalA->id,
        ]);

        $periodB = BillingPeriod::create([
            'competence' => '2026-09',
            'due_at' => '2026-09-10',
            'default_amount_cents' => 6000,
            'status' => 'open',
            'regional_id' => $regionalB->id,
        ]);

        Fee::create([
            'member_id' => $memberA->id,
            'billing_period_id' => $periodA->id,
            'issued_amount_cents' => 5000,
            'adjustment_cents' => 0,
            'regional_id' => $regionalA->id,
        ]);

        Fee::create([
            'member_id' => $memberB->id,
            'billing_period_id' => $periodB->id,
            'issued_amount_cents' => 6000,
            'adjustment_cents' => 0,
            'regional_id' => $regionalB->id,
        ]);

        $report = new FeeReport;
        $this->actingAs($operatorA);

        $rows = $report->rows('2026-09-01', '2026-09-30');
        $this->assertCount(1, $rows);
        $this->assertEquals('Membro A', $rows[0]['member']);
    }
}
