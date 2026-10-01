# Tasks: Gerador de Post de Aniversário para Instagram

**Input**: Design documents from `specs/008-post-aniversario-instagram/` (`plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/birthday-posts-endpoints.md`, `quickstart.md`)

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/birthday-posts-endpoints.md`

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths and clear actions in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar tipos TypeScript e navegação base para o módulo de aniversariantes.

- [X] T001 [P] Define TypeScript interfaces for `BirthdayMember`, `PostFormat`, `PostTheme`, and `PostGeneratorConfig` in `resources/js/types/birthdays.ts`
- [X] T002 Register "Aniversariantes" navigation item with Lucide Cake icon in `resources/js/components/app-sidebar.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Controlador de backend, rotas e testes básicos de cálculo e filtragem de aniversariantes.

**⚠️ CRITICAL**: Nenhuma história de usuário pode ser finalizada antes da conclusão desta fase.

- [X] T003 [P] Create feature tests for birthday queries, period filters (`today`, `week`, `month`), regional scoping, and search endpoint in `tests/Feature/BirthdayPostTest.php`
- [X] T004 Implement `BirthdayPostController` with `index` (querying `members.birth_date` with `whereMonth`/`whereDay`, calculating `days_until`, `is_today`, and `turning_age`) and `searchMembers` in `app/Http/Controllers/BirthdayPostController.php`
- [X] T005 Register birthday routes (`GET /birthdays`, `GET /birthdays/members/search`) with auth and active middleware in `routes/web.php`

**Checkpoint**: Endpoints de backend e contratos de dados prontos e testados.

---

## Phase 3: User Story 1 - Listagem de Aniversariantes e Geração de Arte para o Instagram (Priority: P1) 🎯 MVP

**Goal**: Listar aniversariantes do período e permitir gerar com um clique um post em alta resolução (1080x1080) com foto de perfil, nome, apelido, brasão do clube, download em PNG/JPEG e cópia de legenda de parabéns.

**Independent Test**: O gestor acessa `/birthdays`, clica em "Gerar Post Instagram" no card de um aniversariante, visualiza a arte renderizada no canvas, baixa o arquivo PNG e copia a legenda pré-formatada.

### Implementation for User Story 1

- [X] T006 [P] [US1] Create Canvas rendering engine utility supporting high-resolution 1080x1080 drawing, circular avatar clipping, club logo, member name, road nickname, and typography in `resources/js/components/birthdays/canvas-renderer.ts`
- [X] T007 [P] [US1] Create birthday member card component displaying avatar, name, road nickname, regional badge, birthday date, and action trigger in `resources/js/components/birthdays/birthday-card.tsx`
- [X] T008 [P] [US1] Create caption generator component with pre-formatted congratulations message and copy-to-clipboard action in `resources/js/components/birthdays/birthday-caption-box.tsx`
- [X] T009 [US1] Create birthday post generator modal with live canvas preview, format toggle, PNG/JPEG download, fallback image upload, and caption copy in `resources/js/components/birthdays/birthday-generator-modal.tsx`
- [X] T010 [US1] Create birthdays index page with summary metric cards, filter controls, member grid, and generator modal integration in `resources/js/pages/birthdays/index.tsx`

**Checkpoint**: User Story 1 (MVP) funcional e testável de forma independente.

---

## Phase 4: User Story 2 - Personalização de Moldura, Formato e Ajuste de Foto (Priority: P2)

**Goal**: Permitir alternar entre 3 formatos (Feed 1:1, Retrato 4:5, Stories 9:16), 3 temas visuais de motoclube e ajustar zoom/enquadramento da foto do membro.

**Independent Test**: No gerador de arte, o operador seleciona o formato "Stories (9:16)", aplica zoom no rosto do membro, seleciona o tema "Dark Gold" e observa a atualização em tempo real antes de exportar a imagem.

### Implementation for User Story 2

- [X] T011 [P] [US2] Update `canvas-renderer.ts` in `resources/js/components/birthdays/canvas-renderer.ts` implementing 3 visual themes (`dark_gold`, `asphalt_speed`, `classic_vintage`) and 3 dimension presets (`feed_square`, `feed_portrait`, `stories`)
- [X] T012 [P] [US2] Create interactive photo zoom and pan controls component in `resources/js/components/birthdays/photo-transform-controls.tsx`
- [X] T013 [US2] Integrate theme selector, format tabs, zoom controls, and mobile Web Share API (`navigator.share`) into `resources/js/components/birthdays/birthday-generator-modal.tsx`

**Checkpoint**: User Stories 1 e 2 funcionais e integradas com múltiplas opções de personalização.

---

## Phase 5: User Story 3 - Visualização e Alertas de Próximos Aniversários (Priority: P3)

**Goal**: Facilitar a visualização organizada de aniversariantes com filtros rápidos por período ("Hoje", "Próximos 7 Dias", "Este Mês"), filtro por regional e busca avulsa de qualquer membro do clube.

**Independent Test**: O operador clica na aba "Hoje", visualiza apenas quem faz aniversário na data atual com badge de destaque, ou pesquisa qualquer outro membro no botão "Post Avulso" para gerar uma arte imediata.

### Implementation for User Story 3

- [X] T014 [US3] Add quick period tabs ("Hoje", "Próximos 7 Dias", "Este Mês") and regional dropdown filter to `resources/js/pages/birthdays/index.tsx`
- [X] T015 [P] [US3] Create member search dialog for ad-hoc post generation of any active club member in `resources/js/components/birthdays/member-search-dialog.tsx`

**Checkpoint**: Todas as 3 histórias de usuário funcionais e integradas.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificação de conformidade, execução dos testes automatizados e garantia de qualidade de código.

- [X] T016 [P] Execute quickstart validation scenarios defined in `specs/008-post-aniversario-instagram/quickstart.md`
- [X] T017 Run backend test suite via `php artisan test --filter=BirthdayPostTest`
- [X] T018 Run frontend code checks and typecheck via `npm run types:check` and `npm run check`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode iniciar imediatamente.
- **Foundational (Phase 2)**: Depende da Fase 1 — BLOQUEIA a implementação das páginas e componentes.
- **User Story 1 (Phase 3)**: Depende da Fase 2 — Entrega o MVP completo.
- **User Story 2 (Phase 4)**: Depende da Fase 3 — Adiciona múltiplos temas, formatos e controles de zoom.
- **User Story 3 (Phase 5)**: Depende da Fase 3 — Adiciona busca avulsa e filtros avançados.
- **Polish (Phase 6)**: Executada ao final da implementação.

### Parallel Opportunities

- T001 (types) e T002 (sidebar) podem ser executados em paralelo.
- T003 (testes de backend) pode ser escrito em paralelo com T004.
- T006 (canvas utility), T007 (card) e T008 (caption box) podem ser desenvolvidos em paralelo antes da integração no modal T009.
- T011 (temas no canvas) e T012 (controles de zoom) podem ser desenvolvidos em paralelo.
