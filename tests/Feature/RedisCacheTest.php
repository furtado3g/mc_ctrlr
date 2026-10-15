<?php

namespace Tests\Feature;

use App\Actions\PublishInstitutionalPageDraft;
use App\Models\InstitutionalPage;
use App\Models\Regional;
use App\Models\User;
use App\Services\Cache\AppCacheManager;
use App\Services\Cache\AppCacheManagerInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class RedisCacheTest extends TestCase
{
    use RefreshDatabase;

    private AppCacheManagerInterface $cacheManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cacheManager = app(AppCacheManagerInterface::class);
        $this->cacheManager->invalidateLanding();
        $this->cacheManager->invalidateRegionals();
        $this->cacheManager->invalidateUserPermissions();
    }

    public function test_landing_page_content_is_cached_and_invalidated_on_publish(): void
    {
        $admin = User::factory()->create();
        $page = InstitutionalPage::query()->home()->first() ?? InstitutionalPage::create(['key' => 'home']);

        // Set initial published content
        $page->update([
            'published_content' => [
                'title' => 'Titulo Original',
                'sections' => [
                    ['id' => '1', 'title' => 'Secao 1', 'enabled' => true, 'position' => 0],
                ],
            ],
            'draft_content' => [
                'title' => 'Titulo Novo do Rascunho',
                'sections' => [
                    ['id' => '1', 'title' => 'Secao 1 Nova', 'enabled' => true, 'position' => 0],
                ],
            ],
        ]);

        // First call caches the content
        $cached = $this->cacheManager->getPublishedLandingContent();
        $this->assertSame('Titulo Original', $cached['title']);
        $this->assertTrue(Cache::has(AppCacheManager::KEY_LANDING));

        // Publish draft
        $action = app(PublishInstitutionalPageDraft::class);
        $action->execute($admin->id);

        // Verify cache was invalidated
        $this->assertFalse(Cache::has(AppCacheManager::KEY_LANDING));

        // Next call fetches updated content
        $fresh = $this->cacheManager->getPublishedLandingContent();
        $this->assertSame('Titulo Novo do Rascunho', $fresh['title']);
    }

    public function test_active_regionals_are_cached_and_invalidated(): void
    {
        $initialActiveCount = Regional::query()->where('active', true)->count();

        Regional::create(['name' => 'Regional Sul', 'code' => 'RSU', 'city' => 'Porto Alegre', 'state' => 'RS', 'active' => true]);
        Regional::create(['name' => 'Regional Inativa', 'code' => 'INA', 'city' => 'Curitiba', 'state' => 'PR', 'active' => false]);

        $regionals = $this->cacheManager->getActiveRegionals();
        $this->assertCount($initialActiveCount + 1, $regionals);
        $names = array_column($regionals, 'name');
        $this->assertContains('Regional Sul', $names);
        $this->assertNotContains('Regional Inativa', $names);
        $this->assertTrue(Cache::has(AppCacheManager::KEY_REGIONALS));

        // Create new active regional and invalidate
        Regional::create(['name' => 'Regional Norte', 'code' => 'RNO', 'city' => 'Manaus', 'state' => 'AM', 'active' => true]);
        $this->cacheManager->invalidateRegionals();

        $this->assertFalse(Cache::has(AppCacheManager::KEY_REGIONALS));

        $updated = $this->cacheManager->getActiveRegionals();
        $this->assertCount($initialActiveCount + 2, $updated);
        $updatedNames = array_column($updated, 'name');
        $this->assertContains('Regional Norte', $updatedNames);
    }

    public function test_user_permissions_are_cached_and_invalidated_granularly_and_globally(): void
    {
        $user1 = User::factory()->create(['active' => true]);
        $user2 = User::factory()->create(['active' => true]);

        // Cache permissions
        $p1 = $this->cacheManager->getUserPermissions($user1);
        $p2 = $this->cacheManager->getUserPermissions($user2);

        // Granular invalidation for user1 only
        $this->cacheManager->invalidateUserPermissions($user1);

        // Global invalidation
        $this->cacheManager->invalidateUserPermissions();
        $freshP1 = $this->cacheManager->getUserPermissions($user1);
        $this->assertSame($p1, $freshP1);
    }

    public function test_cache_health_check_returns_valid_telemetry_structure(): void
    {
        $health = $this->cacheManager->checkHealth();

        $this->assertArrayHasKey('status', $health);
        $this->assertArrayHasKey('driver', $health);
        $this->assertArrayHasKey('latency_ms', $health);
        $this->assertArrayHasKey('connected', $health);
        $this->assertArrayHasKey('fallback_available', $health);
        $this->assertArrayHasKey('details', $health);
        $this->assertIsFloat($health['latency_ms']);
    }
}
