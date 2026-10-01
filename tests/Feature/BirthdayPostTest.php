<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Regional;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BirthdayPostTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function getOrCreateRegional(): Regional
    {
        $existing = Regional::where('active', true)->first();
        if ($existing) {
            return $existing;
        }

        return Regional::create([
            'name' => 'Regional Teste',
            'code' => 'REG',
            'city' => 'São José dos Campos',
            'state' => 'SP',
            'active' => true,
        ]);
    }

    public function test_guest_cannot_access_birthdays(): void
    {
        $response = $this->get('/birthdays');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_birthdays_page(): void
    {
        $regional = $this->getOrCreateRegional();
        $user = User::factory()->create([
            'active' => true,
            'regional_id' => $regional->id,
        ]);

        $today = Carbon::today();

        $memberToday = Member::create([
            'name' => 'Marcos Aniversariante',
            'status' => 'active',
            'joined_at' => now(),
            'birth_date' => $today->copy()->subYears(35)->format('Y-m-d'),
            'regional_id' => $regional->id,
        ]);

        $memberUser = User::factory()->create([
            'name' => 'Marcos Aniversariante',
            'member_id' => $memberToday->id,
            'regional_id' => $regional->id,
        ]);

        $memberUser->profile()->create([
            'road_nickname' => 'Falcão',
            'avatar_path' => 'avatars/falcao.jpg',
        ]);

        $response = $this->actingAs($user)->get('/birthdays?period=today&search=Marcos');

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('birthdays/index')
                ->has('birthdays')
                ->has('today_count')
                ->has('week_count')
                ->has('month_count')
                ->where('birthdays.0.id', $memberToday->id)
                ->where('birthdays.0.road_nickname', 'Falcão')
                ->where('birthdays.0.is_today', true)
                ->where('birthdays.0.days_until', 0)
                ->where('birthdays.0.turning_age', 35)
            );
    }

    public function test_birthdays_period_filtering(): void
    {
        $regional = $this->getOrCreateRegional();
        $user = User::factory()->create([
            'active' => true,
            'regional_id' => $regional->id,
        ]);

        $today = Carbon::today();
        $prefix = 'FilterTest_' . uniqid();

        $mToday = Member::create([
            'name' => $prefix . ' Hoje',
            'status' => 'active',
            'joined_at' => now(),
            'birth_date' => $today->copy()->subYears(30)->format('Y-m-d'),
            'regional_id' => $regional->id,
        ]);

        // Member whose birthday is in 3 days (within this week)
        $mWeek = Member::create([
            'name' => $prefix . ' Semana',
            'status' => 'active',
            'joined_at' => now(),
            'birth_date' => $today->copy()->addDays(3)->subYears(40)->format('Y-m-d'),
            'regional_id' => $regional->id,
        ]);

        // Member whose birthday is in 25 days
        $mFar = Member::create([
            'name' => $prefix . ' Longe',
            'status' => 'active',
            'joined_at' => now(),
            'birth_date' => $today->copy()->addMonths(3)->subYears(28)->format('Y-m-d'),
            'regional_id' => $regional->id,
        ]);

        // Filter: today with scoped search
        $responseToday = $this->actingAs($user)->get("/birthdays?period=today&search={$prefix}");
        $responseToday->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('birthdays.0.id', $mToday->id)
                ->has('birthdays', 1)
            );

        // Filter: week with scoped search
        $responseWeek = $this->actingAs($user)->get("/birthdays?period=week&search={$prefix}");
        $responseWeek->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('birthdays', 2) // mToday and mWeek
            );
    }

    public function test_search_members_endpoint(): void
    {
        $regional = $this->getOrCreateRegional();
        $user = User::factory()->create([
            'active' => true,
            'regional_id' => $regional->id,
        ]);
        $uniqueNick = 'Relampago' . rand(100, 999);

        $member = Member::create([
            'name' => 'Alexandre Rocha ' . $uniqueNick,
            'status' => 'active',
            'joined_at' => now(),
            'birth_date' => '1990-08-20',
            'regional_id' => $regional->id,
        ]);

        $mUser = User::factory()->create([
            'name' => 'Alexandre Rocha ' . $uniqueNick,
            'member_id' => $member->id,
        ]);

        $mUser->profile()->create([
            'road_nickname' => $uniqueNick,
        ]);

        $response = $this->actingAs($user)->getJson("/birthdays/members/search?q={$uniqueNick}");

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $member->id)
            ->assertJsonPath('0.name', 'Alexandre Rocha ' . $uniqueNick)
            ->assertJsonPath('0.road_nickname', $uniqueNick);
    }
}
