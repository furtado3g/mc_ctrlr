# Quickstart de validação: Perfil do membro

## Pré-requisitos

- Docker e Docker Compose disponíveis.
- Dependências instaladas nos serviços conforme o `compose.yaml` e imagem de aplicação construída.
- Ambiente local configurado; não usar dados reais de CPF ou contatos durante os testes.

## Subir o ambiente

```sh
docker compose up -d --build
docker compose exec app php artisan migrate
```

Em um terminal separado, instalar pacotes JS quando necessário e iniciar Vite pelo serviço Node:

```sh
docker compose run --rm node npm install
docker compose up -d node
```

Aplicação: `http://localhost:8000`; Vite: `http://localhost:5173`.

Na primeira execução dos testes, criar o banco dedicado configurado em `phpunit.xml`:

```sh
docker compose exec db createdb -U mc_ctrlr mc_ctrlr_test
```

## Fluxos para validar

Consulte [profile-routes.md](contracts/profile-routes.md) para payloads e autorização, e [data-model.md](data-model.md) para campos e regras.

1. Criar conta vinculada a membro e preencher perfil próprio com CPF válido de teste, nascimento, endereço e telefone. Reabrir `/me/profile` e confirmar persistência.
2. Salvar sem contato de emergência ou garupa; depois preencher contato com nome/vínculo/telefone e companheiro(a) somente com nome/telefone.
3. Enviar CPF com pontuação e sem pontuação; confirmar armazenamento normalizado. Tentar CPF inválido e CPF já usado; confirmar rejeição sem sobrescrever o perfil salvo.
4. Cadastrar duas motos, corrigir uma e encerrar o vínculo; confirmar que as duas aparecem e o encerramento preserva histórico. Com outra conta, tentar alterar o vínculo e confirmar 404/403.
5. Sem `membros.edit_joined_at`, consultar a data de ingresso e tentar alterar diretamente; leitura deve funcionar e gravação deve retornar 403. Conceder a capacidade no grupo do cargo vigente e repetir; atualização deve funcionar e gerar auditoria.
6. Confirmar que cargo/grupo ausente ou inativo não concede a capacidade; retirar a capacidade e confirmar que o acesso deixa de valer.
7. Acessar cadastro administrativo de membro com conta autorizada e conferir os dados; repetir com conta sem `cadastros.view` e confirmar recusa. Conta de membro sem permissão de cadastro deve continuar acessando somente o próprio perfil.

## Verificações automatizadas

```sh
docker compose exec app php artisan test --filter=MemberProfile
docker compose exec app ./vendor/bin/pint --test
docker compose exec app ./vendor/bin/phpstan analyse
docker compose run --rm node npm run check
docker compose run --rm node npm run types:check
docker compose run --rm node npm run build
```

Os testes devem cobrir: regras CPF/unicidade; ownership próprio; proteção dos campos não permitidos; perfil parcial e contatos opcionais; isolamento de motos; período sobreposto; matriz de capacidades do cargo/grupo; auditoria da alteração de `joined_at`; acesso administrativo e respostas 403/404.
