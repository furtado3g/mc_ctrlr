<?php

namespace App\Services\Cache;

use App\Models\Regional;
use App\Models\User;
use App\Support\InstitutionalPageDefaults;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AppCacheManager implements AppCacheManagerInterface
{
    public const KEY_LANDING = 'institutional:landing:content';

    public const KEY_BRAND = 'institutional:brand:published';

    public const KEY_REGIONALS = 'regionals:active:list';

    public const KEY_PERMISSIONS_VERSION = 'permissions:global_version';

    public const TTL_LANDING = 86400; // 24 hours

    public const TTL_BRAND = 86400;   // 24 hours

    public const TTL_REGIONALS = 43200; // 12 hours

    public const TTL_PERMISSIONS = 3600; // 1 hour

    /**
     * {@inheritdoc}
     */
    public function getPublishedLandingContent(): array
    {
        return $this->rememberSafe(self::KEY_LANDING, self::TTL_LANDING, function (): array {
            $content = InstitutionalPageDefaults::publishedContent();
            $sections = array_values(array_filter($content['sections'] ?? [], fn (array $section): bool => (bool) ($section['enabled'] ?? false)));
            usort($sections, fn (array $a, array $b): int => ($a['position'] ?? 0) <=> ($b['position'] ?? 0));
            $content['sections'] = array_map(function (array $section): array {
                $imagePath = $section['image_path'] ?? null;
                $section['image_url'] = is_string($imagePath) && Storage::disk('public')->exists($imagePath) ? Storage::disk('public')->url($imagePath) : null;

                return $section;
            }, $sections);

            return $content;
        });
    }

    /**
     * {@inheritdoc}
     *
     * @return array{name: string, logo: string|null, app_layout: string, auth_layout: string, appLayout: string, authLayout: string}
     */
    public function getPublishedBrand(): array
    {
        return $this->rememberSafe(self::KEY_BRAND, self::TTL_BRAND, function (): array {
            $content = InstitutionalPageDefaults::publishedContent();
            $logoPath = $content['logo_path'] ?? null;
            $appLayout = in_array($content['app_layout'] ?? null, ['sidebar', 'header'], true) ? $content['app_layout'] : 'sidebar';
            $authLayout = in_array($content['auth_layout'] ?? null, ['simple', 'card', 'split'], true) ? $content['auth_layout'] : 'simple';

            return [
                'name' => (string) ($content['name'] ?? config('app.name', 'Laravel')),
                'logo' => is_string($logoPath) && Storage::disk('public')->exists($logoPath) ? Storage::disk('public')->url($logoPath) : null,
                'app_layout' => $appLayout,
                'auth_layout' => $authLayout,
                'appLayout' => $appLayout,
                'authLayout' => $authLayout,
            ];
        });
    }

    /**
     * {@inheritdoc}
     */
    public function invalidateLanding(): void
    {
        $this->forgetSafe(self::KEY_LANDING);
        $this->forgetSafe(self::KEY_BRAND);
    }

    /**
     * {@inheritdoc}
     */
    public function getActiveRegionals(): array
    {
        return $this->rememberSafe(self::KEY_REGIONALS, self::TTL_REGIONALS, function (): array {
            return Regional::query()
                ->where('active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'code'])
                ->toArray();
        });
    }

    /**
     * {@inheritdoc}
     */
    public function getActiveRegionalWithCities(int $regionalId): ?array
    {
        $key = "regionals:{$regionalId}:with_cities";

        return $this->rememberSafe($key, self::TTL_REGIONALS, function () use ($regionalId): ?array {
            $regional = Regional::find($regionalId);
            if (! $regional || ! $regional->active) {
                return null;
            }
            $regional->loadMissing(['cities' => fn ($q) => $q->where('active', true)->orderByDesc('is_headquarters')->orderBy('name')]);

            return [
                'id' => $regional->id,
                'name' => $regional->name,
                'code' => $regional->code,
                'city' => $regional->city,
                'state' => $regional->state,
                'cities' => $regional->cities->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'state' => $c->state,
                    'is_headquarters' => (bool) $c->is_headquarters,
                ])->values()->all(),
            ];
        });
    }

    /**
     * {@inheritdoc}
     */
    public function invalidateRegionals(?int $regionalId = null): void
    {
        $this->forgetSafe(self::KEY_REGIONALS);
        if ($regionalId !== null) {
            $this->forgetSafe("regionals:{$regionalId}:with_cities");
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getUserPermissions(User $user): array
    {
        $version = $this->getPermissionsVersion();
        $key = "user:{$user->id}:permissions:v{$version}";

        return $this->rememberSafe($key, self::TTL_PERMISSIONS, function () use ($user): array {
            return collect(['cadastros', 'cobrancas', 'caixa', 'relatorios', 'administracao', 'institucional'])
                ->flatMap(fn (string $area) => collect(['view', 'edit'])
                    ->filter(fn (string $action) => $user->canAccess($area, $action))
                    ->map(fn (string $action) => ['area' => $area, 'action' => $action])
                    ->values()
                )
                ->values()
                ->all();
        });
    }

    /**
     * {@inheritdoc}
     */
    public function invalidateUserPermissions(int|User|null $user = null): void
    {
        if ($user === null) {
            // Global invalidation: increment version atomically
            try {
                $version = $this->getPermissionsVersion() + 1;
                Cache::forever(self::KEY_PERMISSIONS_VERSION, $version);
            } catch (\Throwable $e) {
                Log::warning('Failed to increment global permissions version: '.$e->getMessage());
            }

            return;
        }

        $userId = $user instanceof User ? $user->id : $user;
        $version = $this->getPermissionsVersion();
        $this->forgetSafe("user:{$userId}:permissions:v{$version}");
    }

    /**
     * {@inheritdoc}
     */
    public function checkHealth(): array
    {
        $driver = (string) config('cache.default', 'failover');
        $start = microtime(true);
        $connected = false;
        $latencyMs = 0.0;
        $status = 'ok';
        $fallbackAvailable = true;
        $details = 'Cache operacional.';

        // 1. Test Redis direct connection if Redis is configured
        $redisOk = false;
        try {
            $redisStart = microtime(true);
            $client = Redis::connection();
            $client->ping();
            $redisLatency = round((microtime(true) - $redisStart) * 1000, 2);
            $redisOk = true;
            $connected = true;
            $latencyMs = $redisLatency;
        } catch (\Throwable $e) {
            $redisOk = false;
            $details = 'Redis indisponível: '.$e->getMessage();
        }

        // 2. Test cache store read/write/forget
        $cacheWriteReadPassed = false;
        try {
            $testKey = 'health:test:ping:'.Str::random(8);
            Cache::put($testKey, 'health_ok', 30);
            $readVal = Cache::get($testKey);
            Cache::forget($testKey);
            $cacheWriteReadPassed = ($readVal === 'health_ok');
            if (! $redisOk && $cacheWriteReadPassed) {
                $latencyMs = round((microtime(true) - $start) * 1000, 2);
                $connected = true;
            }
        } catch (\Throwable $e) {
            $cacheWriteReadPassed = false;
        }

        // 3. Test TTL expiration
        $ttlPassed = false;
        try {
            $ttlKey = 'health:test:ttl:'.Str::random(8);
            Cache::put($ttlKey, 'ttl_val', 2);
            $ttlPassed = Cache::has($ttlKey);
            Cache::forget($ttlKey);
        } catch (\Throwable $e) {
            $ttlPassed = false;
        }

        if ($redisOk && $cacheWriteReadPassed) {
            $status = 'ok';
            $details = 'Redis conectado e com leitura/escrita normal.';
        } elseif ($cacheWriteReadPassed) {
            $status = 'degraded';
            $details = 'Redis offline, operando via fallback ('.$driver.').';
        } else {
            $status = 'error';
            $details = 'Falha no serviço de cache e no fallback.';
        }

        return [
            'status' => $status,
            'driver' => $driver,
            'connected' => $connected,
            'latency_ms' => $latencyMs,
            'write_read_test' => $cacheWriteReadPassed ? 'passed' : 'failed',
            'ttl_test' => $ttlPassed ? 'passed' : 'failed',
            'fallback_available' => $fallbackAvailable,
            'fallback_store' => (string) config('cache.stores.failover.stores.1', 'database'),
            'details' => $details,
            'timestamp' => now()->toIso8601ZuluString(),
        ];
    }

    protected function getPermissionsVersion(): int
    {
        try {
            return (int) Cache::get(self::KEY_PERMISSIONS_VERSION, 1);
        } catch (\Throwable $e) {
            return 1;
        }
    }

    /**
     * @template T
     *
     * @param  \Closure(): T  $callback
     * @return T
     */
    protected function rememberSafe(string $key, int $ttl, \Closure $callback): mixed
    {
        try {
            return Cache::remember($key, $ttl, $callback);
        } catch (\Throwable $e) {
            Log::warning("Cache failure for key [{$key}], falling back to source: ".$e->getMessage());

            return $callback();
        }
    }

    protected function forgetSafe(string $key): void
    {
        try {
            Cache::forget($key);
        } catch (\Throwable $e) {
            Log::warning("Cache forget failure for key [{$key}]: ".$e->getMessage());
        }
    }
}
