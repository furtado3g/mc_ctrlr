<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('club_roles', function (Blueprint $table) {
            $table->dropUnique('club_roles_access_group_id_unique');
            $table->index('access_group_id');
        });
    }

    public function down(): void
    {
        Schema::table('club_roles', function (Blueprint $table) {
            $table->dropIndex(['access_group_id']);
            $table->unique('access_group_id');
        });
    }
};
