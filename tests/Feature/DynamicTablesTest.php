<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\PermissionGrant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DynamicTablesTest extends TestCase
{
    use RefreshDatabase;

    public function test_members_support_search_filter_order_and_pagination_with_ten_thousand_rows(): void
    {
        $user = User::factory()->create();
        PermissionGrant::create(['user_id' => $user->id, 'area' => 'cadastros', 'action' => 'view', 'granted_by' => $user->id, 'granted_at' => now()]);
        $now = now();
        foreach (array_chunk(array_map(fn (int $id) => ['name' => sprintf('Alpha Member %05d', $id), 'joined_at' => today()->toDateString(), 'status' => 'active', 'created_at' => $now, 'updated_at' => $now], range(1, 10000)), 500) as $chunk) {
            DB::table('members')->insert($chunk);
        }
        Member::create(['name' => 'Zulu Search Target', 'email' => 'target@example.test', 'joined_at' => today(), 'status' => 'active']);

        $response = $this->actingAs($user)->get('/members');
        $response->assertOk()->assertInertia(fn ($page) => $page->where('members.total', 10001)->where('members.data.0.name', 'Alpha Member 00001'));

        $this->post('/table-query', ['table' => 'members', 'query' => ['search' => 'Search Target', 'filters' => ['status' => 'active'], 'sort' => 'name', 'direction' => 'asc', 'page' => 1, 'per_page' => 10]])
            ->assertRedirect('/members');
        $this->get('/members')->assertOk()->assertInertia(fn ($page) => $page->where('members.total', 1)->where('members.data.0.name', 'Zulu Search Target'));

        $this->post('/table-query', ['table' => 'members', 'query' => ['search' => 'No matching member', 'filters' => [], 'sort' => 'name', 'direction' => 'asc', 'page' => 1, 'per_page' => 10]])
            ->assertRedirect('/members');
        $this->get('/members')->assertOk()->assertInertia(fn ($page) => $page->where('members.total', 0)->has('members.data', 0));

        $this->post('/table-query', ['table' => 'members', 'query' => ['search' => '', 'filters' => [], 'sort' => 'id', 'direction' => 'desc', 'page' => 9999, 'per_page' => 10]])
            ->assertRedirect('/members');
        $this->get('/members')->assertOk()->assertInertia(fn ($page) => $page->where('members.current_page', 1001)->where('members.total', 10001));
    }
}
