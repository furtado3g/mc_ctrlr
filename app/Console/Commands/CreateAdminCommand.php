<?php

namespace App\Console\Commands;

use App\Models\PermissionGrant;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CreateAdminCommand extends Command
{
    protected $signature = 'mc:create-admin';

    protected $description = 'Criar o primeiro administrador com todas as permissões';

    public function handle(): int
    {
        $name = $this->ask('Nome');
        $email = $this->ask('Email');
        $password = $this->secret('Senha (mínimo 12 caracteres)');
        if (! $name || ! filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password ?? '') < 12) {
            $this->error('Nome, email válido e senha com 12 caracteres são obrigatórios.');

            return self::FAILURE;
        }
        if (User::where('email', $email)->exists()) {
            $this->error('Email já cadastrado.');

            return self::FAILURE;
        }
        DB::transaction(function () use ($name, $email, $password) {
            $user = User::create(['name' => $name, 'email' => $email, 'password' => $password, 'active' => true, 'email_verified_at' => now()]);
            foreach (['cadastros', 'cobrancas', 'caixa', 'relatorios', 'administracao'] as $area) {
                foreach (['view', 'edit'] as $action) {
                    PermissionGrant::create(['user_id' => $user->id, 'area' => $area, 'action' => $action, 'granted_by' => $user->id, 'granted_at' => now()]);
                }
            }
        });
        $this->info('Administrador criado.');

        return self::SUCCESS;
    }
}
