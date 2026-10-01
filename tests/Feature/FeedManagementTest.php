<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Regional;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FeedManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        Storage::fake('public');
    }

    public function test_member_can_create_post_with_up_to_10_photos(): void
    {
        $regional = Regional::create([
            'name' => 'Regional Campinas',
            'code' => 'CPS',
            'city' => 'Campinas',
            'state' => 'SP',
            'active' => true,
        ]);
        $user = User::factory()->create(['regional_id' => $regional->id]);

        $images = [
            UploadedFile::fake()->image('foto1.jpg', 600, 400),
            UploadedFile::fake()->image('foto2.jpg', 600, 400),
            UploadedFile::fake()->image('foto3.png', 600, 400),
        ];

        $response = $this->actingAs($user)
            ->post('/feed/posts', [
                'content' => 'Grande passeio de sábado com o comboio!',
                'images' => $images,
            ]);

        $response->assertRedirect('/feed');

        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'regional_id' => $regional->id,
            'content' => 'Grande passeio de sábado com o comboio!',
        ]);

        $post = Post::where('user_id', $user->id)->first();
        $this->assertCount(3, $post->media);
        foreach ($post->media as $media) {
            Storage::disk('public')->assertExists($media->file_path);
        }
    }

    public function test_post_creation_rejects_more_than_10_photos(): void
    {
        $user = User::factory()->create();

        $images = [];
        for ($i = 0; $i < 11; $i++) {
            $images[] = UploadedFile::fake()->image("foto_{$i}.jpg");
        }

        $response = $this->actingAs($user)
            ->post('/feed/posts', [
                'content' => 'Tentando enviar 11 fotos.',
                'images' => $images,
            ]);

        $response->assertSessionHasErrors('images');
        $this->assertDatabaseCount('posts', 0);
    }

    public function test_feed_filters_regional_vs_global(): void
    {
        $reg1 = Regional::create(['name' => 'Campinas', 'code' => 'CPS', 'city' => 'Campinas', 'state' => 'SP']);
        $reg2 = Regional::create(['name' => 'Santos', 'code' => 'STS', 'city' => 'Santos', 'state' => 'SP']);

        $user1 = User::factory()->create(['is_global' => false, 'regional_id' => $reg1->id]);
        $user2 = User::factory()->create(['is_global' => false, 'regional_id' => $reg2->id]);

        $post1 = Post::create(['user_id' => $user1->id, 'regional_id' => $reg1->id, 'content' => 'Post de Campinas']);
        $post2 = Post::create(['user_id' => $user2->id, 'regional_id' => $reg2->id, 'content' => 'Post de Santos']);

        // Regional tab for user1 should only include post1
        $this->actingAs($user1)->get('/feed?tab=regional')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('feed/index')
                ->where('currentTab', 'regional')
                ->has('posts.data', 1)
                ->where('posts.data.0.id', $post1->id));

        // Global tab for user1 should include both posts
        $this->actingAs($user1)->get('/feed?tab=global')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('feed/index')
                ->where('currentTab', 'global')
                ->has('posts.data', 2));
    }

    public function test_author_can_delete_own_post_and_associated_media(): void
    {
        $user = User::factory()->create();
        $post = Post::create(['user_id' => $user->id, 'content' => 'Post para excluir']);
        $file = UploadedFile::fake()->image('foto.jpg');
        $path = $file->store('posts', 'public');
        $media = $post->media()->create(['file_path' => $path, 'sort_order' => 0]);

        Storage::disk('public')->assertExists($path);

        $response = $this->actingAs($user)->delete("/feed/posts/{$post->id}");
        $response->assertRedirect('/feed');

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
        $this->assertDatabaseMissing('post_media', ['id' => $media->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_non_author_cannot_delete_another_members_post(): void
    {
        $author = User::factory()->create();
        $otherUser = User::factory()->create(['is_global' => false]);
        $post = Post::create(['user_id' => $author->id, 'content' => 'Post do colega']);

        $response = $this->actingAs($otherUser)->delete("/feed/posts/{$post->id}");
        $response->assertForbidden();

        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    public function test_global_admin_can_delete_any_post(): void
    {
        $author = User::factory()->create();
        $admin = User::factory()->create(['is_global' => true]);
        $post = Post::create(['user_id' => $author->id, 'content' => 'Conteúdo inadequado']);

        $response = $this->actingAs($admin)->delete("/feed/posts/{$post->id}");
        $response->assertRedirect('/feed');

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
}
