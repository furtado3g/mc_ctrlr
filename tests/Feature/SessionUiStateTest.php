<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SessionUiStateTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_session_has_a_stable_draft_scope_and_logout_rotates_it(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/dashboard')->assertOk();
        $firstScope = session('ui_draft_scope');
        $this->assertIsString($firstScope);
        $this->assertNotSame('', $firstScope);

        $this->get('/dashboard')->assertOk();
        $this->assertSame($firstScope, session('ui_draft_scope'));

        $this->post('/logout')->assertRedirect();
        $this->post('/login', ['email' => $user->email, 'password' => 'password'])->assertRedirect();
        $this->get('/dashboard')->assertOk();

        $this->assertNotSame($firstScope, session('ui_draft_scope'));
    }

    public function test_guest_page_does_not_create_a_draft_scope(): void
    {
        $this->get('/login')->assertOk();

        $this->assertNull(session('ui_draft_scope'));
    }
}
