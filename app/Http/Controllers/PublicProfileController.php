<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicProfileController extends Controller
{
    public function show(Request $request, Member $member): Response
    {
        $member->loadMissing([
            'user.profile',
            'regional',
            'motorcycleLinks.motorcycle',
        ]);

        $currentUser = $request->user();
        $targetUser = $member->user;

        $postsQuery = Post::query()
            ->with([
                'user.profile',
                'regional',
                'media',
                'comments.user.profile',
            ])
            ->withCount(['likes', 'comments'])
            ->withExists(['likes as is_liked' => fn ($q) => $q->where('user_id', $currentUser->id)])
            ->orderByDesc('created_at');

        if ($targetUser) {
            $postsQuery->where('user_id', $targetUser->id);
        } else {
            $postsQuery->whereRaw('1 = 0');
        }

        $paginated = $postsQuery->paginate(15);

        $paginated->through(function (Post $post) use ($currentUser) {
            $canDelete = $currentUser->active && ($currentUser->id === $post->user_id || $currentUser->is_global || $currentUser->canAccess('administracao', 'edit'));

            return [
                'id' => $post->id,
                'user_id' => $post->user_id,
                'regional_id' => $post->regional_id,
                'content' => $post->content,
                'created_at' => $post->created_at->toISOString(),
                'created_at_human' => $post->created_at->diffForHumans(),
                'author' => [
                    'id' => $post->user?->id,
                    'name' => $post->user?->name ?? 'Membro',
                    'road_nickname' => $post->user?->road_nickname,
                    'avatar_url' => $post->user?->avatar,
                    'member_id' => $post->user?->member_id,
                ],
                'regional' => $post->regional ? [
                    'id' => $post->regional->id,
                    'name' => $post->regional->name,
                    'code' => $post->regional->code,
                ] : null,
                'media' => $post->media->map(fn ($m) => [
                    'id' => $m->id,
                    'url' => $m->url,
                    'sort_order' => $m->sort_order,
                ])->values()->all(),
                'likes_count' => (int) $post->likes_count,
                'is_liked' => (bool) $post->is_liked,
                'comments_count' => (int) $post->comments_count,
                'can_delete' => $canDelete,
                'comments' => $post->comments->map(function ($c) use ($currentUser, $post) {
                    $canDeleteComment = $currentUser->active && ($currentUser->id === $c->user_id || $currentUser->id === $post->user_id || $currentUser->is_global || $currentUser->canAccess('administracao', 'edit'));

                    return [
                        'id' => $c->id,
                        'post_id' => $c->post_id,
                        'user_id' => $c->user_id,
                        'content' => $c->content,
                        'created_at' => $c->created_at->toISOString(),
                        'created_at_human' => $c->created_at->diffForHumans(),
                        'can_delete' => $canDeleteComment,
                        'author' => [
                            'id' => $c->user?->id,
                            'name' => $c->user?->name ?? 'Membro',
                            'road_nickname' => $c->user?->road_nickname,
                            'avatar_url' => $c->user?->avatar,
                            'member_id' => $c->user?->member_id,
                        ],
                    ];
                })->values()->all(),
            ];
        });

        $sanitizedMember = [
            'id' => $member->id,
            'name' => $member->name,
            'road_nickname' => $targetUser?->road_nickname,
            'avatar_url' => $targetUser?->avatar,
            'bio' => $targetUser?->bio,
            'regional' => $member->regional?->name,
            'city' => trim("{$member->city} / {$member->state}", ' /'),
            'joined_at_human' => $member->joined_at ? 'Membro desde ' . $member->joined_at->translatedFormat('F \d\e Y') : null,
            'motorcycles' => $member->motorcycleLinks->filter(fn ($l) => $l->ended_at === null)->map(fn ($l) => [
                'manufacturer' => $l->motorcycle?->manufacturer,
                'model' => $l->motorcycle?->model,
                'year' => $l->motorcycle?->year,
            ])->values()->all(),
        ];

        return Inertia::render('profile/show', [
            'member' => $sanitizedMember,
            'posts' => $paginated,
        ]);
    }
}
