# Research: Sistema de Cache em Redis e Referência Unificada de Storage no Docker

**Feature**: `009-cache-redis-referencia-storage`  
**Status**: Concluído  
**Data**: 2026-10-15  

---

## 1. Cliente e Driver Redis no PHP/Docker

### Contexto
A aplicação roda sobre PHP 8.3 e Laravel 13 no contêiner `app` (`php:8.3-cli-bookworm`). Atualmente, o módulo `redis` não está instalado na imagem base do PHP e o `compose.yaml` não possui serviço Redis declarado.

### Decisão
1. **Extensão Nativa `phpredis` no Dockerfile**:
   - Adicionar `pecl install redis && docker-php-ext-enable redis` na compilação do contêiner `app` via `Dockerfile`.
   - `phpredis` é a extensão oficial em linguagem C, proporcionando o menor overhead de CPU e latência sub-milissegundo (< 2ms) em operações de cache.
2. **Pacote `predis/predis` no Composer**:
   - Adicionar `predis/predis` como dependência para permitir fallback em ambientes de desenvolvimento ou scripts locais onde a extensão compilada em C possa não estar presente.
3. **Configuração Padrão**:
   - Manter `REDIS_CLIENT=phpredis` no ambiente padrão do Docker e `.env.example`.

### Rationale
- Atende com folga ao requisito de latência inferior a 10ms (SC-001 e US3).
- Compatibilidade nativa com Laravel 13 e suporte a Redis Sentinel / Cluster / Locks se necessário no futuro.

### Alternativas Consideradas
- *Apenas `predis/predis`*: Rejeitado para o contêiner principal porque a biblioteca em PHP puro consome mais ciclos de CPU e memória sob alta carga.
- *Memcached*: Rejeitado porque o requisito explícito do usuário é Redis e o projeto se beneficia de estruturas atômicas, locks e tags do Redis.

---

## 2. Orquestração do Redis no Docker Compose e Topologia de Rede

### Contexto
O arquivo `compose.yaml` já orquestra `app`, `db` (PostgreSQL 17), `nginx` e `node`. É necessário integrar o Redis com inicialização garantida e verificação de saúde (*healthcheck*).

### Decisão
1. Adicionar o serviço `redis` no `compose.yaml`:
   - Imagem: `redis:7-alpine`.
   - Comando de execução otimizado para cache: `redis-server --save "" --appendonly no --maxmemory 256mb --maxmemory-policy allkeys-lru`.
   - Porta exposta no host: `127.0.0.1:6379:6379` para facilidade de depuração e ferramentas locais (RedisInsight, CLI).
   - Healthcheck: `CMD ["redis-cli", "ping"]` com intervalo de 5s, timeout 3s e 5 retentativas.
2. Atualizar o serviço `app`:
   - Declarar dependência de saúde: `depends_on: redis: condition: service_healthy`.
   - Adicionar variáveis de ambiente: `REDIS_HOST: redis`, `REDIS_PORT: 6379`, `CACHE_STORE: failover`.

### Rationale
- A política de memória `allkeys-lru` garante que, caso o cache atinja o limite de 256MB, as chaves menos recentemente utilizadas sejam expurgadas automaticamente sem derrubar o contêiner.
- Desabilitar RDB/AOF persistente pesado (`--save "" --appendonly no`) maximiza o throughput e a longevidade de I/O em disco para dados puramente voláteis de cache.

### Alternativas Consideradas
- *Redis com AOF síncrono ativado*: Rejeitado pois adiciona penalidade desnecessária de I/O para um store de cache volátil onde a fonte primária da verdade é o PostgreSQL.

---

## 3. Resiliência e Mecanismo de Fallback (Tolerância a Falhas)

### Contexto
O requisito FR-004 e o critério SC-004 exigem que o sistema permaneça 100% disponível (sem erro HTTP 500) mesmo se o serviço Redis cair, for reiniciado ou estiver sob manutenção.

### Decisão
1. **Configuração de Store `failover` no Laravel**:
   - Ajustar o store `failover` em `config/cache.php`:
     ```php
     'failover' => [
         'driver' => 'failover',
         'stores' => [
             'redis',
             'database',
             'array',
         ],
     ],
     ```
   - Definir `CACHE_STORE=failover` no `.env.example` e na execução de produção/docker.
2. **Camada Segura de Cache (`AppCacheManager` ou `CacheService`)**:
   - Para operações críticas de recuperação de dados, encapsular chamadas com blocos `try/catch` tratando `Throwable`/`RedisException`. Se uma exceção de rede ocorrer durante a operação, o sistema registra warning no log e executa a query diretamente no banco de dados, sem propagar erro 500 ao usuário final.

### Rationale
- O driver `failover` nativo do Laravel 11/12/13 lida automaticamente com indisponibilidades de conexão, chaveando transparentemente para o banco ou array em memória da requisição.
- A blindagem no service layer garante que até mesmo operações específicas com tags ou flush não quebrem as requisições em trânsito.

### Alternativas Consideradas
- *Ignorar falhas e deixar a exceção estourar*: Viola explicitamente o critério SC-004.
- *Criar driver de cache customizado do zero*: Desnecessário e viola o princípio YAGNI, visto que o Laravel já dispõe do driver `failover`.

---

## 4. Estratégia de Chaves, TTLs e Invalidação Automática

### Contexto
Os requisitos FR-002 e FR-003 determinam o cache de:
1. Snapshot institucional da landing page e dados de marca pública.
2. Lista de regionais ativas e cidades.
3. Permissões compiladas do usuário autenticado.

### Decisão
Definir catálogo de chaves e gatilhos de invalidação automatizados:

| Domínio | Chave / Padrão | TTL | Gatilho de Invalidação |
|---|---|---|---|
| **Landing Institucional** | `institutional:landing:content` | 24 horas | Ação `PublishInstitutionalPageDraft::execute()` |
| **Marca Institucional** | `institutional:brand:published` | 24 horas | Ação `PublishInstitutionalPageDraft::execute()` |
| **Regionais Ativas** | `regionals:active:list` | 12 horas | Eventos `saved`/`deleted` no model `Regional` ou `RegionalCity` |
| **Cidades da Regional** | `regionals:{id}:cities` | 12 horas | Eventos `saved`/`deleted` no model `RegionalCity` |
| **Permissões do Usuário** | `user:{id}:permissions` | 1 hora | Alteração em `RoleAssignment`, `ClubRole`, `AccessGroup` ou `PermissionGrant` |

### Rationale
- O uso de TTLs longos (12h a 24h) maximiza a taxa de *cache hit* em dados institucionais que mudam raramente.
- A invalidação orientada a eventos e ações específicas garante consistência imediata (latência de expurgo < 5ms), satisfazendo SC-003 (< 500ms).

### Alternativas Consideradas
- *Invalidação baseada apenas em TTL curto (ex.: 5 minutos)*: Rejeitada porque causaria consultas desnecessárias ao banco e ainda deixaria uma janela de até 5 minutos com dados desatualizados após uma publicação.

---

## 5. Referência Unificada de Armazenamento no Docker

### Contexto
O usuário solicitou: *"crie uma referencia de storage em alguma pasta do projeto na instancia que estiver rodando o docker"*.
Os arquivos enviados incluem logos, fotos institucionais, avatares de perfil e comprovantes financeiros. Atualmente, o contêiner monta o projeto inteiro em `/var/www/html`, mas não há mapeamento explícito e dedicado documentado para armazenamento persistente no host, nem entrega direta otimizada de mídias pelo Nginx.

### Decisão
1. **Pasta de Referência Física Padronizada no Projeto**:
   - A pasta de referência física oficial no repositório é `./storage/app` (com suas subpastas estruturadas `./storage/app/public` e `./storage/app/receipts`).
   - Mapeamento explícito no `compose.yaml`:
     ```yaml
     services:
       app:
         volumes:
           - .:/var/www/html
           - ./storage/app:/var/www/html/storage/app
           - ./docker/php/uploads.ini:/usr/local/etc/php/conf.d/uploads.ini:ro
     ```
2. **Entrega de Mídia Estática pelo Nginx**:
   - Montar o diretório de mídias públicas no serviço `nginx`:
     ```yaml
     nginx:
       volumes:
         - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
         - ./storage/app/public:/var/www/html/storage/app/public:ro
     ```
   - Configurar bloco de rota estática no `docker/nginx/default.conf`:
     ```nginx
     location /storage/ {
         alias /var/www/html/storage/app/public/;
         try_files $uri =404;
         access_log off;
         expires 30d;
     }
     ```
   - Isso garante que arquivos públicos sejam entregues pelo Nginx diretamente a partir do disco, reduzindo o consumo de processos PHP e evitando problemas de portas incorretas no link simbólico (FR-007).
3. **Persistência e Isolamento Git**:
   - Configurar arquivos `.gitignore` específicos em `storage/app/public` e `storage/app/receipts` para que diretórios estruturais sejam versionados via `.gitkeep`, mas arquivos de upload dos usuários nunca sejam comitados no repositório.
4. **Automação do Link Simbólico nos Scripts de Inicialização**:
   - Assegurar que `start.sh`, `start.ps1` e `start.bat` criem as pastas necessárias caso não existam e executem `php artisan storage:link --force`.

### Rationale
- Mantém toda a mídia física armazenada dentro da pasta do projeto na instância hospedeira do Docker, facilitando backups, replicação e auditoria de arquivos.
- A reconstrução ou destruição de contêineres (`docker compose down && docker compose up -d`) preserva 100% dos arquivos na pasta do host (SC-002).

### Alternativas Consideradas
- *Named Volume do Docker (ex.: `storage_data:/var/www/html/storage/app`)*: Rejeitado como opção única porque o usuário solicitou explicitamente *"em alguma pasta do projeto na instância que estiver rodando o docker"*, tornando bind mounts na pasta do projeto a solução exigida.

---

## 6. Comandos e Ferramentas de Diagnóstico e Saúde Operacional

### Contexto
O requisito FR-008 e a User Story 3 exigem visibilidade e testes confiáveis da saúde do cache e do sistema de armazenamento.

### Decisão
Criar comandos Artisan dedicados:
1. `php artisan app:cache-health`:
   - Conecta ao Redis configurado.
   - Mede latência de leitura e escrita (validando se < 10ms).
   - Testa gravação, recuperação, expiração e exclusão de chave de teste.
   - Testa e reporta o status do store de fallback.
2. `php artisan app:storage-health`:
   - Valida a existência física e permissões de escrita em `storage/app/public` e `storage/app/receipts`.
   - Valida o link simbólico `public/storage` e resolve a URL do disco público.
   - Escreve, lê e remove um arquivo temporário de teste.

### Rationale
- Fornece diagnóstico imediato para administradores e para a esteira de CI/CD sem precisar de acesso manual ao terminal de cada contêiner.
- Permite criar testes automatizados de feature confiáveis em PHPUnit.
