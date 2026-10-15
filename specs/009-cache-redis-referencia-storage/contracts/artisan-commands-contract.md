# Contract: Artisan Diagnostic Commands (`app:cache-health` e `app:storage-health`)

**Feature**: `009-cache-redis-referencia-storage`  
**Status**: Concluído  
**Data**: 2026-10-15  

---

## 1. Comando: `php artisan app:cache-health`

### Descrição
Testa e reporta a saúde do serviço de cache em memória (Redis), tempo de latência, gravação/leitura/expiração de chave de teste e capacidade de fallback.

### Assinatura e Argumentos
```bash
php artisan app:cache-health [--json]
```

- `--json`: Retorna a saída estruturada em JSON (ideal para scripts de monitoramento e CI/CD).

### Códigos de Saída (Exit Codes)
- `0`: Sucesso total (`status: ok`). Conexão ativa, latência < 10ms, operações de leitura e escrita validadas.
- `1`: Erro ou modo degradado (`status: degraded` ou `status: error`). Conexão com Redis falhou, mas fallback operou, ou falha total.

### Contrato de Saída (JSON)
```json
{
  "status": "ok",
  "driver": "redis",
  "connected": true,
  "latency_ms": 1.45,
  "write_read_test": "passed",
  "ttl_test": "passed",
  "fallback_store": "database",
  "timestamp": "2026-10-15T22:30:00Z"
}
```

---

## 2. Comando: `php artisan app:storage-health`

### Descrição
Verifica a integridade física da pasta de referência de armazenamento, permissões de escrita/leitura nos discos `public` e `receipts`, e a resolução do link simbólico `public/storage`.

### Assinatura e Argumentos
```bash
php artisan app:storage-health [--json]
```

- `--json`: Retorna a saída estruturada em JSON.

### Códigos de Saída (Exit Codes)
- `0`: Sucesso total (`status: ok`). Todas as pastas de referência existem, permissões de gravação/leitura validadas e symlink apontando para o destino correto.
- `1`: Falha de permissão, ausência de diretório de referência ou link simbólico quebrado.

### Contrato de Saída (JSON)
```json
{
  "status": "ok",
  "reference_path": "/var/www/html/storage/app",
  "disks": {
    "public": {
      "path": "/var/www/html/storage/app/public",
      "writable": true,
      "readable": true,
      "write_test": "passed"
    },
    "receipts": {
      "path": "/var/www/html/storage/app/receipts",
      "writable": true,
      "readable": true,
      "write_test": "passed"
    }
  },
  "symlink": {
    "link_path": "/var/www/html/public/storage",
    "target_path": "/var/www/html/storage/app/public",
    "valid": true
  },
  "timestamp": "2026-10-15T22:30:00Z"
}
```
