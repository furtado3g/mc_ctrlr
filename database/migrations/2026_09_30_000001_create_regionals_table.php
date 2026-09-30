<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('regionals', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('code', 20)->unique();
            $table->string('city', 120);
            $table->char('state', 2);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        DB::table('regionals')->insert([
            'id' => 1,
            'name' => 'Sede Nacional',
            'code' => 'MATRIZ',
            'city' => 'São Paulo',
            'state' => 'SP',
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regionals');
    }
};
