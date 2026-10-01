<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\Motorcycle;
use App\Models\Post;
use App\Models\Regional;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_member_can_view_public_profile_of_another_member(): void
    {
        $viewer = User::factory()->create();

        $regional = Regional::create(['name' => 'Vale do Paraíba', 'code' => 'VLP', 'city' => 'São José dos Campos', 'state' => 'SP']);
        $targetMember = Member::create([
            'name' => 'Roberto Silva',
            'status' => 'active',
            'joined_at' => '2020-03-15',
            'cpf' => '12345678901',
            'emergency_contact_phone' => '11999999999',
            'regional_id' => $regional->id,
            'city' => 'São José dos Campos',
            'state' => 'SP',
        ]);

        $moto = Motorcycle::create(['manufacturer' => 'BMW', 'model' => 'R 1250 GS', 'year' => 2022]);
        $targetMember->motorcycleLinks()->create(['motorcycle_id' => $moto->id, 'started_at' => '2020-03-15']);

        $targetUser = User::factory()->create([
            'name' => 'Roberto Silva',
            'member_id' => $targetMember->id,
            'regional_id' => $regional->id,
        ]);
        $targetUser->profile()->create([
            'road_nickname' => 'Gavião',
            'bio' => 'Mais de 15 anos de estrada.',
        ]);

        $post1 = Post::create(['user_id' => $targetUser->id, 'regional_id' => $regional->id, 'content' => 'Viagem ao Sul']);

        $response = $this->actingAs($viewer)
            ->get("/members/{$targetMember->id}/public-profile");

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('profile/show')
                ->where('member.id', $targetMember->id)
                ->where('member.name', 'Roberto Silva')
                ->where('member.road_nickname', 'Gavião')
                ->where('member.bio', 'Mais de 15 anos de estrada.')
                ->where('member.regional', 'Vale do Paraíba')
                ->has('member.motorcycles', 1)
                ->has('posts.data', 1)
                ->where('posts.data.0.id', $post1->id)
                ->missing('member.cpf')
                ->missing('member.emergency_contact_phone'));
    }
}
