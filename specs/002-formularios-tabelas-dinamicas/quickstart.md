# Quickstart de validação: formulários e tabelas dinâmicas

## Pré-requisitos

- Docker e Compose disponíveis.
- Serviços `app` e `db` iniciados pelo `compose.yaml`.
- Um administrador ativo com permissões de cadastro, cobranças, caixa e relatórios.
- O banco de teste `mc_ctrlr_test` criado conforme o [README](../../README.md).

## Inicialização

```bash
docker-compose up -d db app
docker-compose run --rm app php artisan migrate --force
docker-compose run --rm node npm run build
```

Para executar as verificações automatizadas:

```bash
docker-compose run --rm app php artisan test
docker-compose run --rm app vendor/bin/phpstan analyse --memory-limit=1G
docker-compose run --rm node npm run types:check
docker-compose run --rm node npm run build
docker-compose run --rm app php tests/Performance/benchmark.php
```

## Cenários de aceitação

1. **Validação e rascunho**: abrir o cadastro de membro, preencher nome, telefone e email, sair da tela e voltar durante a mesma sessão; confirmar que o rascunho é oferecido. Submeter com email inválido; confirmar erro junto ao campo e preservação dos demais valores. Simular falha de conexão, tentar novamente e concluir o cadastro.
2. **Campos dependentes e envio único**: abrir correção de caixa ou pagamento, alterar o tipo de operação e confirmar que os campos dependentes acompanham a escolha. Enviar uma vez e confirmar que o controle fica ocupado até a resposta.
3. **Tabela de membros**: pesquisar por parte do nome, filtrar situação, ordenar por nome e trocar de página. Confirmar URL sem parâmetros, estado preservado ao voltar à tela e isolamento após logout/login.
4. **Tabelas financeiras e relatórios**: aplicar período, situação/tipo e busca em mensalidades, caixa e relatórios. Exportar CSV e confirmar que os filtros da sessão são os mesmos da tela e que o endereço de exportação não contém filtros.
5. **Estados da tabela**: testar tabela sem registros e consulta sem correspondência; confirmar mensagens diferentes. Durante uma atualização, confirmar indicador de carregamento e que consultas rápidas são serializadas.
6. **Tela estreita**: em 375 px, abrir uma tabela e confirmar colunas prioritárias, expansão de linha associada via `aria-controls`, foco visível e operação por teclado ou toque. Repetir em 768 px e desktop. Em formulários, confirmar leitura linear, rótulos, erros e botões sem sobreposição.
7. **Permissões**: usar usuário sem a permissão da área e tentar consultar ou alterar diretamente uma lista/formulário; confirmar resposta recusada e ausência de dados protegidos.

## Critérios de aprovação

- Todos os cenários não exibem perda de dados, duplicação, ordenação incoerente ou acesso indevido.
- Rodar o benchmark de 10.000 membros e registrar p95 de busca, filtro e ordenação/página; o limite é 3 segundos.
- Para avaliação com participantes, registrar separadamente se houver teste moderado com pelo menos 10 pessoas; não bloquear a validação automatizada quando esse teste não estiver disponível.
- Confirmar em telas estreitas que 100% das ações principais permanecem acessíveis sem corte ou sobreposição.

Os formatos de estado e as regras de erro estão em [contracts/ui-contracts.md](contracts/ui-contracts.md). As estruturas temporárias de sessão estão em [data-model.md](data-model.md).
