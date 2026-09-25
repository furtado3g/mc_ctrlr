<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_user_seeder_creates_admin_with_credentials_and_all_permissions(): void
    {
        $this->seed(AdminUserSeeder::class);

        $user = User::where('email', 'admin@teste.com')->first();

        $this->assertNotNull($user);
        $this->assertTrue($user->active);
        $this->assertNotNull($user->email_verified_at);
        $this->assertTrue(Hash::check('sadmin123', $user->password));

        $areas = ['cadastros', 'cobrancas', 'caixa', 'relatorios', 'administracao', 'institucional'];
        foreach ($areas as $area) {
            $this->assertTrue($user->canAccess($area, 'view'), "Missing view access to {$area}");
            $this->assertTrue($user->canAccess($area, 'edit'), "Missing edit access to {$area}");
        }
    }
}
