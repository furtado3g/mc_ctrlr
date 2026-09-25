<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property array<string, mixed>|null $published_content
 * @property array<string, mixed>|null $draft_content
 * @property Carbon|null $draft_saved_at
 * @property Carbon|null $published_at
 */
class InstitutionalPage extends Model
{
    protected $fillable = ['key', 'published_content', 'draft_content', 'draft_saved_by', 'draft_saved_at', 'published_by', 'published_at'];

    protected function casts(): array
    {
        return ['published_content' => 'array', 'draft_content' => 'array', 'draft_saved_at' => 'datetime', 'published_at' => 'datetime'];
    }

    /** @param Builder<static> $query */
    public function scopeHome(Builder $query): void
    {
        $query->where('key', 'home');
    }

    /** @return BelongsTo<User, $this> */
    public function draftSaver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'draft_saved_by');
    }

    /** @return BelongsTo<User, $this> */
    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }
}
