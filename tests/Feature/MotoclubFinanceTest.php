<?php

namespace Tests\Feature;

use App\Actions\GenerateFees;
use App\Actions\RecordPayment;
use App\Actions\ReversePayment;
use App\Models\BillingPeriod;
use App\Models\CashMovement;
use App\Models\Member;
use App\Models\PermissionGrant;
use App\Models\User;
use App\Reports\CashLedger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class MotoclubFinanceTest extends TestCase
{
    use RefreshDatabase;

    private function actor(): User
    {
        $user = User::factory()->create();
        foreach (['cobrancas', 'caixa', 'relatorios'] as $area) {
            foreach (['view', 'edit'] as $action) {
                PermissionGrant::create(['user_id' => $user->id, 'area' => $area, 'action' => $action, 'granted_by' => $user->id, 'granted_at' => now()]);
            }
        }

        return $user;
    }

    private function period(): BillingPeriod
    {
        return BillingPeriod::create(['competence' => '2026-09', 'due_at' => '2026-09-30', 'default_amount_cents' => 10000, 'status' => 'open']);
    }

    public function test_emission_is_idempotent_and_uses_only_active_members(): void
    {
        $user = $this->actor();
        Member::create(['name' => 'Ativo', 'joined_at' => '2026-09-15', 'status' => 'active']);
        Member::create(['name' => 'Desligado', 'joined_at' => '2026-01-01', 'status' => 'left', 'left_at' => '2026-09-01']);
        $period = $this->period();
        $first = app(GenerateFees::class)->execute($period, $user->id);
        $second = app(GenerateFees::class)->execute($period, $user->id);
        $this->assertSame(['created' => 1, 'existing' => 0], $first);
        $this->assertSame(['created' => 0, 'existing' => 1], $second);
        $this->assertDatabaseCount('fees', 1);
        $this->assertDatabaseHas('fees', ['issued_amount_cents' => 10000]);
    }

    public function test_payment_and_reversal_reconcile_fee_and_cash(): void
    {
        $user = $this->actor();
        $member = Member::create(['name' => 'Membro', 'joined_at' => '2026-01-01', 'status' => 'active']);
        $period = $this->period();
        app(GenerateFees::class)->execute($period, $user->id);
        $fee = $member->fees()->firstOrFail();
        $payment = app(RecordPayment::class)->execute($fee, ['amount_cents' => 4000, 'paid_at' => '2026-09-25', 'method' => 'Pix'], $user->id);
        $this->assertSame(6000, $fee->fresh()->balance_cents);
        $this->assertSame(4000, app(CashLedger::class)->totals('2026-09-01', '2026-09-30')['closing_cents']);
        $this->assertDatabaseCount('cash_movements', 1);

        try {
            app(RecordPayment::class)->execute($fee, ['amount_cents' => 7000, 'paid_at' => '2026-09-25', 'method' => 'Pix'], $user->id);
            $this->fail('Pagamento acima do saldo deveria ser rejeitado.');
        } catch (ValidationException $e) {
            $this->assertDatabaseCount('cash_movements', 1);
        }

        app(ReversePayment::class)->execute($payment, 'Erro de lançamento', $user->id);
        $this->assertSame(10000, $fee->fresh()->balance_cents);
        $this->assertSame(0, app(CashLedger::class)->totals('2026-09-01', '2026-09-30')['closing_cents']);
        $this->assertSame('reversed', CashMovement::firstOrFail()->status);
        app(RecordPayment::class)->execute($fee, ['amount_cents' => 10000, 'paid_at' => '2026-09-25', 'method' => 'Pix'], $user->id);
        $this->assertSame(0, $fee->fresh()->balance_cents);
        $this->assertSame('paid', $fee->fresh()->status);
        $this->assertSame(10000, app(CashLedger::class)->totals('2026-09-01', '2026-09-30')['closing_cents']);
    }

    public function test_financial_routes_reject_user_without_grants(): void
    {
        $this->actingAs(User::factory()->create())->get('/cash')->assertForbidden();
        $this->get('/reports/fiscal')->assertForbidden();
    }

    public function test_cash_receipt_is_private_and_report_totals_match_movements(): void
    {
        Storage::fake('receipts');
        $user = $this->actor();
        $this->actingAs($user);
        $this->post('/cash/movements', ['type' => 'in', 'amount_cents' => 7000, 'occurred_at' => '2026-09-25', 'category' => 'Doação', 'description' => 'Apoio'])->assertRedirect();
        $this->post('/cash/movements', ['type' => 'out', 'amount_cents' => 2500, 'occurred_at' => '2026-09-25', 'category' => 'Evento', 'description' => 'Material'])->assertRedirect();
        $movement = CashMovement::firstOrFail();
        $this->post("/cash/movements/{$movement->id}/receipt", ['receipt' => UploadedFile::fake()->create('nota.pdf', 20, 'application/pdf')])->assertRedirect();
        $this->assertNotNull($movement->fresh()->receipt);
        $this->get("/cash/movements/{$movement->id}/receipt")->assertOk();
        $this->assertSame(4500, app(CashLedger::class)->totals('2026-09-01', '2026-09-30')['closing_cents']);
        $this->get('/reports/fiscal?start=2026-09-01&end=2026-09-30&format=csv')->assertOk()->assertDownload('suporte-fiscal.csv');
        $this->actingAs(User::factory()->create())->get("/cash/movements/{$movement->id}/receipt")->assertForbidden();
    }

    public function test_cash_correction_is_audited_and_empty_report_has_zero_totals(): void
    {
        $this->actingAs($this->actor());
        $this->post('/cash/movements', ['type' => 'out', 'amount_cents' => 3000, 'occurred_at' => '2026-09-25', 'category' => 'Evento', 'description' => 'Compra'])->assertRedirect();
        $movement = CashMovement::firstOrFail();
        $this->post("/cash/movements/{$movement->id}/corrections", [
            'type' => 'out', 'amount_cents' => 2000, 'occurred_at' => '2026-09-25',
            'category' => 'Evento', 'description' => 'Compra corrigida', 'reason' => 'Nota revisada',
        ])->assertRedirect();
        $this->assertDatabaseHas('cash_corrections', ['cash_movement_id' => $movement->id, 'reason' => 'Nota revisada']);
        $this->assertDatabaseHas('audit_events', ['entity' => 'cash_movement', 'entity_id' => $movement->id, 'action' => 'correct']);
        $this->assertSame(-2000, app(CashLedger::class)->totals('2026-09-01', '2026-09-30')['closing_cents']);
        $this->get('/reports/fiscal?start=2027-01-01&end=2027-01-31&format=csv')
            ->assertOk()->assertDownload('suporte-fiscal.csv');
        $this->assertSame(0, app(CashLedger::class)->totals('2027-01-01', '2027-01-31')['income_cents']);
    }
}
