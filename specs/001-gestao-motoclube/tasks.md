---
description: "Tarefas de implementação do sistema de gestão do motoclube"
---

# Tasks: Gestão do motoclube

**Input**: `specs/001-gestao-motoclube/spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/admin-routes.md`, `quickstart.md`

**Organization**: Tarefas por jornada, em ordem de dependência. `[P]` indica arquivos distintos sem dependência entre as tarefas marcadas no mesmo grupo. Não há exigência de TDD na especificação; a validação final usa `quickstart.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode ser executada em paralelo com outras tarefas independentes.
- **[Story]**: Jornada correspondente em `spec.md`.
- Os caminhos são relativos à raiz do repositório.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criar a aplicação e configurar ambiente.

- [X] T001 Inicializar Laravel 13 com starter kit React/Inertia 3, TypeScript, Tailwind 4 e shadcn/ui na raiz do repositório, preservando `.specify/` e `specs/`; gerar `composer.json`, `package.json`, `resources/js/app.tsx` e `routes/web.php`.
- [X] T002 Configurar PostgreSQL, sessões, fuso de apresentação `America/Sao_Paulo` e disco privado de comprovantes em `.env.example`, `config/database.php`, `config/session.php` e `config/filesystems.php`.
- [X] T003 [P] Configurar lint e checagem de tipos do frontend em `package.json` e `tsconfig.json` conforme o starter kit gerado.
- [X] T004 [P] Documentar instalação local e pré-requisitos PHP 8.3+, Node e PostgreSQL em `README.md`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Autenticação administrativa, autorização e base auditável.

**Checkpoint**: Nenhuma jornada começa antes desta fase.

- [X] T005 Desabilitar cadastro público após provisionar o primeiro administrador e manter login/logout de sessão em `routes/auth.php` e `database/seeders/DatabaseSeeder.php`.
- [X] T006 Criar usuário administrativo ativo e concessões únicas por `(user_id, área, ação)` nas migrations `database/migrations/*_create_users_table.php` e `database/migrations/*_create_permission_grants_table.php`, com modelos `app/Models/User.php` e `app/Models/PermissionGrant.php`.
- [X] T007 Implementar autorização por áreas `cadastros`, `cobranças`, `caixa`, `relatórios`, `administração` e ações `view/edit` em `app/Providers/AppServiceProvider.php` e `app/Policies/AdminPolicy.php`; usuário inativo deve perder acesso.
- [X] T008 [P] Criar layout administrativo responsivo, navegação filtrada pelas permissões e estados de erro/carregamento em `resources/js/layouts/admin-layout.tsx` e `resources/js/components/admin-nav.tsx`.
- [X] T009 Criar registro financeiro imutável com entidade, ID, ação, autor, horário, antes/depois em `database/migrations/*_create_audit_events_table.php`, `app/Models/AuditEvent.php` e `app/Actions/RecordAuditEvent.php`.
- [X] T010 Definir rotas de usuários administrativos e edição de permissões, protegidas por `administração.edit`, em `routes/web.php`, `app/Http/Controllers/AdminUserController.php` e `resources/js/pages/admin/users.tsx`.

---

## Phase 3: User Story 1 - Administrar membros e motos (Priority: P1) 🎯 MVP

**Goal**: Cadastro consultável de membros e motos com histórico intacto.

**Independent Test**: Cadastrar membro com duas motos, encerrar um vínculo e desligar/reativar membro sem perder histórico.

- [X] T011 [P] [US1] Criar `members` com nome, email e telefone opcionais, ingresso, situação `ativo/desligado` e desligamento opcional em `database/migrations/*_create_members_table.php` e `app/Models/Member.php`; contato não é chave única.
- [X] T012 [P] [US1] Criar `motorcycles` com identificação normalizada única quando informada, fabricante, modelo, ano opcional, e `member_motorcycles` com início/fim em `database/migrations/*_create_motorcycles_tables.php`, `app/Models/Motorcycle.php` e `app/Models/MemberMotorcycle.php`.
- [X] T013 [US1] Validar criação, edição, desligamento e reativação de membro em `app/Http/Requests/MemberRequest.php` e `app/Http/Controllers/MemberController.php`; nunca apagar fisicamente histórico.
- [X] T014 [US1] Implementar vínculo de motos sem sobreposição de períodos ativos para a mesma moto em `app/Http/Requests/MemberMotorcycleRequest.php` e `app/Http/Controllers/MemberMotorcycleController.php`.
- [X] T015 [US1] Expor lista paginada, perfil e operações de membros/motos sob `cadastros.view/edit` em `routes/web.php` e `resources/js/pages/members/index.tsx`.
- [X] T016 [US1] Mostrar cadastro, motos atuais e histórico com formulários de edição em `resources/js/pages/members/show.tsx` e `resources/js/components/members/motorcycle-form.tsx`.

**Checkpoint**: US1 pode ser demonstrada sem cobranças ou caixa.

---

## Phase 4: User Story 2 - Controlar cargos e acesso (Priority: P1)

**Goal**: Hierarquia histórica sem vincular cargo às permissões do painel.

**Independent Test**: Atribuir cargo, encerrar vigência e negar caixa a usuário que só possui acesso a cadastros.

- [X] T017 [P] [US2] Criar `club_roles` com nome e ordem únicos, estado ativo, e `role_assignments` com membro, cargo e vigência em `database/migrations/*_create_club_roles_tables.php`, `app/Models/ClubRole.php` e `app/Models/RoleAssignment.php`; múltiplos membros podem ocupar o mesmo cargo.
- [X] T018 [US2] Validar ordenação e vigências de cargos, impedindo intervalos sobrepostos para o mesmo membro/cargo, em `app/Http/Requests/ClubRoleRequest.php` e `app/Http/Requests/RoleAssignmentRequest.php`.
- [X] T019 [US2] Implementar criação e consulta de cargos/designações sob `cadastros.view/edit` em `app/Http/Controllers/ClubRoleController.php`, `app/Http/Controllers/RoleAssignmentController.php` e `routes/web.php`.
- [X] T020 [US2] Criar telas de hierarquia e histórico de cargos do membro em `resources/js/pages/club-roles/index.tsx` e `resources/js/components/members/role-history.tsx`.
- [X] T021 [US2] Conferir no servidor que cargo não concede permissão administrativa e que acesso direto sem concessão retorna 403 em `app/Policies/AdminPolicy.php` e `app/Http/Controllers/AdminUserController.php`.

**Checkpoint**: US2 funciona sobre membros existentes sem depender de mensalidades.

---

## Phase 5: User Story 3 - Gerir mensalidades (Priority: P1)

**Goal**: Períodos, emissão idempotente, ajustes e pagamentos parciais/integrais.

**Independent Test**: Criar período, gerar cobranças duas vezes sem duplicatas, pagar parcialmente e confirmar saldo; pagamento acima do saldo falha.

- [X] T022 [P] [US3] Criar `billing_periods` com competência única `AAAA-MM`, vencimento, valor padrão positivo em centavos e estado `aberto/encerrado` em `database/migrations/*_create_billing_periods_table.php` e `app/Models/BillingPeriod.php`.
- [X] T023 [P] [US3] Criar `fees` únicas por `(member_id,billing_period_id)` com valor emitido, ajustes e estado; criar `payments` com valor positivo, data, forma, referência opcional, autor e estado `confirmado/estornado` em `database/migrations/*_create_fees_and_payments_tables.php`, `app/Models/Fee.php` e `app/Models/Payment.php`.
- [X] T024 [US3] Implementar cadastro e encerramento de períodos, preservando valores de cobranças já emitidas, em `app/Http/Requests/BillingPeriodRequest.php` e `app/Http/Controllers/BillingPeriodController.php`.
- [X] T025 [US3] Emitir cobrança integral apenas para membro ativo no instante da geração, sem juros automáticos e sem duplicatas em execuções repetidas/concorrentes, em `app/Actions/GenerateFees.php` e `app/Http/Controllers/FeeGenerationController.php`.
- [X] T026 [US3] Implementar ajuste individual autorizado com valor e motivo, impedindo saldo negativo e registrando auditoria em `app/Actions/AdjustFee.php` e `app/Http/Controllers/FeeAdjustmentController.php`.
- [X] T027 [US3] Registrar pagamento sob bloqueio da mensalidade e transação, recusando valor acima do saldo; reservar integração atômica com caixa conforme US4, em `app/Actions/RecordPayment.php` e `app/Http/Controllers/PaymentController.php`.
- [X] T028 [US3] Implementar lista, detalhe, histórico e estados em aberto/parcial/pago/vencido em `resources/js/pages/fees/index.tsx`, `resources/js/pages/fees/show.tsx` e `resources/js/pages/billing-periods/index.tsx`.
- [X] T029 [US3] Registrar rotas de períodos, emissão, mensalidades, ajustes e pagamentos sob `cobranças.view/edit` em `routes/web.php`; pagamento também exige `caixa.edit` antes de sua disponibilização completa.

**Checkpoint**: US3 pode demonstrar emissão e saldo; registro financeiro completo é concluído com US4.

---

## Phase 6: User Story 4 - Controlar o caixa (Priority: P2)

**Goal**: Caixa único, pagamentos integrados, movimentos manuais, estornos e comprovantes privados.

**Independent Test**: Registrar pagamento e despesa; conferir saldo, estornar pagamento, manter auditoria e negar download de comprovante sem permissão.

- [X] T030 [P] [US4] Criar `cash_movements` com tipo, valor positivo, data, categoria, descrição, origem, estado, autor e `payment_id` único opcional; criar `cash_corrections` imutáveis em `database/migrations/*_create_cash_tables.php`, `app/Models/CashMovement.php` e `app/Models/CashCorrection.php`.
- [X] T031 [P] [US4] Criar `receipts` com `movement_id` único, caminho privado, nome, tipo, tamanho, autor e data em `database/migrations/*_create_receipts_table.php` e `app/Models/Receipt.php`.
- [X] T032 [US4] Completar `app/Actions/RecordPayment.php` para criar exatamente uma entrada vinculada na mesma transação, inclusive sob concorrência; criar `app/Actions/ReversePayment.php` com motivo e reversão atômica do caixa.
- [X] T033 [US4] Criar lançamentos manuais, correções e estornos com motivo obrigatório e trilha anterior/posterior em `app/Actions/ManageCashMovement.php` e `app/Http/Controllers/CashMovementController.php`; movimento de mensalidade só muda via pagamento.
- [X] T034 [US4] Calcular saldo inicial, entradas, saídas e saldo final a partir dos movimentos válidos, sem saldos por conta ou forma de pagamento, em `app/Reports/CashLedger.php` e `app/Http/Controllers/CashController.php`.
- [X] T035 [US4] Validar upload permitido e tamanho limitado, guardar no disco privado e autorizar download em `app/Http/Requests/ReceiptRequest.php` e `app/Http/Controllers/ReceiptController.php`.
- [X] T036 [US4] Criar extrato com filtros, lançamentos, correções e comprovante em `resources/js/pages/cash/index.tsx` e `resources/js/components/cash/movement-form.tsx`.
- [X] T037 [US4] Registrar rotas de caixa, comprovantes e estorno de pagamento com `caixa.view/edit` e dupla permissão para pagamento em `routes/web.php`.

**Checkpoint**: Pagamentos e caixa reconciliam integralmente; US3 também fica concluída de ponta a ponta.

---

## Phase 7: User Story 5 - Emitir relatórios (Priority: P2)

**Goal**: Demonstrativos filtráveis e exportações conciliáveis para contabilidade.

**Independent Test**: Exportar período com e sem movimentos; conferir totais de mensalidades e caixa com os registros de origem.

- [X] T038 [P] [US5] Criar consulta de mensalidades e inadimplência com competência, vencimento, situação e totais em `app/Reports/FeeReport.php`.
- [X] T039 [P] [US5] Criar consulta fiscal de entradas e saídas com categoria, data, origem, referência, período, data de geração e totais em `app/Reports/FiscalReport.php`.
- [X] T040 [US5] Gerar CSV UTF-8 de mensalidades, caixa e suporte fiscal com filtros e totais, inclusive período vazio, em `app/Http/Controllers/ReportController.php` e `app/Reports/CsvExporter.php`.
- [X] T041 [US5] Criar páginas imprimíveis de relatórios, com filtros e estado vazio, em `resources/js/pages/reports/fees.tsx`, `resources/js/pages/reports/cash.tsx` e `resources/js/pages/reports/fiscal.tsx`.
- [X] T042 [US5] Proteger páginas e exportações por `relatórios.view` e incluir rotas em `routes/web.php`.

**Checkpoint**: Relatórios conciliam com mensalidades e caixa sem dados para usuário sem permissão.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Resumo, desempenho e validação final.

- [X] T043 Criar resumo do painel com membros ativos, mensalidades em aberto e saldo visível conforme permissões em `app/Http/Controllers/DashboardController.php` e `resources/js/pages/dashboard.tsx`.
- [X] T044 [P] Criar índices de competência, vencimento, data de movimento e relações especificados em `data-model.md` em `database/migrations/*_add_reporting_indexes.php`.
- [X] T045 Validar manualmente as oito jornadas, autorização e reconciliação descritas em `specs/001-gestao-motoclube/quickstart.md` e registrar os resultados em `specs/001-gestao-motoclube/validation.md`.
- [X] T046 Medir emissão com 500 membros e consultas com 10 mil movimentos, corrigindo gargalos em `app/Actions/GenerateFees.php`, `app/Reports/CashLedger.php` e `app/Reports/FiscalReport.php` até atingir `SC-002` e `SC-005`.
- [X] T047 Atualizar instruções reais de instalação, ambiente, administrador inicial e execução em `README.md` após validar os comandos de `specs/001-gestao-motoclube/quickstart.md`.

---

## Dependencies & Execution Order

- **Setup → Foundational**: T001–T004 antes de T005–T010; todas as histórias dependem de T005–T010.
- **US1**: T011–T016, primeiro incremento demonstrável e MVP de cadastro.
- **US2**: T017–T021 dependem de membros da US1 para atribuições; cargos podem ser criados antes.
- **US3**: T022–T029 dependem de membros da US1 e da autorização foundational.
- **US4**: T030–T037 depende de T023 e T027 para pagamentos; lançamentos manuais podem ser desenvolvidos após foundational. O checkpoint financeiro de US3 depende de US4.
- **US5**: T038–T042 depende de mensalidades e caixa para conciliação, embora as consultas possam ser construídas após seus modelos.
- **Polish**: T043–T047 após as histórias relevantes; T046 após índices e relatórios.

## Parallel Opportunities

- **US1**: T011 e T012 criam modelos distintos; depois T013 e T014 podem avançar em controladores distintos.
- **US2**: T017 e trabalho de tela T020 podem avançar após definir o contrato de dados, em arquivos separados.
- **US3**: T022 e T023 são migrations/modelos separados; T028 pode avançar após os formatos de resposta serem fixados.
- **US4**: T030 e T031 criam tabelas distintas; T034 e T035 atuam em relatórios e comprovantes separados.
- **US5**: T038 e T039 são consultas independentes; T041 pode ser montada sobre os contratos de relatório.

## Implementation Strategy

1. Entregar Setup + Foundational + US1 e demonstrar cadastro como MVP.
2. Acrescentar US2 para hierarquia e controle de acesso.
3. Acrescentar US3 + US4 como incremento financeiro completo; não liberar pagamento isolado sem entrada atômica no caixa.
4. Acrescentar US5 e finalizar painel, desempenho e validação de `quickstart.md`.
