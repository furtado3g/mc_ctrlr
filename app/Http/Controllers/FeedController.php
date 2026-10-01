<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostCreateRequest;
use App\Models\Post;
use App\Models\Regional;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $tab = $request->query('tab', 'regional');

        $query = Post::query()
            ->with([
                'user.profile',
                'user.member',
                'regional',
                'media',
                'comments.user.profile',
                'comments.user.member',
            ])
            ->withCount(['likes', 'comments'])
            ->withExists(['likes as is_liked' => fn ($q) => $q->where('user_id', $user->id)])
            ->orderByDesc('created_at');

        if ($tab === 'regional') {
            if ($user->is_global) {
                $activeRegionalId = $request->session()->get('active_regional_id');
                if ($activeRegionalId) {
                    $query->where('regional_id', $activeRegionalId);
                }
            } elseif ($user->regional_id) {
                $query->where('regional_id', $user->regional_id);
            }
        }

        $paginated = $query->paginate(15)->withQueryString();

        $paginated->through(function (Post $post) use ($user) {
            $canDelete = $user->active && ($user->id === $post->user_id || $user->is_global || $user->canAccess('administracao', 'edit'));

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
                'comments' => $post->comments->map(function ($c) use ($user, $post) {
                    $canDeleteComment = $user->active && ($user->id === $c->user_id || $user->id === $post->user_id || $user->is_global || $user->canAccess('administracao', 'edit'));

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

        return Inertia::render('feed/index', [
            'posts' => $paginated,
            'currentTab' => $tab,
            'availableRegionals' => Regional::where('active', true)->orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    public function store(PostCreateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $regionalId = $request->input('regional_id') ?? $user->regional_id;

        DB::transaction(function () use ($request, $user, $regionalId) {
            $post = Post::create([
                'user_id' => $user->id,
                'regional_id' => $regionalId,
                'content' => $request->input('content'),
            ]);

            if ($request->hasFile('images')) {
                $images = $request->file('images');
                if (is_array($images)) {
                    foreach ($images as $index => $file) {
                        $path = $file->store('posts', 'public');
                        $post->media()->create([
                            'file_path' => $path,
                            'sort_order' => $index,
                        ]);
                    }
                }
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicação criada com sucesso!']);

        return redirect()->route('feed.index');
    }

    public function destroy(Request $request, Post $post): RedirectResponse
    {
        Gate::authorize('delete', $post);

        $mediaPaths = $post->media->pluck('file_path')->all();

        DB::transaction(function () use ($post) {
            $post->delete();
        });

        foreach ($mediaPaths as $path) {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicação removida com sucesso.']);

        return redirect()->route('feed.index');
    }
}
