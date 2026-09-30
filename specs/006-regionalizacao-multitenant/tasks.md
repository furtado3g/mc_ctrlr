---
description: "Tasks for user areas, multitenant regional access control, and 1:N regional cities division"
---

# Tasks: Áreas de Usuários, Regionalização Multitenant e Divisão em Cidades

**Input**: Design documents from `/specs/006-regionalizacao-multitenant/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/regional-routes.md](contracts/regional-routes.md), [quickstart.md](quickstart.md)

**Tests**: Test tasks included following PHPUnit / Feature test practices and the verifiable criteria of `quickstart.md` (multi-city regional creation, anti-IDOR isolation, member city allocation, and consolidated reports).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- All task descriptions include exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Update TypeScript types and shared contracts for 1:N regional cities.

- [X] T001 [P] Define TypeScript interfaces for `RegionalCity` (`id`, `regional_id`, `name`, `state`, `is_headquarters`, `active`) and update `Regional` (`cities: RegionalCity[]`, `cities_count?: number`) in `resources/js/types/regional.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Persistence schema, models, and relationships for N cities per regional and member municipalization.

**⚠️ CRITICAL**: Must complete before user story implementation.

- [X] T002 Create migration for `regional_cities` table with `id`, `regional_id bigint unsigned fk references regionals(id) on delete cascade`, `name string(120)`, `state char(2)`, `is_headquarters boolean default false`, `active boolean default true`, timestamps, composite unique index `unique(regional_id, name, state)`, and backfill existing regionals' city/state as headquarters city in `database/migrations/2026_09_30_000004_create_regional_cities_table.php`
- [X] T003 Create migration adding `regional_city_id nullable bigint unsigned fk references regional_cities(id) on delete set null` to `members` table in `database/migrations/2026_09_30_000005_add_regional_city_id_to_members.php`
- [X] T004 [P] Create `RegionalCity` Eloquent model with `$fillable = ['regional_id', 'name', 'state', 'is_headquarters', 'active']`, `$casts = ['is_headquarters' => 'boolean', 'active' => 'boolean']`, `regional()` belongsTo relation, and `members()` hasMany relation in `app/Models/RegionalCity.php`
- [X] T005 [P] Update `Regional` model to define `cities(): HasMany` relation, `headquartersCity(): HasOne` relation, and helper method to get headquarters city in `app/Models/Regional.php`
- [X] T006 [P] Update `Member` model to add `regional_city_id` to `$fillable` and define `regionalCity(): BelongsTo` relation in `app/Models/Member.php`

**Checkpoint**: Core persistence and model relations for N cities ready.

---

## Phase 3: User Story 1 - Cadastro e Estruturação de Regionais com N Cidades (Priority: P1) 🎯 MVP

**Goal**: Global administrators create, list, and update regional units with 1 or more associated cities, designating exactly one headquarters city, and managing city additions/removals with integrity checks.

**Independent Test**: As Global Admin, navigate to `/admin/regionals`, create "Regional Sul" with cities Curitiba/PR (Headquarters), Londrina/PR, and Joinville/SC. Verify list displays all 3 cities, edit regional to add Ponta Grossa/PR, and confirm integrity check blocks deletion of cities with assigned members.

### Tests for User Story 1

- [X] T007 [P] [US1] Create feature tests for regional CRUD with multiple cities: creating regional with multiple cities and 1 headquarters, updating cities list, rejecting payload without headquarters, rejecting duplicate city names in same regional, and blocking physical deletion of city with members in `tests/Feature/RegionalManagementTest.php`

### Implementation for User Story 1

- [X] T008 [US1] Update `RegionalRequest` to validate `name: required|string|max:120`, `code: required|string|max:20|unique`, `cities: required|array|min:1`, `cities.*.name: required|string|max:120`, `cities.*.state: required|string|size:2`, `cities.*.is_headquarters: boolean`, and custom validation rule ensuring exactly one city has `is_headquarters = true` in `app/Http/Requests/RegionalRequest.php`
- [X] T009 [US1] Update `RegionalController` (`index`, `store`, `update`) to eagerly load `cities` and `withCount('cities')`, persist cities inside a database transaction, synchronize additions/updates/removals of `regional_cities`, update desnormalized `city` and `state` columns on `regionals` with the headquarters values, and record audit events in `app/Http/Controllers/RegionalController.php`
- [X] T010 [US1] Update regional creation and editing modal/form to support dynamic adding, editing, and removing of N cities, with UF input and radio/checkbox to set the headquarters city in `resources/js/pages/admin/regionals/regional-form.tsx`
- [X] T011 [US1] Update regional index view to display list of cities, count badge, and visual badge for headquarters city in `resources/js/pages/admin/regionals/index.tsx`

**Checkpoint**: User Story 1 complete - regionals with multiple cities can be managed independently.

---

## Phase 4: User Story 2 - Gestão de Usuários e Compartilhamento de Cidades no Contexto (Priority: P1)

**Goal**: Global administrators manage user accounts with regional scope, and the frontend receives the active regional's cities in shared Inertia props for contextual navigation.

**Independent Test**: Authenticate as regional operator, verify `currentRegional` in shared props includes the list of cities for that regional, and verify context switcher provides active cities.

### Tests for User Story 2

- [X] T012 [P] [US2] Update feature tests in `tests/Feature/AdminUserRegionalTest.php` and `tests/Feature/RegionalContextSwitchTest.php` to verify shared Inertia props contain active regional's cities array and context switching retains cities structure.

### Implementation for User Story 2

- [X] T013 [US2] Update `HandleInertiaRequests` middleware to include `cities` (`id`, `name`, `state`, `is_headquarters`) in `currentRegional` and `auth.user.regional` props in `app/Http/Middleware/HandleInertiaRequests.php`
- [X] T014 [US2] Update `resources/js/components/regional-badge.tsx` and `resources/js/components/app-sidebar.tsx` to display headquarters city and total cities count alongside regional name.

**Checkpoint**: User Story 2 complete - regional context and cities are shared with client components.

---

## Phase 5: User Story 3 - Segregação Multitenant e Alocação de Membros por Cidade (Priority: P2)

**Goal**: Ensure members can be assigned to a specific city belonging to their regional, with validation preventing cross-regional city assignment (anti-IDOR), and member filtering by city.

**Independent Test**: Create member in Regional A selecting one of Regional A's cities. Attempt to assign a city from Regional B and confirm HTTP 422/403 rejection. Filter member list by city and confirm only members of that city appear.

### Tests for User Story 3

- [X] T015 [P] [US3] Create feature tests for member municipalization: assigning member to active regional's city, rejecting assignment to another regional's city (anti-IDOR), and filtering members list by `regional_city_id` in `tests/Feature/RegionalIsolationTest.php`

### Implementation for User Story 3

- [X] T016 [US3] Update `MemberRequest` validation rules to accept `regional_city_id: nullable|integer` and enforce that `regional_city_id` belongs to the operator's active `regional_id` via custom rule or query check in `app/Http/Requests/MemberRequest.php`
- [X] T017 [US3] Update `MemberController` to handle `regional_city_id`, eager load `regionalCity`, and apply optional query filter `where('regional_city_id', $cityId)` when provided in `app/Http/Controllers/MemberController.php`
- [X] T018 [US3] Update member management interface with city selector populated from active regional cities in member creation/edit modal and city filter dropdown in `resources/js/pages/members/index.tsx`

**Checkpoint**: User Story 3 complete - members are allocated and filterable by city within their regional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization, code style consistency, static analysis, and end-to-end validation.

- [X] T019 [P] Add composite index on `members(regional_id, regional_city_id)` in database/migrations/2026_09_30_000006_add_member_city_composite_index.php
- [X] T020 [P] Run Pint code style fixer across all modified PHP files via `vendor/bin/pint`
- [X] T021 [P] Run TypeScript type checks across modified frontend files via `npm run types:check`
- [X] T022 Run PHPStan static analysis on modified paths via `vendor/bin/phpstan analyse`
- [X] T023 Run full test suite for regional management, cities, context switching, and isolation via `php artisan test --filter=Regional`
- [X] T024 Execute quickstart end-to-end scenarios documented in `specs/006-regionalizacao-multitenant/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Blocks all User Stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion.
  - **User Story 1 (P1)**: Delivers regional management with N cities (MVP).
  - **User Story 2 (P1)**: Depends on US1 for regional entities with cities.
  - **User Story 3 (P2)**: Depends on US1 (cities exist) and US2 (regional context available).
- **Polish (Phase 6)**: Runs after all user stories are complete.

### Parallel Opportunities

- T001 can run in parallel in Setup.
- T004, T005, and T006 can run in parallel once migrations T002/T003 are written.
- Test tasks T007, T012, T015 can be authored in parallel with or before implementation tasks.
- Polish tasks T019, T020, T021 can run concurrently.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup (T001) and Foundational (T002-T006).
2. Implement User Story 1 (T007-T011): Regionals with N cities are fully operational.
3. Validate US1 independently with `RegionalManagementTest`.

### Incremental Delivery

1. Foundation + US1 → Regionals with N cities created and managed in database and UI.
2. US2 → Context middleware shares regional cities with frontend.
3. US3 → Members allocated to specific cities within their regional and filtered by city.
4. Polish → Composite indexes, static analysis, Pint, and test validation.
