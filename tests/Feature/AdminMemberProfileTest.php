<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\PermissionGrant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminMemberProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_authorized_administrator_can_view_and_edit_profile_of_member_without_login(): void
    {
        $admin = $this->administrator(['cadastros.view', 'cadastros.edit']);
        $member = Member::create(['name' => 'Maria', 'joined_at' => '2020-01-15', 'status' => 'active']);

        $this->actingAs($admin)->get("/members/{$member->id}")
            ->assertInertia(fn (Assert $page) => $page
                ->component('members/show')
                ->where('member.id', $member->id)
                ->where('canEditMembers', true));

        $this->patch("/members/{$member->id}", $this->profileValues())->assertRedirect();
        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'name' => 'Maria da Silva',
            'cpf' => '52998224725',
            'emergency_contact_name' => 'Ana Silva',
            'companion_name' => 'Carlos Silva',
            'joined_at' => '2019-05-10',
        ]);
        $this->assertNull($member->fresh()->user);
    }

    public function test_view_only_administrator_can_read_but_cannot_update_profile(): void
    {
        $admin = $this->administrator(['cadastros.view']);
        $member = Member::create(['name' => 'Maria', 'joined_at' => today(), 'status' => 'active', 'cpf' => '11144477735']);

        $this->actingAs($admin)->get("/members/{$member->id}")
            ->assertInertia(fn (Assert $page) => $page->where('canEditMembers', false));
        $this->actingAs($admin)->patch("/members/{$member->id}", [
            'name' => 'Alteração não autorizada', 'joined_at' => today()->toDateString(), 'status' => 'active',
        ])->assertForbidden();

        $this->assertDatabaseHas('members', ['id' => $member->id, 'name' => 'Maria']);
    }

    public function test_user_without_member_view_permission_cannot_read_profile_or_listing(): void
    {
        $user = User::factory()->create();
        $member = Member::create(['name' => 'Maria', 'joined_at' => today(), 'status' => 'active']);

        $this->actingAs($user)->get("/members/{$member->id}")->assertForbidden();
        $this->actingAs($user)->get('/members')->assertForbidden();
    }

    public function test_member_listing_payload_excludes_personal_profile_fields(): void
    {
        $admin = $this->administrator(['cadastros.view']);
        Member::create([
            'name' => 'Maria', 'joined_at' => today(), 'status' => 'active',
            'cpf' => '11144477735', 'birth_date' => '1990-01-01',
            'postal_code' => '01310930', 'address_line' => 'Avenida Paulista',
            'emergency_contact_name' => 'Ana', 'companion_name' => 'Carlos',
        ]);

        $response = $this->actingAs($admin)->get('/members')->assertOk();
        $row = $response->inertiaProps('members.data.0');

        $this->assertSame('Maria', $row['name']);
        foreach (['cpf', 'birth_date', 'postal_code', 'address_line', 'emergency_contact_name', 'companion_name'] as $privateField) {
            $this->assertArrayNotHasKey($privateField, $row);
        }
    }

    /** @param list<string> $permissions */
    private function administrator(array $permissions): User
    {
        $user = User::factory()->create();
        foreach ($permissions as $permission) {
            [$area, $action] = explode('.', $permission);
            PermissionGrant::create([
                'user_id' => $user->id,
                'area' => $area,
                'action' => $action,
                'granted_by' => $user->id,
                'granted_at' => now(),
            ]);
        }

        return $user;
    }

    /** @return array<string, mixed> */
    private function profileValues(): array
    {
        return [
            'name' => 'Maria da Silva',
            'email' => 'maria@example.test',
            'phone' => '11988887777',
            'joined_at' => '2019-05-10',
            'status' => 'active',
            'left_at' => '',
            'cpf' => '529.982.247-25',
            'birth_date' => '1991-03-04',
            'postal_code' => '01310-930',
            'address_line' => 'Avenida Paulista',
            'address_number' => '1000',
            'address_complement' => 'Apto 10',
            'neighborhood' => 'Bela Vista',
            'city' => 'São Paulo',
            'state' => 'SP',
            'emergency_contact_name' => 'Ana Silva',
            'emergency_contact_relationship' => 'Irmã',
            'emergency_contact_phone' => '11999990000',
            'companion_name' => 'Carlos Silva',
            'companion_phone' => '11999998888',
        ];
    }
}
