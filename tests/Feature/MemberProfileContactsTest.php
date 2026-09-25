<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberProfileContactsTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_can_save_and_clear_optional_contacts(): void
    {
        $member = Member::create(['name' => 'Joana', 'joined_at' => today(), 'status' => 'active']);
        $user = User::factory()->create(['member_id' => $member->id]);

        $this->actingAs($user)->patch('/me/profile/contacts', [
            'emergency_contact_name' => 'Ana Silva',
            'emergency_contact_relationship' => 'Irmã',
            'emergency_contact_phone' => '11988887777',
            'companion_name' => 'Carlos Silva',
            'companion_phone' => '11999998888',
        ])->assertRedirect();

        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'emergency_contact_name' => 'Ana Silva',
            'emergency_contact_relationship' => 'Irmã',
            'emergency_contact_phone' => '11988887777',
            'companion_name' => 'Carlos Silva',
            'companion_phone' => '11999998888',
        ]);

        $this->patch('/me/profile/contacts', [
            'emergency_contact_name' => '',
            'emergency_contact_relationship' => '',
            'emergency_contact_phone' => '',
            'companion_name' => '',
            'companion_phone' => '',
        ])->assertRedirect();

        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'emergency_contact_name' => null,
            'emergency_contact_relationship' => null,
            'emergency_contact_phone' => null,
            'companion_name' => null,
            'companion_phone' => null,
        ]);
    }

    public function test_contact_groups_require_all_fields_together_and_do_not_change_on_invalid_input(): void
    {
        $member = Member::create([
            'name' => 'Joana', 'joined_at' => today(), 'status' => 'active',
            'emergency_contact_name' => 'Ana', 'emergency_contact_relationship' => 'Irmã', 'emergency_contact_phone' => '11988887777',
            'companion_name' => 'Carlos', 'companion_phone' => '11999998888',
        ]);
        $user = User::factory()->create(['member_id' => $member->id]);

        $this->actingAs($user)->patch('/me/profile/contacts', [
            'emergency_contact_name' => 'Beatriz',
            'emergency_contact_relationship' => '',
            'emergency_contact_phone' => '',
            'companion_name' => 'Pedro',
            'companion_phone' => '',
        ])->assertSessionHasErrors(['emergency_contact_relationship', 'emergency_contact_phone', 'companion_phone']);

        $this->assertDatabaseHas('members', [
            'id' => $member->id,
            'emergency_contact_name' => 'Ana',
            'companion_name' => 'Carlos',
        ]);
    }

    public function test_contact_update_is_scoped_to_the_member_linked_to_the_session(): void
    {
        $own = Member::create(['name' => 'Joana', 'joined_at' => today(), 'status' => 'active']);
        $other = Member::create(['name' => 'Maria', 'joined_at' => today(), 'status' => 'active']);
        $user = User::factory()->create(['member_id' => $own->id]);

        $this->actingAs($user)->patch('/me/profile/contacts', [
            'member_id' => $other->id,
            'emergency_contact_name' => 'Ana',
            'emergency_contact_relationship' => 'Irmã',
            'emergency_contact_phone' => '11988887777',
        ])->assertRedirect();

        $this->assertDatabaseHas('members', ['id' => $own->id, 'emergency_contact_name' => 'Ana']);
        $this->assertDatabaseHas('members', ['id' => $other->id, 'emergency_contact_name' => null]);
    }
}
