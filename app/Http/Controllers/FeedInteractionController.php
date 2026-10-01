<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostCommentRequest;
use App\Models\Post;
use App\Models\PostComment;
use App\Models\PostLike;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FeedInteractionController extends Controller
{
    public function toggleLike(Request $request, Post $post): RedirectResponse
    {
        $user = $request->user();
        abort_unless((bool) $user->active, 403);

        $existing = PostLike::where('post_id', $post->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            PostLike::create([
                'post_id' => $post->id,
                'user_id' => $user->id,
            ]);
        }

        return back();
    }

    public function storeComment(PostCommentRequest $request, Post $post): RedirectResponse
    {
        $post->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->validated('content'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Comentário publicado com sucesso!']);

        return back();
    }

    public function destroyComment(Request $request, PostComment $comment): RedirectResponse
    {
        Gate::authorize('delete', $comment);

        $comment->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Comentário removido.']);

        return back();
    }
}
