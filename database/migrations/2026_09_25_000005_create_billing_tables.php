<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billing_periods', function (Blueprint $table) {
            $table->id();
            $table->string('competence', 7)->unique();
            $table->date('due_at');
            $table->unsignedBigInteger('default_amount_cents');
            $table->string('status', 16)->default('open');
            $table->timestamps();
        });
        Schema::create('fees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->restrictOnDelete();
            $table->foreignId('billing_period_id')->constrained()->restrictOnDelete();
            $table->unsignedBigInteger('issued_amount_cents');
            $table->bigInteger('adjustment_cents')->default(0);
            $table->text('adjustment_reason')->nullable();
            $table->timestamps();
            $table->unique(['member_id', 'billing_period_id']);
            $table->index('billing_period_id');
        });
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_id')->constrained()->restrictOnDelete();
            $table->unsignedBigInteger('amount_cents');
            $table->date('paid_at');
            $table->string('method', 32);
            $table->string('reference')->nullable();
            $table->string('status', 16)->default('confirmed');
            $table->text('reverse_reason')->nullable();
            $table->foreignId('recorded_by')->constrained('users')->restrictOnDelete();
            $table->foreignId('reversed_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamp('reversed_at')->nullable();
            $table->timestamps();
            $table->index(['fee_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('fees');
        Schema::dropIfExists('billing_periods');
    }
};
