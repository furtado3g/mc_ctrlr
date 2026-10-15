# Contract: Docker Environment & Service Topology

**Feature**: `009-cache-redis-referencia-storage`  
**Status**: Concluído  
**Data**: 2026-10-15  

---

## 1. Especificação de Serviços no `compose.yaml`

### 1.1 Serviço `redis`
```yaml
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - ./data/redis:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
```

### 1.2 Atualizações no Serviço `app`
```yaml
  app:
    build: .
    working_dir: /var/www/html
    volumes:
      - .:/var/www/html
      - ./data/storage:/var/www/html/storage/app
      - ./docker/php/uploads.ini:/usr/local/etc/php/conf.d/uploads.ini:ro
    ports:
      - "127.0.0.1:8000:8000"
    environment:
      DB_CONNECTION: pgsql
      DB_HOST: db
      DB_PORT: 5432
      DB_DATABASE: mc_ctrlr
      DB_USERNAME: mc_ctrlr
      DB_PASSWORD: local_dev_password
      REDIS_HOST: redis
      REDIS_PORT: 6379
      CACHE_STORE: failover
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
```

### 1.3 Atualizações no Serviço `nginx`
```yaml
  nginx:
    image: nginx:alpine
    depends_on:
      - app
    ports:
      - "127.0.0.1:8080:80"
    volumes:
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - ./data/storage/public:/var/www/html/storage/app/public:ro
```

### 1.4 Volume Compartilhado
```yaml
volumes:
  postgres_data:
```

---

## 2. Rota Estática no `docker/nginx/default.conf`

```nginx
server {
    listen 80;
    server_name _;

    client_max_body_size 50m;

    # Entrega estática de mídias públicas persistentes
    location /storage/ {
        alias /var/www/html/storage/app/public/;
        try_files $uri =404;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # Proxy reverso para a aplicação Laravel
    location / {
        proxy_pass http://app:8000;
        proxy_http_version 1.1;
        proxy_buffer_size 16k;
        proxy_buffers 8 16k;
        proxy_busy_buffers_size 32k;
        proxy_set_header Host $forwarded_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $forwarded_host;
        proxy_set_header X-Forwarded-Proto $forwarded_proto;
        proxy_set_header X-Forwarded-Port $forwarded_port;
    }
}
```

---

## 3. Variáveis de Ambiente no `.env` e `.env.example`

```env
# Cache
CACHE_STORE=failover
CACHE_PREFIX=mc_ctrlr-cache-

# Redis
REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Storage Local & Asset URL
FILESYSTEM_DISK=local
```
