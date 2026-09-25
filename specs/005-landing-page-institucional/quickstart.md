# Quickstart: Landing page institucional

## Pré-requisitos

- Docker Compose disponível no ambiente.
- Arquivo `.env` configurado com os valores do ambiente local.
- Serviços `app` e `db` iniciados; PostgreSQL saudável.

## Preparar o ambiente

Na raiz do repositório:

```bash
docker compose up -d --build app db
docker compose exec app php artisan migrate
docker compose run --rm node npm run build
```

## Validação automatizada

Executar os testes do módulo institucional e das permissões:

```bash
docker compose exec app php artisan test --filter=InstitutionalPageManagement
docker compose exec app php artisan test --filter=InstitutionalLandingPage
docker compose exec app php artisan test --filter=AccessGroupManagement
```

Executar os gates de estilo e tipos do backend, além do build frontend:

```bash
docker compose exec app ./vendor/bin/pint --test
docker compose exec app ./vendor/bin/phpstan analyse
docker compose run --rm node npm run types:check
docker compose run --rm node npm run build
```

Os testes institucionais devem provar a rota pública sem login, o conteúdo padrão, a negação das rotas administrativas sem permissão, o isolamento entre rascunho e publicação, a publicação explícita, a substituição/fallback de imagens e a preservação da publicação anterior em falhas.

## Validação manual de ponta a ponta

1. Entre com uma conta administrativa de teste e configure um grupo de acesso/cargo com `institucional.view` e `institucional.edit`.
2. Associe o grupo a um cargo vigente de um membro com conta vinculada ou use as concessões administrativas diretas compatíveis com a conta de teste.
3. Abra a área de manutenção institucional, preencha nome, logo e seções, e salve como rascunho.
4. Abra uma janela anônima em `/`; confirme que o visitante continua vendo o fallback ou a última versão publicada, sem nenhum conteúdo do rascunho.
5. Volte ao painel, confira a prévia administrativa e publique o rascunho.
6. Atualize `/`, as telas de login e o painel; confirme nome/logo iguais e as seções ativas na ordem salva.
7. Remova `institucional.edit` mantendo `view`; confirme que a conta consegue consultar o editor, mas salvamento e publicação recebem `403`.
8. Remova também `institucional.view`; confirme que a área administrativa recebe `403`, enquanto `/` continua pública.
9. Tente salvar arquivo não permitido, maior que o limite ou conteúdo inválido; confirme erros visíveis e que a versão pública não muda.

## Referências

- Contratos de rotas, permissões e payloads: [contracts/landing-page.md](contracts/landing-page.md)
- Entidade, snapshots, seções e estados: [data-model.md](data-model.md)
