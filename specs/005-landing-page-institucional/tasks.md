# Tasks: Landing page institucional e personalização de layout/logo

**Input**: Design documents from `specs/005-landing-page-institucional/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks included following the project's PHPUnit / Feature test practices and existing institutional test suite.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify and prepare project structure and shared resources

- [X] T001 Verify project structure and assets for institutional branding in `app/Support/` and `resources/js/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and data structures that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Update `app/Support/InstitutionalPageDefaults.php` with default system layouts quoting constraints: `app_layout: 'sidebar'` (enum `sidebar`|`header`) and `auth_layout: 'simple'` (enum `simple`|`card`|`split`)
- [X] T003 [P] Update `app/Support/InstitutionalBrand.php` to resolve and return published `app_layout` and `auth_layout` alongside `name` and `logo`
- [X] T004 [P] Update `app/Http/Middleware/HandleInertiaRequests.php` to share `app_layout` and `auth_layout` in Inertia global props for all requests

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Manter a página, identidade institucional e layouts (Priority: P1) 🎯 MVP

**Goal**: Permitir que um administrador autorizado altere nome, logo, selecione as variantes de layout do sistema (`app_layout`: `sidebar`|`header`, `auth_layout`: `simple`|`card`|`split`) e edite as seções da landing page, salvando como rascunho e publicando explicitamente.

**Independent Test**: Com uma conta que possui `institucional.view` e `institucional.edit`, alterar o nome, logo e selecionar layouts (`header` para app e `card` para auth); confirmar que salvar como rascunho não afeta a visualização pública ou de outros usuários e que publicar faz os novos layouts e a marca aparecerem em todo o sistema.

### Tests for User Story 1

- [X] T005 [P] [US1] Add feature tests for layout options validation, draft preservation, and publishing in `tests/Feature/InstitutionalPageManagementTest.php`

### Implementation for User Story 1

- [X] T006 [US1] Update request validation in `app/Http/Requests/InstitutionalPageRequest.php` quoting constraints: `name` ('required, string, max:120, not_regex:/^\s*$/u'), `logo` ('nullable, image, mimes:png,jpg,jpeg,webp, max:5120'), `app_layout` ('nullable, string, in:sidebar,header'), and `auth_layout` ('nullable, string, in:simple,card,split')
- [X] T007 [US1] Update draft save action to persist `app_layout` and `auth_layout` in draft snapshot in `app/Actions/SaveInstitutionalPageDraft.php`
- [X] T008 [US1] Update admin controller to pass layout options and metadata in `app/Http/Controllers/InstitutionalPageAdminController.php`
- [X] T009 [P] [US1] Create layout variant selector component with visual preview cards in `resources/js/components/layout-variant-selector.tsx`
- [X] T010 [US1] Update institutional editor form to integrate layout selector and logo controls in `resources/js/pages/institutional-page/edit.tsx`
- [X] T011 [US1] Update application layout wrapper to dynamically render `AppSidebarLayout` or `AppHeaderLayout` based on `app_layout` prop in `resources/js/layouts/app-layout.tsx`
- [X] T012 [US1] Update auth layout wrapper to dynamically render `AuthSimpleLayout`, `AuthCardLayout`, or `AuthSplitLayout` based on `auth_layout` prop in `resources/js/layouts/auth-layout.tsx`
- [X] T013 [US1] Update `AppLogo` component to render custom uploaded logo with fallback icon in `resources/js/components/app-logo.tsx`

**Checkpoint**: User Story 1 complete - layouts, logos, and landing content can be configured, previewed, and published independently.

---

## Phase 4: User Story 2 - Conhecer o motoclube pela página pública (Priority: P1)

**Goal**: Permitir que qualquer pessoa visitante acesse `/` sem autenticação e veja as informações institucionais, nome, logo e seções ativas na ordem publicada, com link para login.

**Independent Test**: Abrir `/` em uma sessão não autenticada e verificar a apresentação institucional, o nome e logo configurados, as seções ativas na ordem publicada e o acesso à tela de login.

### Tests for User Story 2

- [X] T014 [P] [US2] Add feature tests for public landing page rendering, brand fallback, and auth redirect link in `tests/Feature/InstitutionalLandingPageTest.php`

### Implementation for User Story 2

- [X] T015 [US2] Ensure landing controller delivers published brand and active sections in `app/Http/Controllers/InstitutionalLandingController.php`
- [X] T016 [US2] Verify and enhance public landing page view with responsive sections and login CTA in `resources/js/pages/landing/index.tsx`

**Checkpoint**: User Stories 1 and 2 working together seamlessly.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Quality assurance, consistency, and validation across all user stories

- [X] T017 [P] Run Pint code style fixer across modified PHP files in `app/` and `tests/`
- [X] T018 [P] Run TypeScript type checks across modified frontend files in `resources/js/`
- [X] T019 Run full test suite for institutional and access group features via `vendor/bin/phpunit`
- [X] T020 Run end-to-end validation scenarios documented in `specs/005-landing-page-institucional/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion.
  - User Story 1 (P1): Can start immediately after Foundational.
  - User Story 2 (P1): Can start after Foundational or in parallel with US1.
- **Polish (Final Phase)**: Depends on completion of all user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Independent of US2. Delivers the core administrative editing, layout selection, logo upload, draft persistence, and publication.
- **User Story 2 (P1)**: Consumes the published brand snapshot and sections published by US1, but handles default fallbacks when unpublished.

### Within Each User Story

- Tests written first to establish acceptance criteria.
- Backend defaults and validation before frontend UI controls.
- UI components before page-level integration.

### Parallel Opportunities

- Phase 2: T003 and T004 can be executed in parallel once T002 is complete.
- Phase 3: T005 (tests) and T009 (UI component) can run in parallel.
- Phase 4: T014 can be developed in parallel with US1 frontend tasks.
- Phase 5: T017 and T018 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch test creation and frontend component in parallel:
Task: "Add feature tests for layout options validation, draft preservation, and publishing in tests/Feature/InstitutionalPageManagementTest.php"
Task: "Create layout variant selector component with visual preview cards in resources/js/components/layout-variant-selector.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (T002 to T004)
3. Complete Phase 3: User Story 1 (T005 to T013)
4. **STOP and VALIDATE**: Test admin configuration, layout switching, logo upload, draft saving, and publishing.

### Incremental Delivery

1. Setup + Foundational ready.
2. Deliver US1 (Admin layouts and brand management) → MVP.
3. Deliver US2 (Public landing page with published content and branding).
4. Polish and automated verification (Pint, TypeScript check, PHPUnit).
