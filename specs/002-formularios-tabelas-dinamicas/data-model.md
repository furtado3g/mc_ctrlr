# Data Model: Formulários e tabelas dinâmicas

## Persisted domain data

Esta feature não altera as entidades oficiais. As tabelas continuam lendo e escrevendo os registros existentes:

- `Member`, `Motorcycle`, `MemberMotorcycle`, `ClubRole` e `RoleAssignment` para cadastros e hierarquia.
- `BillingPeriod`, `Fee` e `Payment` para cobranças.
- `CashMovement`, `CashCorrection` e `Receipt` para caixa.
- `User` e `PermissionGrant` para contas e autorização.

As mesmas validações, transições de estado, auditoria e regras de autorização continuam valendo. Nenhum rascunho ou estado de consulta vira registro oficial antes da submissão aceita.

## Session query state

Namespace lógico: `table_queries.{user_id}.{table_key}`

| Campo | Tipo | Regra |
|---|---|---|
| `search` | string nullable | Texto normalizado e limitado ao tamanho definido pela validação da consulta |
| `filters` | object | Somente filtros permitidos pela tabela e pelos recursos autorizados |
| `sort` | string | Somente coluna pertencente à lista explícita de ordenação da tabela |
| `direction` | `asc` ou `desc` | Valor padrão definido por tabela |
| `page` | positive integer | Reinicia para 1 quando a busca ou filtro muda |
| `per_page` | positive integer | Limitado às opções suportadas pela tabela |
| `updated_at` | timestamp | Usado para limpar estado temporário expirado |

Regras:

1. Cada tabela possui uma chave estável e independente para que filtros de membros não alterem filtros de caixa.
2. O estado é associado ao usuário autenticado e não é exposto na URL.
3. Valores inválidos são descartados ou substituídos por padrões seguros antes da consulta.
4. Consultas sem autorização não criam nem revelam estado de tabela.

## Session form draft

Namespace lógico: `form_drafts.{user_id}.{form_key}.{record_key}`

| Campo | Tipo | Regra |
|---|---|---|
| `form_key` | string | Identifica o formulário e sua versão de campos |
| `record_key` | string | `new` para criação ou identificador do registro em edição |
| `values` | object | Apenas campos editáveis e não sensíveis do formulário |
| `saved_at` | timestamp | Momento da última captura do rascunho |
| `schema_version` | string | Permite descartar rascunhos incompatíveis após mudança de campos |
| `return_url` | string nullable | Tela de origem para restauração segura dentro do painel |

Regras:

1. Rascunhos não armazenam senha, token, arquivo ou comprovante binário.
2. Um rascunho é removido quando o registro é salvo com sucesso ou quando o usuário o descarta.
3. O expurgo da sessão remove rascunhos e consultas temporárias ao seu encerramento/expiração.
4. Um erro de autorização ou validação não substitui o rascunho por dados oficiais.

## View models

### `DynamicTableState`

Representa o estado enviado à tela: `rows`, `total`, `current_page`, `per_page`, `search`, `filters`, `sort`, `direction`, `is_loading`, `empty_reason` e `expanded_row_id`.

`empty_reason` assume `no_records` quando a fonte não possui registros ou `no_matches` quando filtros e busca não encontram correspondências.

### `FormState`

Representa o estado de edição: `values`, `errors`, `processing`, `dirty`, `draft_restored`, `success_message` e `connection_error`.

`processing` bloqueia submissões repetidas; `dirty` controla o aviso de saída; `draft_restored` comunica que os valores vieram do rascunho da sessão.
