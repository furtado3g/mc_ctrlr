---
description: "Tarefas de implementação para revisão dos formulários e tabelas dinâmicas"
---

# Tasks: Formulários e tabelas dinâmicas

**Input**: Design documents from `specs/002-formularios-tabelas-dinamicas/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-contracts.md`, `quickstart.md`

**Tests**: Inclui testes de feature para autorização, validação e estado das consultas, conforme o plano e os critérios verificáveis do quickstart. A experiência visual é validada manualmente nos tamanhos de tela descritos no quickstart.

**Organization**: Tarefas agrupadas por jornada para entregar formulários, tabelas e responsividade em incrementos.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Arquivos distintos, sem dependência de tarefa incompleta.
- **[Story]**: Jornada relacionada (`US1`, `US2`, `US3`).
- Toda tarefa cita o caminho dos arquivos que deve alterar ou criar.

## Phase 1: Setup (Shared UI Foundations)

**Purpose**: Preparar contratos de tipos e componentes compartilhados no aplicativo existente.

- [X] T001 [P] Definir os tipos `FormState`, `DynamicTableState`, `TableQuery` e os estados vazios em `resources/js/types/dynamic-ui.ts`.
- [X] T002 [P] Criar componentes compartilhados de rótulo, obrigatoriedade, erro de campo, resumo de erros e ação de envio em `resources/js/components/forms/form-field.tsx`, `resources/js/components/forms/form-error-summary.tsx` e `resources/js/components/forms/form-submit.tsx`.
- [X] T003 [P] Criar estrutura base de colunas tipadas e conteúdo expansível acessível em `resources/js/components/tables/table-types.ts` e `resources/js/components/tables/expanded-row.tsx`.

---

## Phase 2: Foundational (Session and Authorization)

**Purpose**: Fornecer escopo de sessão e garantias comuns antes de implementar formulários e consultas.

**Checkpoint**: Nenhuma jornada persiste rascunho ou consulta sem sessão autenticada e autorização aplicável.

- [X] T004 Criar e compartilhar um identificador opaco de escopo temporário por sessão autenticada em `app/Http/Middleware/HandleInertiaRequests.php` e `app/Providers/FortifyServiceProvider.php`; garantir invalidação do escopo no logout e criação de outro após novo login.
- [X] T005 Criar serviço de sessão para leitura, normalização, gravação e remoção de estados por chave de tabela e por usuário em `app/Support/SessionTableQuery.php`.
- [X] T006 Criar validação compartilhada para busca limitada, filtros permitidos, ordenação allowlisted, direção, página e tamanho de página em `app/Support/TableQueryRules.php`.
- [X] T007 Adicionar teste de feature que confirme a renovação do escopo ao sair e entrar novamente e a ausência do escopo para visitantes em `tests/Feature/SessionUiStateTest.php`.

---

## Phase 3: User Story 1 - Preencher formulários com segurança (Priority: P1) 🎯 MVP

**Goal**: Padronizar validação, submissão, aviso de saída e rascunhos recuperáveis durante a sessão atual.

**Independent Test**: Abrir formulário de membro, editar campos, sair e voltar na mesma sessão, recuperar rascunho, corrigir erro de validação sem perder dados, salvar uma única vez e confirmar limpeza do rascunho.

### Tests for User Story 1

- [X] T008 [P] [US1] Cobrir autorização existente, respostas de validação, preservação de campos e ausência de mutação duplicada para operações de formulário em `tests/Feature/FormExperienceTest.php`.

### Implementation for User Story 1

- [X] T009 [P] [US1] Criar o hook `useSessionDraft` com chave versionada por escopo de sessão, formulário e registro, salvamento com debounce, restauração, remoção após sucesso e descarte explícito em `resources/js/hooks/use-session-draft.ts`.
- [X] T010 [US1] Excluir senhas, confirmações, credenciais, tokens e arquivos dos rascunhos; descartar versões incompatíveis e limpar rascunhos do escopo anterior ao trocar de sessão ou sair em `resources/js/hooks/use-session-draft.ts`, `resources/js/layouts/app-layout.tsx` e `resources/js/components/user-menu-content.tsx`.
- [X] T011 [P] [US1] Criar hook de aviso para fechamento, recarga e navegação Inertia quando o formulário estiver alterado, permitindo navegação após envio confirmado em `resources/js/hooks/use-unsaved-changes.ts`.
- [X] T012 [US1] Criar componente de formulário que associe labels e erros, mostre resumo e sucesso, exponha estado de processamento e bloqueie envio repetido em `resources/js/components/forms/admin-form.tsx`.
- [X] T013 [US1] Migrar formulário de criação e edição de membros e vínculo de motos para `useForm`, estado de rascunho e validações junto ao campo em `resources/js/pages/members/index.tsx`, `resources/js/pages/members/show.tsx` e `resources/js/components/members/motorcycle-form.tsx`.
- [X] T014 [US1] Migrar criação, edição, encerramento de períodos e ajustes de mensalidade para `useForm`, erros por campo, bloqueio de duplo envio e confirmação em `resources/js/pages/billing-periods/index.tsx`, `resources/js/pages/fees/index.tsx` e `resources/js/pages/fees/show.tsx`.
- [X] T015 [US1] Migrar pagamento, lançamento, correção e upload de comprovante para estados de submissão e erro consistentes, sem armazenar arquivo em rascunho, em `resources/js/pages/fees/show.tsx`, `resources/js/pages/cash/index.tsx` e `resources/js/components/cash/movement-form.tsx`.
- [X] T016 [US1] Migrar criação e edição de cargos, designações, usuários e permissões para componentes de formulário compartilhados em `resources/js/pages/club-roles/index.tsx`, `resources/js/components/members/role-history.tsx` e `resources/js/pages/admin/users.tsx`.
- [X] T017 [US1] Adicionar mensagens acessíveis para erro de conexão, rascunho restaurado, descarte e sucesso aos formulários compartilhados em `resources/js/components/forms/admin-form.tsx` e `resources/js/hooks/use-session-draft.ts`.
- [X] T018 [US1] Validar os cenários de erro, retomada de rascunho, logout, submissão única e preservação dos dados do quickstart em `specs/002-formularios-tabelas-dinamicas/quickstart.md` e registrar lacunas observadas em `specs/002-formularios-tabelas-dinamicas/validation.md`.

**Checkpoint**: Formulários de todas as áreas preservam trabalho durante a sessão, mostram erros acionáveis e mantêm autorização e regras de domínio existentes.

---

## Phase 4: User Story 2 - Consultar dados em tabelas dinâmicas (Priority: P1)

**Goal**: Oferecer busca, filtros, ordenação, paginação e estados consistentes com consultas guardadas na sessão e URLs limpas.

**Independent Test**: Em listas com registros diversos, buscar parcialmente, combinar filtros, ordenar, mudar página, navegar a outra tela e voltar; confirmar estado restaurado na sessão, URL limpa, total correto e resposta 403 sem permissão.

### Tests for User Story 2

- [X] T019 [P] [US2] Cobrir isolamento de estado por usuário e tabela, limpeza da sessão, allowlist de filtros/ordenação, normalização de página e URL sem parâmetros em `tests/Feature/TableQueryStateTest.php`.
- [X] T020 [P] [US2] Cobrir busca, combinação de filtros, ordenação determinística por identificador, paginação e estado vazio em 10.000 registros em `tests/Feature/DynamicTablesTest.php`.

### Implementation for User Story 2

- [X] T021 [US2] Criar ações autenticadas para substituir o estado completo da consulta e limpar o estado de uma tabela, exigindo a permissão `view` da área em `app/Http/Controllers/TableQueryController.php` e `routes/web.php`.
- [X] T022 [US2] Implementar normalização e persistência de busca, filtros, ordenação, direção, página e tamanho por sessão e chave de tabela em `app/Support/SessionTableQuery.php` e `app/Support/TableQueryRules.php`.
- [X] T023 [US2] Criar hook React para enviar estado completo, reiniciar a página ao alterar busca/filtros/ordenação, preservar consulta ao paginar e cancelar ou serializar visitas concorrentes em `resources/js/hooks/use-table-query.ts`.
- [X] T024 [US2] Criar componente server-driven com busca, filtros ativos, ordenação, paginação, total, tamanho por página, carregamento e estados `no_records`/`no_matches` em `resources/js/components/tables/data-table.tsx`.
- [X] T025 [US2] Migrar consulta de membros para estado em sessão, busca por nome/contato, filtro de situação, ordenação allowlisted e paginação estável em `app/Http/Controllers/MemberController.php` e `resources/js/pages/members/index.tsx`.
- [X] T026 [US2] Migrar consultas de cargos e usuários para estado em sessão, filtro e ordenação apropriados sem alterar as regras de permissão em `app/Http/Controllers/ClubRoleController.php`, `app/Http/Controllers/AdminUserController.php`, `resources/js/pages/club-roles/index.tsx` e `resources/js/pages/admin/users.tsx`.
- [X] T027 [US2] Migrar listas de períodos e mensalidades para paginação, filtros e ordenação em sessão, substituindo parâmetros de consulta na URL em `app/Http/Controllers/BillingPeriodController.php`, `app/Http/Controllers/FeeController.php`, `resources/js/pages/billing-periods/index.tsx` e `resources/js/pages/fees/index.tsx`.
- [X] T028 [US2] Migrar extrato de caixa para filtros de data e tipo, ordenação e paginação em sessão, preservando totais do período selecionado em `app/Http/Controllers/CashController.php` e `resources/js/pages/cash/index.tsx`.
- [X] T029 [US2] Adaptar relatórios para filtros de data e situação em sessão e fazer CSV consumir o mesmo estado validado da tabela por uma rota sem parâmetros de consulta em `app/Http/Controllers/ReportController.php`, `app/Reports/FeeReport.php`, `app/Reports/FiscalReport.php`, `routes/web.php` e `resources/js/components/reports/report-table.tsx`.
- [X] T030 [US2] Diferenciar tabela sem registros de busca sem correspondências e tratar remoções concorrentes que tornem a página atual inválida em `app/Support/SessionTableQuery.php` e `resources/js/components/tables/data-table.tsx`.
- [X] T031 [US2] Confirmar que os links de filtros, paginação e exportação não expõem o estado da consulta e que cada rota consulta dados somente após autorização em `tests/Feature/DynamicTablesTest.php` e `tests/Feature/TableQueryStateTest.php`.

**Checkpoint**: Listas e relatórios podem ser pesquisados e filtrados sem URL com parâmetros, sem expor dados e sem perder o estado durante a sessão.

---

## Phase 5: User Story 3 - Trabalhar bem em diferentes telas (Priority: P2)

**Goal**: Manter formulários e tabelas operáveis em telas estreitas, com expansão explícita de linha e navegação acessível.

**Independent Test**: Em viewport largo, médio e estreito, criar/editar um registro e consultar a tabela; confirmar foco visível, ações sem sobreposição e expansão de detalhes operável por teclado e toque.

### Tests for User Story 3

- [X] T032 [P] [US3] Adicionar cenários de verificação de acessibilidade, foco, expansão de linha e ordem responsiva ao guia de validação em `specs/002-formularios-tabelas-dinamicas/quickstart.md`.

### Implementation for User Story 3

- [X] T033 [P] [US3] Implementar linha expansível com `aria-expanded`, associação `aria-controls`, foco visível e controles por teclado em `resources/js/components/tables/expanded-row.tsx` e `resources/js/components/tables/data-table.tsx`.
- [X] T034 [US3] Configurar colunas prioritárias em tela estreita e detalhes/ações dentro da linha expandida em `resources/js/components/tables/data-table.tsx` e nas definições de colunas em `resources/js/pages/members/index.tsx`, `resources/js/pages/fees/index.tsx`, `resources/js/pages/cash/index.tsx` e `resources/js/components/reports/report-table.tsx`.
- [X] T035 [US3] Ajustar formulários para uma ordem de leitura linear em telas estreitas, mantendo labels, erros, botões e resumo acessíveis em `resources/js/components/forms/form-field.tsx`, `resources/js/components/forms/admin-form.tsx` e páginas de `resources/js/pages/` migradas nesta feature.
- [ ] T036 [US3] Verificar navegação por teclado, leitores de tela, foco e breakpoints nos cenários móveis do quickstart e registrar resultados em `specs/002-formularios-tabelas-dinamicas/validation.md`.

**Checkpoint**: Nenhuma ação principal depende de rolagem horizontal em tela estreita; detalhes e ações da linha podem ser expandidos e operados por teclado ou toque.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Medir escala, revisar regressões e finalizar documentação da feature.

- [X] T037 [P] Medir busca, filtro, ordenação e paginação p95 em 10.000 registros e adicionar índices somente se o plano de consulta medido demonstrar necessidade em `tests/Performance/` e `database/migrations/`.
- [X] T038 [P] Revisar o isolamento de sessão, limpeza no logout, exclusão de campos sensíveis e autorização de leitura/escrita em `resources/js/hooks/use-session-draft.ts`, `app/Http/Middleware/HandleInertiaRequests.php`, `app/Http/Controllers/TableQueryController.php` e `routes/web.php`.
- [X] T039 Atualizar os cenários de instalação e comandos de validação para refletir os testes finais em `specs/002-formularios-tabelas-dinamicas/quickstart.md` e `README.md`.
- [ ] T040 Executar o quickstart completo, TypeScript, PHPStan, build frontend e testes da aplicação; registrar resultados, métricas e limitações em `specs/002-formularios-tabelas-dinamicas/validation.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Tipos e componentes visuais comuns; não altera domínio.
- **Foundational (Phase 2)**: Depende de Setup e bloqueia restauração segura dos estados temporários.
- **US1 (Phase 3)**: Depende de Setup e do escopo de sessão T004; rascunhos e formulários podem então ser migrados por áreas.
- **US2 (Phase 4)**: Depende de T005–T006 para sessão e validação; tabelas independem dos formulários, exceto pelos tipos compartilhados.
- **US3 (Phase 5)**: Depende de `DataTable` e formulários migrados em US1/US2 para validar o fluxo visual completo.
- **Polish (Phase 6)**: Depende das três histórias.

### User Story Dependencies

- **US1 (P1)**: Inicia após Setup e T004; independente de tabelas.
- **US2 (P1)**: Inicia após Setup e T005–T006; independente de rascunhos de formulário.
- **US3 (P2)**: Requer estrutura de tabela da US2 e campos de formulário da US1; deve ser entregue após ambas.

### Parallel Opportunities

- T001, T002 e T003 podem ser executadas em paralelo por alterarem arquivos separados.
- T005, T006 e T007 podem avançar em paralelo após T004 quando mantiverem arquivos distintos.
- Na US1, T009, T011 e T008 atuam em arquivos distintos; migrações de formulários (T013–T016) podem ser divididas por domínio após os componentes/hooks estarem definidos.
- Na US2, T019 e T020 podem ser implementadas em paralelo; depois, T025–T029 podem ser divididas por lista/controlador.
- Na US3, T032 e T033 podem avançar em paralelo; a migração das colunas em T034 depende do componente expansível.
- T037 e T038 são tarefas separadas após as histórias.

## Parallel Example: User Story 2

```text
Após concluir T021–T024 e fixar o contrato de DynamicTable:
Trabalho A: T025 — lista de membros
Trabalho B: T026 — listas de cargos e usuários
Trabalho C: T027 — períodos e mensalidades
Trabalho D: T028 — extrato de caixa
Trabalho E: T029 — filtros e exportações de relatórios
```

## Implementation Strategy

1. Concluir Setup e Foundation para ter tipos, sessão e validação seguros.
2. Entregar US1 como MVP: erros por campo, envio único, rascunho e retomada de formulários.
3. Entregar US2 começando com o componente e serviço compartilhados, migrando cada lista de modo independente.
4. Entregar US3 para expansão móvel e acessibilidade após as tabelas e formulários estarem migrados.
5. Fechar com benchmark de 10.000 registros, revisão de autorização e execução do quickstart.

## Notes

- `[P]` indica tarefa independente em arquivos distintos, sem dependência incompleta.
- Toda tarefa de User Story contém seu rótulo `[US1]`, `[US2]` ou `[US3]`.
- Nenhuma migration de entidade de domínio está prevista; estado de consulta e rascunhos são temporários por sessão.
- O logout/expiração define o limite de retenção da sessão, com `sessionStorage` separado por escopo opaco para evitar recuperação em um login seguinte.
