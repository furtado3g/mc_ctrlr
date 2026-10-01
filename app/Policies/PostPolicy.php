<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Determine whether the user can view any posts.
     */
    public function viewAny(User $user): bool
    {
        return (bool) $user->active;
    }

    /**
     * Determine whether the user can create posts.
     */
    public function create(User $user): bool
    {
        return (bool) $user->active;
    }

    /**
     * Determine whether the user can update the post.
     */
    public function update(User $user, Post $post): bool
    {
        return $user->active && $user->id === $post->user_id;
    }

    /**
     * Determine whether the user can delete the post.
     */
    public function delete(User $user, Post $post): bool
    {
        if (! $user->active) {
            return false;
        }

        if ($user->id === $post->user_id) {
            return true;
        }

        return (bool) ($user->is_global || $user->canAccess('administracao', 'edit'));
    }
}
