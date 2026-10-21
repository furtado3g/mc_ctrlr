<?php

namespace App\Services\Cache;

use App\Models\User;

interface AppCacheManagerInterface
{
    /**
     * Obtém o conteúdo publicado da landing page institucional com cache.
     *
     * @return array<string, mixed>
     */
    public function getPublishedLandingContent(): array;

    /**
     * Obtém as informações públicas de marca e layout com cache.
     *
     * @return array{name: string, logo: string|null, app_layout: string, auth_layout: string, appLayout?: string, authLayout?: string}
     */
    public function getPublishedBrand(): array;

    /**
     * Invalida as entradas de cache da landing page e marca institucional.
     */
    public function invalidateLanding(): void;

    /**
     * Obtém a lista de regionais ativas com cache.
     *
     * @return array<int, array{id: int, name: string, code: string}>
     */
    public function getActiveRegionals(): array;

    /**
     * Obtém uma regional com suas cidades ativas estruturadas com cache.
     *
     * @return array<string, mixed>|null
     */
    public function getActiveRegionalWithCities(int $regionalId): ?array;

    /**
     * Invalida o cache de regionais.
     */
    public function invalidateRegionals(?int $regionalId = null): void;

    /**
     * Obtém as permissões compiladas do usuário com cache.
     *
     * @return array<int, array{area: string, action: string}>
     */
    public function getUserPermissions(User $user): array;

    /**
     * Invalida as permissões em cache de um usuário específico ou de todos.
     */
    public function invalidateUserPermissions(int|User|null $user = null): void;

    /**
     * Executa teste de conectividade, medição de latência e saúde do Redis.
     *
     * @return array{
     *     status: string,
     *     driver: string,
     *     connected: bool,
     *     latency_ms: float,
     *     write_read_test: string,
     *     ttl_test: string,
     *     fallback_available: bool,
     *     fallback_store: string,
     *     details: string,
     *     timestamp: string
     * }
     */
    public function checkHealth(): array;
}
