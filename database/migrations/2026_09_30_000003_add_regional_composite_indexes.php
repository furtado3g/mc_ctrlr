<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->index(['regional_id', 'status']);
        });

        Schema::table('fees', function (Blueprint $table) {
            $table->index(['regional_id', 'billing_period_id']);
        });

        Schema::table('cash_movements', function (Blueprint $table) {
            $table->index(['regional_id', 'occurred_at']);
            $table->index(['regional_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cash_movements', function (Blueprint $table) {
            $table->dropIndex(['regional_id', 'status']);
            $table->dropIndex(['regional_id', 'occurred_at']);
        });

        Schema::table('fees', function (Blueprint $table) {
            $table->dropIndex(['regional_id', 'billing_period_id']);
        });

        Schema::table('members', function (Blueprint $table) {
            $table->dropIndex(['regional_id', 'status']);
        });
    }
};
