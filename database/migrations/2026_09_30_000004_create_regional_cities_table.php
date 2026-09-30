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
        Schema::create('regional_cities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('regional_id')->constrained('regionals')->cascadeOnDelete();
            $table->string('name', 120);
            $table->char('state', 2);
            $table->boolean('is_headquarters')->default(false);
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique(['regional_id', 'name', 'state']);
        });

        // Backfill existing regionals' city/state as headquarters city
        $regionals = DB::table('regionals')->get();
        foreach ($regionals as $regional) {
            if (! empty($regional->city) && ! empty($regional->state)) {
                DB::table('regional_cities')->insert([
                    'regional_id' => $regional->id,
                    'name' => $regional->city,
                    'state' => strtoupper($regional->state),
                    'is_headquarters' => true,
                    'active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regional_cities');
    }
};
