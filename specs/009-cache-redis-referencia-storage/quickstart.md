# Quickstart & Guia de Validação: Cache Redis e Referência de Storage

**Feature**: `009-cache-redis-referencia-storage`  
**Status**: Concluído  
**Data**: 2026-10-15  

---

## 1. Pré-Requisitos

- Docker Desktop ou Docker Engine com suporte a Compose v2.
- Repositório clonado e arquivo `.env` configurado com base em `.env.example`.
- Portas disponíveis no host: `8000` (app), `8080` (nginx), `5432` (db) e `6379` (redis).

---

## 2. Inicialização do Ambiente

Execute o script de inicialização do projeto:

```bash
# No Windows (PowerShell):
./start.ps1

# No Linux / macOS / WSL:
./start.sh
```

Verifique se todos os 4 serviços estão saudáveis (`Up` ou `Up (healthy)`):
```bash
docker compose ps
```

---

## 3. Cenários de Validação Ponta a Ponta

### Cenário 1: Diagnóstico de Conexão e Latência do Redis
**Objetivo**: Confirmar que o serviço Redis está ativo, acessível pelo contêiner `app` e com latência sub-milissegundo (< 10ms).

**Comando**:
```bash
docker compose exec app php artisan app:cache-health --json
```

**Resultado Esperado**:
- Código de saída `0`.
- Saída JSON indicando `"status": "ok"`, `"connected": true`, `"latency_ms" < 10.0` e `"write_read_test": "passed"`.

---

### Cenário 2: Verificação da Referência de Armazenamento e Symlink
**Objetivo**: Confirmar que a pasta de referência `./storage/app` existe no host, que os discos `public` e `receipts` possuem permissão de escrita/leitura e que o link `public/storage` está operacional.

**Comando**:
```bash
docker compose exec app php artisan app:storage-health --json
```

**Resultado Esperado**:
- Código de saída `0`.
- Saída JSON indicando `"status": "ok"`, discos com permissão de escrita e symlink `"valid": true`.

---

### Cenário 3: Cache de Leitura Acelerada e Invalidação Imediata (US1)
**Objetivo**: Provar que consultas repetidas à landing page usam o cache em memória e que a publicação de alterações invalida o cache instantaneamente (< 500ms).

**Passos**:
1. Efetue uma primeira requisição à landing page:
   ```bash
   curl -s -o /dev/null -w "%{time_total}\n" http://localhost:8080/
   ```
2. Efetue requisições subsequentes (tempo de resposta deve reduzir em pelo menos 50% devido ao cache hit).
3. Conecte-se como administrador e publique uma alteração institucional (ou via Artisan/Test):
   ```bash
   docker compose exec app php artisan test --filter=RedisCacheTest
   ```
4. Ao recarregar a página pública, a nova informação deve estar imediatamente visível, comprovando a invalidação sem necessidade de limpeza manual.

---

### Cenário 4: Resiliência e Fallback Gracioso com Redis Pausado (US1 / SC-004)
**Objetivo**: Provar que, caso o serviço Redis seja pausado ou caia, o sistema opera em modo de contingência transparente sem emitir erro HTTP 500.

**Passos**:
1. Pause o contêiner do Redis:
   ```bash
   docker compose pause redis
   ```
2. Acesse a landing page pública e navegue pelo sistema:
   ```bash
   curl -I http://localhost:8080/
   ```
   **Resultado Esperado**: Código HTTP `200 OK` (sem tela de erro ou HTTP 500).
3. Despause o contêiner do Redis:
   ```bash
   docker compose unpause redis
   ```
4. Execute novamente `app:cache-health` e confirme que a conexão foi restabelecida automaticamente.

---

### Cenário 5: Persistência Física de Arquivos após Recriação de Contêineres (US2 / SC-002)
**Objetivo**: Garantir que mídias enviadas permanecem salvas na pasta `./data/storage/public` no host mesmo após a destruição e recriação dos contêineres Docker.

**Passos**:
1. Crie um arquivo de teste dentro da pasta de storage público:
   ```bash
   docker compose exec app php -r "Storage::disk('public')->put('test-persistence.txt', 'dados-preservados');"
   ```
2. Verifique que o arquivo foi gravado fisicamente na pasta local do host: `./data/storage/public/test-persistence.txt`.
3. Pare e destrua os contêineres da aplicação:
   ```bash
   docker compose down
   ```
4. Recrie os contêineres:
   ```bash
   docker compose up -d
   ```
5. Acesse o arquivo através da URL pública do Nginx:
   ```bash
   curl -s http://localhost:8080/storage/test-persistence.txt
   ```
   **Resultado Esperado**: Retorno com status `200 OK` e conteúdo `"dados-preservados"`.
6. Limpeza do arquivo de teste:
   ```bash
   docker compose exec app php -r "Storage::disk('public')->delete('test-persistence.txt');"
   ```

---

## 4. Execução da Suíte Completa de Testes Automatizados

Para rodar todos os testes de feature de cache e storage:

```bash
docker compose exec app php artisan test --filter=Cache
docker compose exec app php artisan test --filter=Storage
```
