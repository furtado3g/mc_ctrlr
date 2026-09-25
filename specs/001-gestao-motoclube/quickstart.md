# Quickstart de validação

Este guia descreve a validação da aplicação Laravel e React com Docker.

## Pré-requisitos

- Docker com Compose ativo e portas 8000 e 5173 livres.
- `.env` copiado de `.env.example`; banco PostgreSQL no serviço `db`.
- Administrador inicial criado pelo comando interativo `mc:create-admin` ou seeder configurado.

## Inicialização esperada

```bash
cp .env.example .env
docker-compose build app
docker-compose up -d db
docker-compose run --rm app composer install --no-scripts
docker-compose run --rm app php artisan key:generate
docker-compose run --rm app php artisan migrate --seed
docker-compose exec -T db createdb -U mc_ctrlr mc_ctrlr_test
docker-compose run --rm node npm install
docker-compose run --rm app php artisan wayfinder:generate --with-form
docker-compose run --rm node npm run build
docker-compose run --rm app php artisan mc:create-admin
docker-compose up -d app
docker-compose run --rm app php artisan test
```

Para inspeção manual, abrir `http://localhost:8000` e entrar com o administrador criado. Para desenvolvimento com atualização automática, iniciar também `docker-compose up node`. Usar [contratos](contracts/admin-routes.md) para rotas e [modelo de dados](data-model.md) para regras.

## Cenários de aceitação

1. Cadastrar um membro e duas motos; encerrar um vínculo e confirmar que o histórico permanece. Desligar e reativar o membro sem perder dados.
2. Criar dois cargos e atribuir um a membro; criar usuário com permissão de cadastros, sem caixa. Confirmar HTTP 403 no acesso direto ao caixa.
3. Criar período e 500 membros ativos. Gerar mensalidades duas vezes: a segunda execução não cria duplicatas. Membro desligado antes da emissão não recebe cobrança. Membro admitido durante a competência paga valor integral.
4. Registrar pagamento parcial e depois integral. Verificar saldo, situação e uma entrada de caixa por pagamento. Tentar pagar acima do saldo e confirmar que não há alteração.
5. Estornar um pagamento com motivo. Confirmar saldo da mensalidade, caixa e histórico auditável atualizados juntos.
6. Registrar entrada e saída manuais, anexar comprovante a uma delas e confirmar que usuário sem permissão não baixa o arquivo.
7. Consultar e exportar relatórios de mensalidades, caixa e suporte fiscal. Somar CSV e comparar com registros de origem; período vazio deve mostrar zeros.
8. Verificar desempenho com 500 membros e 10 mil movimentos: emissão em até 2 minutos e consultas em até 5 segundos no ambiente de homologação.

## Resultado esperado

Todos os testes automatizados passam; os cenários acima não mostram duplicatas, saldos divergentes, dados financeiros a usuários não autorizados ou arquivos públicos. Os critérios quantitativos correspondem a `SC-001` a `SC-006` em [spec.md](spec.md).
