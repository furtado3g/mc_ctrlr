# MC Ctrlr

Painel administrativo para membros, motos, hierarquia, mensalidades, caixa e relatórios de um motoclube. Aplicação Laravel 13 com React 19, Inertia, Tailwind CSS e shadcn/ui.

## Desenvolvimento com Docker

Pré-requisitos: Docker e Compose. Copie `.env.example` para `.env` e execute:

```bash
docker-compose build app
docker-compose up -d db
docker-compose run --rm app composer install --no-scripts
docker-compose run --rm app php artisan key:generate
docker-compose run --rm app php artisan migrate --seed
docker-compose exec -T db createdb -U mc_ctrlr mc_ctrlr_test
docker-compose run --rm app php artisan wayfinder:generate --with-form
docker-compose run --rm node npm install
docker-compose run --rm node npm run build
docker-compose run --rm app php artisan mc:create-admin
docker-compose up -d app
```

O painel estará em `http://localhost:8000`. O comando `mc:create-admin` solicita nome, email e senha do primeiro administrador; não há cadastro público. Alternativamente, as variáveis `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL` e `INITIAL_ADMIN_PASSWORD` podem ser definidas antes de executar o seeder. A criação do banco `mc_ctrlr_test` é necessária apenas na primeira instalação. Os cenários de validação estão em `specs/001-gestao-motoclube/quickstart.md` e `specs/002-formularios-tabelas-dinamicas/quickstart.md`.

## Verificações

Crie `mc_ctrlr_test` uma vez com o comando acima; os testes usam esse banco isolado.

```bash
docker-compose run --rm app composer test
docker-compose run --rm app vendor/bin/phpstan analyse --memory-limit=1G
docker-compose run --rm node npm run types:check
docker-compose run --rm node npm run build
docker-compose run --rm app php tests/Performance/benchmark.php
```

O banco é PostgreSQL no serviço `db`. Comprovantes ficam em disco privado no volume da aplicação e só podem ser baixados mediante autorização.
# mc_ctrlr
