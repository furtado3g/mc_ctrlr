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
        // 1. Users table
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('regional_id')->nullable()->constrained('regionals')->nullOnDelete();
            $table->boolean('is_global')->default(false);
        });

        // Set all existing users as global by default
        DB::table('users')->update([
            'is_global' => true,
            'regional_id' => null,
        ]);

        // 2. Members table
        Schema::table('members', function (Blueprint $table) {
            $table->foreignId('regional_id')->nullable()->constrained('regionals')->restrictOnDelete();
        });

        DB::table('members')->update(['regional_id' => 1]);

        Schema::table('members', function (Blueprint $table) {
            $table->unsignedBigInteger('regional_id')->nullable(false)->change();
            $table->index('regional_id');
        });

        // 3. Billing periods table
        Schema::table('billing_periods', function (Blueprint $table) {
            $table->foreignId('regional_id')->nullable()->constrained('regionals')->restrictOnDelete();
            $table->dropUnique(['competence']);
        });

        DB::table('billing_periods')->update(['regional_id' => 1]);

        Schema::table('billing_periods', function (Blueprint $table) {
            $table->unsignedBigInteger('regional_id')->nullable(false)->change();
            $table->unique(['regional_id', 'competence']);
        });

        // 4. Fees table
        Schema::table('fees', function (Blueprint $table) {
            $table->foreignId('regional_id')->nullable()->constrained('regionals')->restrictOnDelete();
        });

        DB::table('fees')->update(['regional_id' => 1]);

        Schema::table('fees', function (Blueprint $table) {
            $table->unsignedBigInteger('regional_id')->nullable(false)->change();
            $table->index('regional_id');
        });

        // 5. Cash movements table
        Schema::table('cash_movements', function (Blueprint $table) {
            $table->foreignId('regional_id')->nullable()->constrained('regionals')->restrictOnDelete();
        });

        DB::table('cash_movements')->update(['regional_id' => 1]);

        Schema::table('cash_movements', function (Blueprint $table) {
            $table->unsignedBigInteger('regional_id')->nullable(false)->change();
            $table->index('regional_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cash_movements', function (Blueprint $table) {
            $table->dropForeign(['regional_id']);
            $table->dropColumn('regional_id');
        });

        Schema::table('fees', function (Blueprint $table) {
            $table->dropForeign(['regional_id']);
            $table->dropColumn('regional_id');
        });

        Schema::table('billing_periods', function (Blueprint $table) {
            $table->dropUnique(['regional_id', 'competence']);
            $table->dropForeign(['regional_id']);
            $table->dropColumn('regional_id');
            $table->unique('competence');
        });

        Schema::table('members', function (Blueprint $table) {
            $table->dropForeign(['regional_id']);
            $table->dropColumn('regional_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['regional_id']);
            $table->dropColumn(['regional_id', 'is_global']);
        });
    }
};
