<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\PostComment;
use App\Models\PostLike;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeedInteractionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_member_can_toggle_like_on_post(): void
    {
        $author = User::factory()->create();
        $post = Post::create(['user_id' => $author->id, 'content' => 'Post para curtir']);
        $user = User::factory()->create();

        // 1st click: Like
        $response = $this->actingAs($user)->post("/feed/posts/{$post->id}/likes");
        $response->assertRedirect();
        $this->assertDatabaseHas('post_likes', [
            'post_id' => $post->id,
            'user_id' => $user->id,
        ]);
        $this->assertEquals(1, $post->likes()->count());

        // 2nd click: Unlike
        $response = $this->actingAs($user)->post("/feed/posts/{$post->id}/likes");
        $response->assertRedirect();
        $this->assertDatabaseMissing('post_likes', [
            'post_id' => $post->id,
            'user_id' => $user->id,
        ]);
        $this->assertEquals(0, $post->likes()->count());
    }

    public function test_member_can_comment_on_post(): void
    {
        $author = User::factory()->create();
        $post = Post::create(['user_id' => $author->id, 'content' => 'Post para comentar']);
        $commenter = User::factory()->create();

        $response = $this->actingAs($commenter)->post("/feed/posts/{$post->id}/comments", [
            'content' => 'Muito bom o passeio!',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('post_comments', [
            'post_id' => $post->id,
            'user_id' => $commenter->id,
            'content' => 'Muito bom o passeio!',
        ]);
    }

    public function test_comment_validation_rejects_empty_or_too_long_content(): void
    {
        $author = User::factory()->create();
        $post = Post::create(['user_id' => $author->id, 'content' => 'Post teste']);
        $commenter = User::factory()->create();

        // Empty
        $response = $this->actingAs($commenter)->post("/feed/posts/{$post->id}/comments", [
            'content' => '',
        ]);
        $response->assertSessionHasErrors('content');

        // Over 1000 characters
        $response = $this->actingAs($commenter)->post("/feed/posts/{$post->id}/comments", [
            'content' => str_repeat('a', 1001),
        ]);
        $response->assertSessionHasErrors('content');
    }

    public function test_comment_author_can_delete_their_comment(): void
    {
        $author = User::factory()->create();
        $post = Post::create(['user_id' => $author->id, 'content' => 'Post teste']);
        $commenter = User::factory()->create();
        $comment = PostComment::create([
            'post_id' => $post->id,
            'user_id' => $commenter->id,
            'content' => 'Meu comentário',
        ]);

        $response = $this->actingAs($commenter)->delete("/feed/comments/{$comment->id}");
        $response->assertRedirect();

        $this->assertDatabaseMissing('post_comments', ['id' => $comment->id]);
    }

    public function test_post_author_can_delete_comments_on_their_post(): void
    {
        $postAuthor = User::factory()->create();
        $post = Post::create(['user_id' => $postAuthor->id, 'content' => 'Meu post']);
        $commenter = User::factory()->create();
        $comment = PostComment::create([
            'post_id' => $post->id,
            'user_id' => $commenter->id,
            'content' => 'Comentário a ser moderado',
        ]);

        $response = $this->actingAs($postAuthor)->delete("/feed/comments/{$comment->id}");
        $response->assertRedirect();

        $this->assertDatabaseMissing('post_comments', ['id' => $comment->id]);
    }

    public function test_unauthorized_user_cannot_delete_another_members_comment(): void
    {
        $postAuthor = User::factory()->create();
        $post = Post::create(['user_id' => $postAuthor->id, 'content' => 'Meu post']);
        $commenter = User::factory()->create();
        $comment = PostComment::create([
            'post_id' => $post->id,
            'user_id' => $commenter->id,
            'content' => 'Comentário de teste',
        ]);

        $stranger = User::factory()->create(['is_global' => false]);

        $response = $this->actingAs($stranger)->delete("/feed/comments/{$comment->id}");
        $response->assertForbidden();

        $this->assertDatabaseHas('post_comments', ['id' => $comment->id]);
    }
}
