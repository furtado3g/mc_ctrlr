<?php

namespace Tests\Feature;

use App\Models\PermissionGrant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormExperienceTest extends TestCase
{
    use RefreshDatabase;

    public function test_member_form_errors_are_returned_without_creating_a_record(): void
    {
        $user = User::factory()->create();
        PermissionGrant::create([
            'user_id' => $user->id,
            'area' => 'cadastros',
            'action' => 'edit',
            'granted_by' => $user->id,
            'granted_at' => now(),
        ]);

        $this->actingAs($user)
            ->from('/members')
            ->post('/members', [
                'name' => '',
                'email' => 'endereco-invalido',
                'joined_at' => '2026-09-25',
                'status' => 'active',
            ])
            ->assertRedirect('/members')
            ->assertSessionHasErrors(['name', 'email']);

        $this->assertDatabaseCount('members', 0);
    }

    public function test_user_without_edit_grant_cannot_submit_member_form(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/members', [
                'name' => 'Membro sem autorização',
                'joined_at' => '2026-09-25',
                'status' => 'active',
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('members', 0);
    }
}
