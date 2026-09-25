<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->date('joined_at');
            $table->string('status', 16)->default('active');
            $table->date('left_at')->nullable();
            $table->timestamps();
            $table->index('status');
        });
        Schema::create('motorcycles', function (Blueprint $table) {
            $table->id();
            $table->string('identifier')->nullable()->unique();
            $table->string('manufacturer');
            $table->string('model');
            $table->unsignedSmallInteger('year')->nullable();
            $table->timestamps();
        });
        Schema::create('member_motorcycles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->restrictOnDelete();
            $table->foreignId('motorcycle_id')->constrained()->restrictOnDelete();
            $table->date('started_at');
            $table->date('ended_at')->nullable();
            $table->timestamps();
            $table->index(['motorcycle_id', 'ended_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_motorcycles');
        Schema::dropIfExists('motorcycles');
        Schema::dropIfExists('members');
    }
};
