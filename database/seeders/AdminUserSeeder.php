<?php

namespace Database\Seeders;

use App\Models\PermissionGrant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the admin user.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'admin@teste.com')->first();

        if (! $user) {
            $user = User::create([
                'name' => 'Administrador',
                'email' => 'admin@teste.com',
                'password' => 'sadmin123',
                'active' => true,
                'email_verified_at' => now(),
            ]);
        } else {
            $user->update([
                'name' => 'Administrador',
                'password' => 'sadmin123',
                'active' => true,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);
        }

        $areas = ['cadastros', 'cobrancas', 'caixa', 'relatorios', 'administracao', 'institucional'];
        $actions = ['view', 'edit'];

        foreach ($areas as $area) {
            foreach ($actions as $action) {
                PermissionGrant::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'area' => $area,
                        'action' => $action,
                    ],
                    [
                        'granted_by' => $user->id,
                        'granted_at' => now(),
                    ],
                );
            }
        }
    }
}
