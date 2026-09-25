<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MemberProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_member_can_view_and_update_only_their_own_profile_without_administrative_permissions(): void
    {
        $member = Member::create(['name' => 'Joana', 'joined_at' => '2021-04-03', 'status' => 'active']);
        $user = User::factory()->create(['member_id' => $member->id]);

        $this->actingAs($user)->get('/me/profile')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('member-profile/index', false)
                ->where('member.id', $member->id)
                ->where('member.joined_at', fn (string $date) => str_starts_with($date, '2021-04-03'))
                ->where('canEditJoinedAt', false));

        $this->patch('/me/profile', $this->validProfile())
            ->assertRedirect();

        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'name' => 'Joana Atualizada',
            'cpf' => '52998224725',
            'birth_date' => '1992-06-10',
            'postal_code' => '01310930',
            'state' => 'SP',
        ]);
        $this->assertFalse($user->fresh()->canAccess('cadastros', 'view'));
    }

    public function test_member_cannot_access_another_members_administrative_detail_or_choose_a_member_id(): void
    {
        $own = Member::create(['name' => 'Joana', 'joined_at' => today(), 'status' => 'active']);
        $other = Member::create(['name' => 'Maria', 'joined_at' => today(), 'status' => 'active', 'cpf' => '11144477735']);
        $user = User::factory()->create(['member_id' => $own->id]);

        $this->actingAs($user)->get("/members/{$other->id}")->assertForbidden();
        $this->actingAs($user)->patch('/me/profile?member_id='.$other->id, $this->validProfile())->assertRedirect();

        $this->assertDatabaseHas('members', ['id' => $own->id, 'cpf' => '52998224725']);
        $this->assertDatabaseHas('members', ['id' => $other->id, 'name' => 'Maria', 'cpf' => '11144477735']);
    }

    public function test_unlinked_account_cannot_open_member_profile(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/me/profile')->assertForbidden();
        $this->actingAs($user)->patch('/me/profile', $this->validProfile())->assertForbidden();
    }

    public function test_invalid_or_duplicate_cpf_is_rejected_without_replacing_saved_values(): void
    {
        $member = Member::create(['name' => 'Joana', 'joined_at' => today(), 'status' => 'active', 'cpf' => '11144477735']);
        $user = User::factory()->create(['member_id' => $member->id]);

        $this->actingAs($user)->patch('/me/profile', [...$this->validProfile(), 'cpf' => '111.111.111-11'])
            ->assertSessionHasErrors('cpf');
        $this->assertDatabaseHas('members', ['id' => $member->id, 'name' => 'Joana', 'cpf' => '11144477735']);

        $other = Member::create(['name' => 'Maria', 'joined_at' => today(), 'status' => 'active', 'cpf' => '52998224725']);
        $this->actingAs($user)->patch('/me/profile', $this->validProfile())->assertSessionHasErrors('cpf');
        $this->assertDatabaseHas('members', ['id' => $member->id, 'name' => 'Joana', 'cpf' => '11144477735']);
        $this->assertDatabaseHas('members', ['id' => $other->id, 'cpf' => '52998224725']);
    }

    public function test_general_profile_update_ignores_membership_and_administrative_fields(): void
    {
        $member = Member::create(['name' => 'Joana', 'joined_at' => '2021-04-03', 'status' => 'active']);
        $user = User::factory()->create(['member_id' => $member->id]);

        $this->actingAs($user)->patch('/me/profile', [
            ...$this->validProfile(),
            'member_id' => $member->id + 100,
            'joined_at' => '2000-01-01',
            'status' => 'left',
            'left_at' => '2022-01-01',
        ])->assertRedirect();

        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'joined_at' => '2021-04-03',
            'status' => 'active',
            'left_at' => null,
            'cpf' => '52998224725',
        ]);
        $this->assertDatabaseMissing('members', ['id' => $member->id + 100]);
    }

    /** @return array<string, string> */
    private function validProfile(): array
    {
        return [
            'name' => 'Joana Atualizada',
            'cpf' => '529.982.247-25',
            'birth_date' => '1992-06-10',
            'phone' => '(11) 99999-1234',
            'postal_code' => '01310-930',
            'address_line' => 'Avenida Paulista',
            'address_number' => '1000',
            'address_complement' => 'Apto 10',
            'neighborhood' => 'Bela Vista',
            'city' => 'São Paulo',
            'state' => 'SP',
        ];
    }
}
