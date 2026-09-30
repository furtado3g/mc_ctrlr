# Quickstart: Validação da Regionalização com Divisão por Cidades (Multitenant)

Este guia descreve os passos de validação manual e automatizada para garantir que o isolamento multitenant, a divisão de regionais em cidades e a gestão de escopos estejam operando conforme a especificação.

---

## Pré-requisitos & Setup

Ambiente rodando com Docker Compose:

```bash
docker compose up -d
docker compose exec app php artisan migrate
```

---

## Cenários de Validação

### Cenário 1: Cadastro de Nova Regional com Múltiplas Cidades
1. Autenticar como Administrador Global (`is_global = true`).
2. Acessar `/admin/regionals`.
3. Clicar em "Nova Regional" e preencher:
   - Nome: `Regional Sul`
   - Código: `SUL`
   - Cidades:
     - Cidade 1: `Curitiba` | UF: `PR` | [x] Sede
     - Cidade 2: `Londrina` | UF: `PR` | [ ] Sede
     - Cidade 3: `Joinville` | UF: `SC` | [ ] Sede
4. Confirmar criação. A nova regional deve aparecer na listagem com 3 cidades cadastradas, indicando Curitiba como sede.

### Cenário 2: Cadastro de Membro Alocado em Cidade da Regional
1. Autenticar como operador da Regional Sul.
2. Acessar `/members` e clicar em "Novo Membro".
3. No formulário de membro, o campo de Cidade da Regional deve disponibilizar para seleção apenas as 3 cidades cadastradas na Regional Sul (Curitiba, Londrina, Joinville).
4. Selecionar `Londrina` e salvar.
5. Na listagem de membros da Regional Sul, deve ser possível filtrar membros especificamente por `Londrina`.

### Cenário 3: Proteção de Integridade na Remoção de Cidades
1. Como Administrador Global, acessar `/admin/regionals` e editar a `Regional Sul`.
2. Tentar remover a cidade `Londrina` (que já possui o membro cadastrado no Cenário 2).
3. O sistema deve rejeitar a exclusão da cidade com aviso amigável de integridade referencial.
4. Remover a cidade `Joinville` (que não possui nenhum membro vinculado).
5. O sistema deve permitir e salvar a alteração com sucesso.

### Cenário 4: Cadastro de Usuário com Escopo Regional
1. Como Administrador Global, acessar `/admin/users`.
2. Criar novo usuário:
   - Nome: `Operador Sul`
   - E-mail: `sul@motoclube.com`
   - Escopo: `Regional`
   - Regional: `Regional Sul`
   - Permissões: Cadastros, Cobranças, Caixa (`view` e `edit`).
3. Fazer logout e autenticar com `sul@motoclube.com`.
4. O topo ou menu lateral deve indicar fixamente "Regional Sul".
5. Acessar `/members`: visualiza apenas membros pertencentes à Regional Sul.

### Cenário 5: Isolamento Financeiro e de Cadastros
1. Conectado como `Operador Sul`, registrar um lançamento de caixa (Entrada R$ 100,00).
2. Verificar saldo de caixa da Regional Sul: R$ 100,00.
3. Desconectar e autenticar como operador de outra regional (ou Matriz).
4. Acessar `/members` e `/cash`: os membros e o lançamento de R$ 100,00 da Regional Sul não devem aparecer.

### Cenário 6: Bloqueio de Acesso Cruzado Direto (Anti-IDOR)
1. Como operador da Regional Sul, tentar acessar diretamente `/members/{id_matriz}` ou fazer requisição PATCH.
2. O sistema deve responder com HTTP `403 Forbidden` e registrar auditoria.

### Cenário 7: Alternância de Contexto pelo Administrador Global
1. Autenticar como Administrador Global.
2. No seletor de regional, escolher "Regional Sul".
3. Acessar `/members`: visualiza apenas os membros da Regional Sul.
4. No seletor, escolher "Todas as Regionais (Consolidado)".
5. Acessar `/reports/fiscal`: o demonstrativo deve totalizar entradas e saídas de todas as regionais de forma consolidada e conferida.

---

## Testes Automatizados

Executar a suíte de testes de isolamento, regionais e cidades:

```bash
docker compose exec app php artisan test --filter=Regional
```
