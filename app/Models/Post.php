<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'regional_id',
        'content',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Regional, $this> */
    public function regional(): BelongsTo
    {
        return $this->belongsTo(Regional::class);
    }

    /** @return HasMany<PostMedia, $this> */
    public function media(): HasMany
    {
        return $this->hasMany(PostMedia::class)->orderBy('sort_order');
    }

    /** @return HasMany<PostLike, $this> */
    public function likes(): HasMany
    {
        return $this->hasMany(PostLike::class);
    }

    /** @return HasMany<PostComment, $this> */
    public function comments(): HasMany
    {
        return $this->hasMany(PostComment::class)->orderBy('created_at');
    }
}
