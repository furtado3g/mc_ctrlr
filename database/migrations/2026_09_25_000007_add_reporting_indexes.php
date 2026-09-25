<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('billing_periods', fn (Blueprint $table) => $table->index('due_at'));
        Schema::table('fees', fn (Blueprint $table) => $table->index('member_id'));
        Schema::table('cash_movements', fn (Blueprint $table) => $table->index(['category', 'occurred_at']));
    }

    public function down(): void
    {
        Schema::table('billing_periods', fn (Blueprint $table) => $table->dropIndex(['due_at']));
        Schema::table('fees', fn (Blueprint $table) => $table->dropIndex(['member_id']));
        Schema::table('cash_movements', fn (Blueprint $table) => $table->dropIndex(['category', 'occurred_at']));
    }
};
