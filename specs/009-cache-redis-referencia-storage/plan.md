# Implementation Plan: Sistema de Cache em Redis e Referência Unificada de Storage no Docker

**Branch**: `009-cache-redis-referencia-storage` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/009-cache-redis-referencia-storage/spec.md`

## Summary

Implementar a infraestrutura e a lógica de aplicação para aceleração de consultas via cache em memória com Redis e estabelecer uma referência física unificada e persistente de armazenamento de arquivos no projeto na instância em que o Docker executa. A solução contempla:
1. Adição e orquestração do serviço `redis` (Redis 7 Alpine com política LRU de 256MB e persistência híbrida em disco) no `compose.yaml` com healthcheck e instalação da extensão nativa `phpredis` no contêiner `app` via `Dockerfile` (além de `predis/predis` para compatibilidade).
2. Configuração do driver de cache `failover` no Laravel (`redis` -> `database` -> `array`), garantindo 100% de disponibilidade sem erro 500 mesmo se o Redis estiver momentaneamente inativo.
3. Criação do serviço centralizador `AppCacheManager` com chaves padronizadas e invalidação automática e imediata (< 500ms) ao publicar alterações na landing page institucional, cadastros de regionais e permissões de usuários (invalidação global para cargos/grupos e granular para membros).
4. Padronização da pasta de referência física `./data/storage` (`public/` e `receipts/`) e persistência do Redis em `./data/redis` no host montadas via bind mount explícito no `compose.yaml`, protegidas por `.gitignore`, com entrega direta e veloz de `/storage/` pelo Nginx e automação do symlink `public/storage`.
5. Criação de comandos de diagnóstico `php artisan app:cache-health` e `php artisan app:storage-health` e suíte de testes de integração automatizada em PHPUnit.

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript 5.7+

**Primary Dependencies**:
- Backend: Laravel 13, Eloquent ORM, Inertia.js 3.0
- Cache: Extensão PHP `phpredis` (compilada no Dockerfile via PECL), pacote `predis/predis` (fallback no composer)
- Servidores & Contêineres: Docker Compose v2, Nginx 1.27 Alpine, Redis 7 Alpine, PostgreSQL 17 Alpine

**Storage**:
- Cache: Redis 7 (`allkeys-lru`, memória máxima de 256MB, persistência em `./data/redis`)
- Banco de Dados: PostgreSQL 17 (produção/docker) e SQLite / Postgres (testes)
- Arquivos Físicos: Pasta de referência no host `./data/storage` contendo subdiretórios `public/` (fotos de perfil, logos, mídias institucionais e feed) e `receipts/` (comprovantes privados de mensalidade)

**Testing**: PHPUnit 12+ com `RefreshDatabase`, testes de feature cobrindo conectividade com Redis, tempo de resposta, invalidação automática após mutações, resiliência/fallback sob indisponibilidade e integridade física de arquivos no storage.

**Target Platform**: Ambiente de contêineres Docker (Docker Compose) executando em instâncias de desenvolvimento ou servidores de produção (Linux/Windows com WSL2/macOS).

**Project Type**: Aplicação Web full-stack (Laravel 13 + Inertia.js + React + Nginx + PostgreSQL + Redis em Docker).

**Performance Goals**:
- Latência de leitura e escrita no Redis inferior a 10ms (p99 < 3ms).
- Redução de pelo menos 50% no tempo de resposta em requisições de leitura na landing page e regionais.
- Invalidação atômica e expurgo de chaves em menos de 500ms após publicações institucionais.
- Entrega estática de mídias públicas pelo Nginx com cache de cabeçalho (`Cache-Control: immutable, max-age=2592000`) sem onerar os workers PHP.

**Constraints**:
- Tolerância a falhas (Zero HTTP 500): se o Redis cair ou reiniciar, a aplicação deve manter 100% de disponibilidade através do store de fallback configurado (`failover`).
- Persistência garantida: 100% dos uploads devem sobreviver intactos à execução de `docker compose down && docker compose up -d` na pasta `./data/storage`.
- Isolamento Git: arquivos enviados por uploads e dumps do Redis não devem ser comitados no repositório Git.

**Scale/Scope**: Todas as consultas de leitura da landing page pública, marca institucional, menu de seleção de regionais ativas, cálculo de permissões compiladas do usuário autenticado e todos os uploads de mídias do motoclube.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio / Gate | Avaliação no Projeto | Status |
|---|---|---|
| **I. Test-First & Coverage** | Criação de testes de feature (`RedisCacheTest` e `StorageReferenceTest`) e comandos de saúde operacional cobrindo todos os fluxos de sucesso e contingência. | APROVADO |
| **II. Simplicity & YAGNI** | Aproveitamento do driver `failover` e do client `phpredis` nativos do ecossistema Laravel/Docker sem criar orquestradores proprietários complexos. | APROVADO |
| **III. Desempenho e Latência** | Redis em memória configurado com política LRU e serviço Nginx entregando mídias públicas diretamente do disco montado. | APROVADO |
| **IV. Segurança e Persistência** | Proteção de arquivos enviados com regras `.gitignore`, separação de discos público e privado (`receipts`), e validação de permissões no sistema operacional. | APROVADO |
| **V. Observabilidade e Diagnóstico** | Comandos de diagnóstico `app:cache-health` e `app:storage-health` com suporte a `--json` para monitoramento ativo e verificações de rotina. | APROVADO |

## Project Structure

### Documentation (this feature)

```text
specs/009-cache-redis-referencia-storage/
├── spec.md                  # Especificação original da funcionalidade
├── plan.md                  # Este plano de implementação
├── research.md              # Pesquisa técnica e decisões de arquitetura (Fase 0)
├── data-model.md            # Esquema de chaves de cache e layout de storage (Fase 1)
├── quickstart.md            # Guia de validação ponta a ponta (Fase 1)
├── contracts/               # Contratos de interfaces e infraestrutura (Fase 1)
│   ├── cache-service-contract.md
│   ├── artisan-commands-contract.md
│   └── docker-environment-contract.md
└── tasks.md                 # Tarefas detalhadas de implementação (Fase 2 - gerado via /speckit-tasks)
```

### Source Code (repository root)

```text
mc_ctrlr/
├── compose.yaml                             # Adição do serviço redis, volumes e variáveis
├── Dockerfile                               # Instalação da extensão phpredis via PECL
├── composer.json                            # Adição de predis/predis para compatibilidade
├── .env.example                             # Variáveis de CACHE_STORE e REDIS_*
│
├── docker/
│   └── nginx/
│       └── default.conf                     # Bloco de entrega estática de /storage/
│
├── data/                                    # Ponto de referência unificado de persistência no host
│   ├── .gitignore                           # Proteção contra commit de uploads locais e dumps
│   ├── redis/                               # Persistência em disco do Redis
│   │   └── .gitkeep
│   └── storage/                             # Armazenamento físico de mídias e comprovantes
│       ├── .gitignore
│       ├── public/                          # Disco público (logos, avatares, mídias)
│       │   └── .gitignore
│       └── receipts/                        # Disco privado (comprovantes de pagamento)
│           └── .gitignore
│
├── app/
│   ├── Services/
│   │   └── Cache/
│   │       ├── AppCacheManagerInterface.php # Contrato do serviço de cache da aplicação
│   │       └── AppCacheManager.php          # Implementação com fallback seguro e chaves
│   │
│   ├── Console/
│   │   └── Commands/
│   │       ├── CacheHealthCommand.php       # php artisan app:cache-health
│   │       └── StorageHealthCommand.php     # php artisan app:storage-health
│   │
│   ├── Actions/
│   │   └── PublishInstitutionalPageDraft.php # Disparo de invalidação da landing institucional
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── InstitutionalLandingController.php # Consumo do snapshot cacheado
│   │   │   └── RegionalController.php             # Invalidação do cache de regionais
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php          # Consumo de regionais e permissões em cache
│   │
│   └── Support/
│       └── InstitutionalBrand.php           # Cache da marca institucional publicada
│
├── config/
│   ├── cache.php                            # Configuração do store 'failover' e 'redis'
│   └── database.php                         # Configuração da conexão Redis padrão e cache
│
├── start.sh / start.ps1 / start.bat         # Automação de pastas e symlink storage:link
│
└── tests/Feature/
    ├── RedisCacheTest.php                   # Testes de hit/miss, latência, invalidação e fallback
    └── StorageReferenceTest.php             # Testes de persistência, permissão e symlink
```

**Structure Decision**: Adoção da arquitetura padrão do Laravel com camadas de serviço (`App\Services\Cache\AppCacheManager`), comandos Artisan de diagnóstico (`App\Console\Commands`), mapeamento declarativo e limpo no `compose.yaml` e diretório padronizado `./storage/app` como referência física na instância do Docker.

## Complexity Tracking

*Nenhuma violação identificada. Utilização direta das capacidades nativas do ecossistema Docker Compose, Nginx e Laravel 13 (`failover` cache driver, `phpredis`, e `Storage::disk`), sem dependências externas adicionais desnecessárias.*
