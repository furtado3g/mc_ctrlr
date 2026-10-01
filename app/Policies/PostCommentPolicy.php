<?php

namespace App\Policies;

use App\Models\PostComment;
use App\Models\User;

class PostCommentPolicy
{
    /**
     * Determine whether the user can delete the comment.
     */
    public function delete(User $user, PostComment $comment): bool
    {
        if (! $user->active) {
            return false;
        }

        // Comment author can delete
        if ($user->id === $comment->user_id) {
            return true;
        }

        // Post author can delete comments on their own post
        if ($user->id === $comment->post?->user_id) {
            return true;
        }

        // Admins can delete
        return (bool) ($user->is_global || $user->canAccess('administracao', 'edit'));
    }
}
