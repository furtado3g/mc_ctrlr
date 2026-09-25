<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('institutional_pages', function (Blueprint $table) {
            $table->id();
            $table->string('key', 32)->unique();
            $table->jsonb('published_content')->nullable();
            $table->jsonb('draft_content')->nullable();
            $table->foreignId('draft_saved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('draft_saved_at')->nullable();
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institutional_pages');
    }
};
