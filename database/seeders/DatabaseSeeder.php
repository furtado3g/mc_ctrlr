<?php

namespace Database\Seeders;

use App\Models\PermissionGrant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $email = config('mc.initial_admin_email');
        $password = config('mc.initial_admin_password');
        if (! $email || ! $password || User::exists()) {
            return;
        }

        $user = User::firstOrCreate(['email' => $email], [
            'name' => config('mc.initial_admin_name'),
            'password' => $password,
            'active' => true,
            'email_verified_at' => now(),
        ]);
        foreach (['cadastros', 'cobrancas', 'caixa', 'relatorios', 'administracao'] as $area) {
            foreach (['view', 'edit'] as $action) {
                PermissionGrant::firstOrCreate(
                    ['user_id' => $user->id, 'area' => $area, 'action' => $action],
                    ['granted_by' => $user->id, 'granted_at' => now()],
                );
            }
        }
    }
}
