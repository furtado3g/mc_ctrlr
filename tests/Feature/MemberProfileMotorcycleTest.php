<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\MemberMotorcycle;
use App\Models\Motorcycle;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MemberProfileMotorcycleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_member_can_keep_multiple_motorcycles_and_end_a_link_without_deleting_history(): void
    {
        [$member, $user] = $this->memberAndUser('Joana');

        $this->actingAs($user)->post('/me/profile/motorcycles', $this->motorcycle('ABC1234', 'Street 500'))->assertRedirect();
        $this->actingAs($user)->post('/me/profile/motorcycles', $this->motorcycle(null, 'Trail 700'))->assertRedirect();

        $this->assertDatabaseCount('member_motorcycles', 2);
        $this->actingAs($user)->get('/me/profile')->assertInertia(fn (Assert $page) => $page
            ->has('member.motorcycle_links', 2));
        $link = MemberMotorcycle::where('member_id', $member->id)->whereHas('motorcycle', fn ($query) => $query->where('model', 'Street 500'))->firstOrFail();
        $this->actingAs($user)->patch("/me/profile/motorcycles/{$link->id}", $this->motorcycle('ABC1234', 'Street 500 S'))->assertRedirect();
        $this->assertDatabaseHas('motorcycles', ['id' => $link->motorcycle_id, 'model' => 'Street 500 S']);

        $this->actingAs($user)->delete("/me/profile/motorcycles/{$link->id}")->assertRedirect();
        $this->assertDatabaseHas('member_motorcycles', ['id' => $link->id, 'ended_at' => today()->toDateString()]);
        $this->assertDatabaseCount('member_motorcycles', 2);
    }

    public function test_member_cannot_change_another_members_motorcycle_link(): void
    {
        [, $owner] = $this->memberAndUser('Joana');
        [, $otherUser] = $this->memberAndUser('Maria');
        $link = $this->createLink($owner->member_id, 'OWNER1');

        $this->actingAs($otherUser)->patch("/me/profile/motorcycles/{$link->id}", $this->motorcycle('OWNER1', 'Street 500'))->assertForbidden();
        $this->actingAs($otherUser)->delete("/me/profile/motorcycles/{$link->id}")->assertNotFound();
        $this->assertDatabaseHas('member_motorcycles', ['id' => $link->id, 'ended_at' => null]);
    }

    public function test_overlapping_vehicle_periods_and_conflicting_existing_identifier_are_rejected(): void
    {
        [$member, $user] = $this->memberAndUser('Joana');
        $this->actingAs($user)->post('/me/profile/motorcycles', $this->motorcycle('SHARED1', 'Street 500'))->assertRedirect();

        [, $otherUser] = $this->memberAndUser('Maria');
        $this->actingAs($otherUser)->post('/me/profile/motorcycles', $this->motorcycle('SHARED1', 'Street 500'))
            ->assertSessionHasErrors('started_at');
        $this->actingAs($user)->post('/me/profile/motorcycles', $this->motorcycle('SHARED1', 'Different Model'))
            ->assertSessionHasErrors('identifier');

        $this->assertDatabaseCount('member_motorcycles', 1);
        $this->assertDatabaseHas('motorcycles', ['identifier' => 'SHARED1', 'model' => 'Street 500']);
        $this->assertSame($member->id, MemberMotorcycle::firstOrFail()->member_id);
    }

    /** @return array{Member, User} */
    private function memberAndUser(string $name): array
    {
        $member = Member::create(['name' => $name, 'joined_at' => today(), 'status' => 'active']);
        $user = User::factory()->create(['member_id' => $member->id]);

        return [$member, $user];
    }

    /** @return array<string, mixed> */
    private function motorcycle(?string $identifier, string $model): array
    {
        return [
            'identifier' => $identifier,
            'manufacturer' => 'Honda',
            'model' => $model,
            'year' => 2022,
            'started_at' => today()->toDateString(),
        ];
    }

    private function createLink(int $memberId, string $identifier): MemberMotorcycle
    {
        $motorcycle = Motorcycle::create(['identifier' => $identifier, 'manufacturer' => 'Honda', 'model' => 'Street 500', 'year' => 2022]);

        return MemberMotorcycle::create(['member_id' => $memberId, 'motorcycle_id' => $motorcycle->id, 'started_at' => today()]);
    }
}
