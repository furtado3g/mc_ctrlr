<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_movements', function (Blueprint $table) {
            $table->id();
            $table->string('type', 16);
            $table->unsignedBigInteger('amount_cents');
            $table->date('occurred_at');
            $table->string('category', 100);
            $table->text('description');
            $table->string('source', 32)->default('manual');
            $table->foreignId('payment_id')->nullable()->unique()->constrained('payments')->restrictOnDelete();
            $table->string('status', 16)->default('active');
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['occurred_at', 'status']);
        });
        Schema::create('cash_corrections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_movement_id')->constrained()->restrictOnDelete();
            $table->string('action', 32);
            $table->text('reason');
            $table->jsonb('before');
            $table->jsonb('after');
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->timestamp('created_at');
        });
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_movement_id')->unique()->constrained()->restrictOnDelete();
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size_bytes');
            $table->foreignId('uploaded_by')->constrained('users')->restrictOnDelete();
            $table->timestamp('uploaded_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('cash_corrections');
        Schema::dropIfExists('cash_movements');
    }
};
