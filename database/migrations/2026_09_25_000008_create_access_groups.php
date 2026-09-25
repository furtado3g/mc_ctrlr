<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('access_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120)->unique();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('access_group_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('access_group_id')->constrained()->cascadeOnDelete();
            $table->string('area', 32);
            $table->string('action', 16);
            $table->unique(['access_group_id', 'area', 'action']);
        });

        Schema::table('club_roles', function (Blueprint $table) {
            $table->foreignId('access_group_id')->nullable()->unique()->constrained('access_groups')->nullOnDelete();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('member_id')->nullable()->unique()->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->dropConstrainedForeignId('member_id'));
        Schema::table('club_roles', fn (Blueprint $table) => $table->dropConstrainedForeignId('access_group_id'));
        Schema::dropIfExists('access_group_permissions');
        Schema::dropIfExists('access_groups');
    }
};
