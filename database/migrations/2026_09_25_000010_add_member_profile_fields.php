<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->char('cpf', 11)->nullable()->unique();
            $table->date('birth_date')->nullable();
            $table->string('postal_code', 8)->nullable();
            $table->string('address_line')->nullable();
            $table->string('address_number')->nullable();
            $table->string('address_complement')->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('city')->nullable();
            $table->char('state', 2)->nullable();
            $table->string('emergency_contact_name', 255)->nullable();
            $table->string('emergency_contact_relationship', 120)->nullable();
            $table->string('emergency_contact_phone', 40)->nullable();
            $table->string('companion_name', 255)->nullable();
            $table->string('companion_phone', 40)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropUnique(['cpf']);
            $table->dropColumn([
                'cpf', 'birth_date', 'postal_code', 'address_line', 'address_number',
                'address_complement', 'neighborhood', 'city', 'state',
                'emergency_contact_name', 'emergency_contact_relationship',
                'emergency_contact_phone', 'companion_name', 'companion_phone',
            ]);
        });
    }
};
