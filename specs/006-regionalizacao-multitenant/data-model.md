# Data Model: Áreas de Usuários e Regionalização de Acessos com Divisão por Cidades (Multitenant)

## Entidades Principais

### 1. `regionals` (Regionais / Tenants)
Representa uma filial, divisão territorial ou facção do motoclube.

| Campo | Tipo | Nulável | Descrição / Regras |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | Não | Chave primária auto-incremental |
| `name` | VARCHAR(120) | Não | Nome da regional (ex: "Regional Sul", "Facção Curitiba") |
| `code` | VARCHAR(20) | Não | Código/sigla único (ex: "SUL", "PR-CWB"). Índice único |
| `city` | VARCHAR(120) | Não | Cidade sede da regional (desnormalizado de `regional_cities`) |
| `state` | CHAR(2) | Não | UF da sede da regional (desnormalizado de `regional_cities`) |
| `active` | BOOLEAN | Não | Padrão `true`. Inativação impede novas operações |
| `created_at` | TIMESTAMP | Sim | Data de criação |
| `updated_at` | TIMESTAMP | Sim | Data da última alteração |

**Regras de integridade**:
- Não é permitida exclusão física de regional com vínculos (`members`, `cash_movements`, etc.).
- `code` normalizado para maiúsculas e sem espaços.
- Possui relação 1:N com `regional_cities`.

---

### 2. `regional_cities` (Cidades da Regional)
Representa uma cidade ou município atendido e integrante de uma regional.

| Campo | Tipo | Nulável | Descrição / Regras |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | Não | Chave primária auto-incremental |
| `regional_id` | BIGINT UNSIGNED | Não | FK referenciando `regionals.id` ON DELETE CASCADE |
| `name` | VARCHAR(120) | Não | Nome do município (ex: "Curitiba", "Londrina") |
| `state` | CHAR(2) | Não | UF com 2 caracteres maiúsculos (ex: "PR", "SC") |
| `is_headquarters` | BOOLEAN | Não | Padrão `false`. Exatamente 1 cidade por regional deve ter `true` |
| `active` | BOOLEAN | Não | Padrão `true`. Inativação impede alocação de novos membros |
| `created_at` | TIMESTAMP | Sim | Data de criação |
| `updated_at` | TIMESTAMP | Sim | Data da última alteração |

**Regras de integridade**:
- Índice único composto: `UNIQUE(regional_id, name, state)` para evitar duplicação de mesma cidade na mesma regional.
- Não pode ser excluída fisicamente se houver registros vinculados em `members` (`ON DELETE RESTRICT`).
- Toda regional deve conter pelo menos 1 cidade ativa marcada como sede (`is_headquarters = true`).

---

## Modificações em Entidades Existentes

### `users`
Contas de acesso ao sistema administrativo.

| Campo | Tipo | Nulável | Descrição / Regras |
|---|---|---|---|
| `regional_id` | BIGINT UNSIGNED | Sim | FK referenciando `regionals.id`. Obrigatório se `is_global = false` |
| `is_global` | BOOLEAN | Não | Padrão `false`. Se `true`, usuário tem escopo global (Diretoria Nacional) |

**Regras de integridade**:
- Se `is_global = true`, `regional_id` deve ser `null`.
- Se `is_global = false`, `regional_id` deve ser uma regional ativa válida.
- Gestão de usuários (`AdminUserController`) só pode ser executada por usuário com `is_global = true` e permissão `administracao.edit`.

---

### `members`
Integrantes do motoclube.

| Campo | Tipo | Nulável | Descrição / Regras |
|---|---|---|---|
| `regional_id` | BIGINT UNSIGNED | Não | FK referenciando `regionals.id`. Todo membro pertence a uma regional |
| `regional_city_id` | BIGINT UNSIGNED | Sim | FK referenciando `regional_cities.id`. Município do membro dentro da regional |

**Regras de integridade**:
- Se `regional_city_id` for informado, o registro deve obrigatoriamente pertencer à mesma `regional_id` (`regional_cities.regional_id == members.regional_id`).
- Ao cadastrar membro, a `regional_id` é herdada do operador regional ou selecionada pelo admin global. O campo `regional_city_id` é selecionado a partir das cidades disponíveis na regional.
- Consultas por operadores regionais aplicam automaticamente `WHERE regional_id = user.regional_id`.

---

### `billing_periods`
Períodos de competência de mensalidades.
- FK `regional_id`: Cada regional possui sua própria competência.
- Unicidade combinada: `UNIQUE(regional_id, competence)`.

---

### `fees`
Cobranças individuais de mensalidade.
- FK `regional_id`: Pertence à regional do membro faturado.

---

### `cash_movements`
Lançamentos de caixa.
- FK `regional_id`: Movimento pertence estritamente ao caixa daquela regional.
- Saldo de caixa (`CashLedger`) soma receitas e subtrai despesas estritamente da `regional_id` ativa/filtrada.

---

## Migração e Bootstrap de Dados

1. Executar migration `2026_09_30_000004_create_regional_cities_table.php`:
   - Cria tabela `regional_cities` com constraints de chave estrangeira e índice único.
   - Popula automaticamente `regional_cities` com a cidade e UF de cada regional cadastrada na tabela `regionals`, configurando `is_headquarters = true` e `active = true`.
2. Adicionar migration `2026_09_30_000005_add_regional_city_id_to_members.php`:
   - Adiciona coluna `regional_city_id nullable` com FK para `regional_cities.id` ON DELETE SET NULL.
   - Backfill inicial opcional: vincula membros existentes à cidade sede da sua respectiva regional.
