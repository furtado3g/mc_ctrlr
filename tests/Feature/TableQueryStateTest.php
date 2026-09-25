<?php

namespace Tests\Feature;

use App\Models\PermissionGrant;
use App\Models\User;
use App\Support\SessionTableQuery;
use App\Support\TableQueryRules;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class TableQueryStateTest extends TestCase
{
    use RefreshDatabase;

    public function test_table_query_state_is_scoped_by_user_and_table_and_can_be_cleared(): void
    {
        $queries = app(SessionTableQuery::class);
        $queries->put(1, 'members', ['search' => 'Alpha']);
        $queries->put(2, 'members', ['search' => 'Bravo']);
        $queries->put(1, 'fees', ['search' => 'Cobra']);

        $this->assertSame('Alpha', $queries->get(1, 'members', ['search' => ''])['search']);
        $this->assertSame('Bravo', $queries->get(2, 'members', ['search' => ''])['search']);
        $this->assertSame('Cobra', $queries->get(1, 'fees', ['search' => ''])['search']);

        $queries->clear(1, 'members');
        $this->assertSame('', $queries->get(1, 'members', ['search' => ''])['search']);
    }

    public function test_query_rules_reject_unknown_filters_and_sort_columns(): void
    {
        $rules = app(TableQueryRules::class);

        try {
            $rules->normalize('members', ['filters' => ['role_id' => 1]]);
            $this->fail('Expected unknown filter to be rejected.');
        } catch (ValidationException) {
            $this->assertTrue(true);
        }

        try {
            $rules->normalize('members', ['sort' => 'password']);
            $this->fail('Expected non-allowlisted sort to be rejected.');
        } catch (ValidationException) {
            $this->assertTrue(true);
        }

        try {
            $rules->normalize('members', ['raw_sql' => 'delete']);
            $this->fail('Expected unknown query field to be rejected.');
        } catch (ValidationException) {
            $this->assertTrue(true);
        }
    }

    public function test_table_state_endpoint_requires_area_view_permission_and_keeps_query_out_of_url(): void
    {
        $user = User::factory()->create();
        PermissionGrant::create(['user_id' => $user->id, 'area' => 'cadastros', 'action' => 'view', 'granted_by' => $user->id, 'granted_at' => now()]);

        $this->actingAs($user)->from('/members')->post('/table-query', [
            'table' => 'members',
            'query' => ['search' => 'Moto', 'filters' => [], 'sort' => 'name', 'direction' => 'asc', 'page' => 8, 'per_page' => 50],
        ])->assertRedirect('/members');

        $this->assertSame('Moto', session('table_queries.'.$user->id.'.members.search'));
        $this->assertSame(8, session('table_queries.'.$user->id.'.members.page'));
        $this->get('/members')->assertOk()->assertInertia(fn ($page) => $page->where('tableQuery.search', 'Moto')->where('tableQuery.page', 1));
        $this->assertSame('/members', parse_url(url()->previous(), PHP_URL_PATH));
    }

    public function test_unprivileged_user_cannot_write_table_query_state(): void
    {
        $this->actingAs(User::factory()->create())->post('/table-query', ['table' => 'members', 'query' => ['search' => 'private']])->assertForbidden();
    }

    public function test_report_csv_uses_the_session_query_through_a_clean_export_path(): void
    {
        $user = User::factory()->create();
        PermissionGrant::create(['user_id' => $user->id, 'area' => 'relatorios', 'action' => 'view', 'granted_by' => $user->id, 'granted_at' => now()]);
        $query = ['search' => '', 'filters' => ['start' => '2026-01-01', 'end' => '2026-12-31', 'type' => 'in'], 'sort' => 'date', 'direction' => 'asc', 'page' => 1, 'per_page' => 30];

        $this->actingAs($user)->from('/reports/cash')->post('/table-query', ['table' => 'reports.cash', 'query' => $query])->assertRedirect('/reports/cash');
        $this->get('/reports/cash/export')->assertOk()->assertHeader('content-type', 'text/csv; charset=UTF-8');
        $this->assertSame('in', session('table_queries.'.$user->id.'.reports.cash.filters.type'));
    }
}
