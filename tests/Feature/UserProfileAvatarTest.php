<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UserProfileAvatarTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        Storage::fake('public');
    }

    public function test_user_can_upload_valid_avatar_image(): void
    {
        $user = User::factory()->create();

        $file = UploadedFile::fake()->image('avatar.jpg', 400, 400)->size(1024);

        $response = $this->actingAs($user)
            ->post('/me/profile/avatar', [
                'avatar' => $file,
            ]);

        $response->assertRedirect();

        $user->refresh();
        $this->assertNotNull($user->profile);
        $this->assertNotNull($user->profile->avatar_path);
        Storage::disk('public')->assertExists($user->profile->avatar_path);
        $this->assertNotNull($user->avatar);
    }

    public function test_user_cannot_upload_invalid_file_format_or_oversized_file(): void
    {
        $user = User::factory()->create();

        // Invalid format (PDF)
        $invalidFile = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');
        $response = $this->actingAs($user)
            ->post('/me/profile/avatar', [
                'avatar' => $invalidFile,
            ]);
        $response->assertSessionHasErrors('avatar');

        // Oversized file (> 5MB = 5120KB)
        $oversizedFile = UploadedFile::fake()->image('big.png')->size(6000);
        $response = $this->actingAs($user)
            ->post('/me/profile/avatar', [
                'avatar' => $oversizedFile,
            ]);
        $response->assertSessionHasErrors('avatar');
    }

    public function test_user_can_remove_avatar_and_deletes_file_from_storage(): void
    {
        $user = User::factory()->create();

        // Upload first
        $file = UploadedFile::fake()->image('avatar.png')->size(500);
        $this->actingAs($user)->post('/me/profile/avatar', ['avatar' => $file]);

        $user->refresh();
        $avatarPath = $user->profile->avatar_path;
        Storage::disk('public')->assertExists($avatarPath);

        // Delete avatar
        $response = $this->actingAs($user)->delete('/me/profile/avatar');
        $response->assertRedirect();

        $user->refresh();
        $this->assertNull($user->profile->avatar_path);
        Storage::disk('public')->assertMissing($avatarPath);
    }

    public function test_user_can_update_profile_details(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch('/me/profile/details', [
            'road_nickname' => 'Falcão',
            'bio' => 'Amante de viagens em duas rodas.',
            'phone' => '(11) 98765-4321',
            'social_links' => [
                'instagram' => '@falcao_mc',
            ],
        ]);

        $response->assertRedirect();

        $user->refresh();
        $this->assertEquals('Falcão', $user->profile->road_nickname);
        $this->assertEquals('Amante de viagens em duas rodas.', $user->profile->bio);
        $this->assertEquals('(11) 98765-4321', $user->profile->phone);
        $this->assertEquals('@falcao_mc', $user->profile->social_links['instagram']);
    }
}
