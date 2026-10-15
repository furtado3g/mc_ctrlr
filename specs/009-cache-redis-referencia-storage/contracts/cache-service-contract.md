# Contract: Cache Service Interface (`AppCacheManager`)

**Feature**: `009-cache-redis-referencia-storage`  
**Status**: Concluído  
**Data**: 2026-10-15  

---

## 1. Interface PHP do Serviço

```php
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
     * @return array<string, mixed>
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
     * Invalida o cache de regionais.
     */
    public function invalidateRegionals(): void;

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
     *     status: 'ok'|'degraded'|'error',
     *     driver: string,
     *     latency_ms: float,
     *     connected: bool,
     *     fallback_available: bool,
     *     details: string
     * }
     */
    public function checkHealth(): array;
}
```

---

## 2. Comportamento de Tolerância a Falhas (Fallback)

1. **Em caso de falha de conexão com o Redis**:
   - As chamadas `get*` devem capturar a exceção de rede (`Throwable` / `RedisException`).
   - Registrar no log do Laravel (`Log::warning("Redis cache unavailable, falling back to direct source", [...])`).
   - Executar a consulta diretamente no banco de dados / disco e retornar os dados normalmente.
   - NUNCA propagar erro HTTP 500 ou quebrar a renderização da página.

2. **Em caso de falha durante a invalidação (`invalidate*`)**:
   - Tentar remover as chaves do Redis.
   - Se o Redis estiver inalcançável, capturar a exceção e prosseguir com a execução do salvamento no banco de dados, assegurando que o usuário administrador receba a confirmação de salvamento com sucesso.
