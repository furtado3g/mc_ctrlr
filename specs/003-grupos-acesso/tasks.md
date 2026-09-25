# Tasks: Grupos de acesso por cargo

**Input**: Design documents from `/specs/003-grupos-acesso/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/access-management.md

**Organization**: Tasks are grouped by user story. Authorization tests are included because the specification defines 100% denial of ungranted operations as a success criterion.

## Phase 1: Setup

**Purpose**: Confirm feature context and prepare implementation validation.

- [x] T001 Review existing authorization, role assignment, audit, and account provisioning patterns in `app/Models/User.php`, `app/Models/RoleAssignment.php`, `app/Actions/RecordAuditEvent.php`, and `app/Http/Controllers/AdminUserController.php`
- [x] T002 Confirm Docker app/database service names and available test commands in `compose.yaml` and `package.json`

## Phase 2: Foundational

**Purpose**: Establish persistence and permission resolution shared by all stories.

- [x] T003 Add access groups and unique area/action grants schema in `database/migrations/`
- [x] T004 Add nullable unique member link to users and nullable access group association to club roles in `database/migrations/`
- [x] T005 [P] Implement `AccessGroup` and `AccessGroupPermission` models and relations in `app/Models/AccessGroup.php` and `app/Models/AccessGroupPermission.php`
- [x] T006 Add effective role and dynamic member permission resolution while preserving direct grants for unlinked admins in `app/Models/User.php`
- [x] T007 Add `member` and access group relations to `app/Models/Member.php` and `app/Models/ClubRole.php`
- [x] T008 Confirm registered role/action Gates delegate authorization to dynamic `User::canAccess` in `app/Providers/AppServiceProvider.php`

## Phase 3: User Story 1 - Configurar grupos de acesso por cargo (Priority: P1)

**Goal**: Administrators configure reusable groups and associate a group with each role.

**Independent Test**: Create a group, set view/edit grants, associate it to a role, and verify the role screen reports the configured effective permissions.

- [x] T009 [P] [US1] Test group validation, permission matrix uniqueness, role association constraints, and access denial in `tests/Feature/AccessGroupManagementTest.php`
- [x] T010 [US1] Add validated access group requests and role association request in `app/Http/Requests/AccessGroupRequest.php` and `app/Http/Requests/RoleAccessGroupRequest.php`
- [x] T011 [US1] Implement access group CRUD and safe deletion behavior in `app/Http/Controllers/AccessGroupController.php`
- [x] T012 [US1] Implement audit logging for group and role association changes in `app/Http/Controllers/AccessGroupController.php` using `app/Actions/RecordAuditEvent.php`
- [x] T013 [US1] Add access group routes and role group association route in `routes/web.php`
- [x] T014 [US1] Build dynamic access group administration table and form in `resources/js/pages/access-groups/index.tsx`
- [x] T015 [US1] Show role-group association and effective permission summary in the dynamic role table in `resources/js/pages/access-groups/index.tsx`
- [x] T016 [US1] Expose route navigation and group data using current Inertia patterns in `resources/js/components/app-sidebar.tsx` and `app/Http/Controllers/AccessGroupController.php`

## Phase 4: User Story 2 - Aplicar o acesso efetivo do cargo (Priority: P1)

**Goal**: Member-linked accounts inherit permissions from the active group of their effective current role.

**Independent Test**: A linked user can access an explicitly granted operation, is denied an ungranted direct request, and sees changes to role/group permissions in the same session.

- [x] T017 [P] [US2] Test linked account grant, denied area/action, inactive role/group, expired assignment, overlap precedence, no assignment, and immediate permission change in `tests/Feature/MemberRoleAccessTest.php`
- [x] T018 [US2] Add account link and active state validation to `app/Http/Requests/MemberAccountRequest.php`
- [x] T019 [US2] Implement transactional member account provisioning and linking in `app/Actions/ManageMemberAccount.php`
- [x] T020 [US2] Add member account provision/deactivate endpoints in `app/Http/Controllers/MemberAccountController.php` and `routes/web.php`
- [x] T021 [US2] Include account-link state in authorized member details while withholding account fields from users without account-management access in `app/Http/Controllers/MemberController.php`
- [x] T022 [US2] Build account provisioning and activation controls in `resources/js/pages/members/show.tsx`
- [x] T023 [US2] Verify navigation and protected reads honor inherited permissions in `app/Http/Middleware/HandleInertiaRequests.php` and `resources/js/components/app-sidebar.tsx`

## Phase 5: User Story 3 - Alterar cargos e grupos com segurança (Priority: P2)

**Goal**: Access changes are audited, unauthorized changes denied, and at least one access administrator is retained.

**Independent Test**: Verify actor/time/before/after audit data, denial for non-managers, and rejection of a mutation that removes the final access administrator.

- [x] T024 [P] [US3] Test before/after audit records, unauthorized direct mutation, last-manager protection, and account deactivation in `tests/Feature/AccessGroupManagementTest.php`
- [x] T025 [US3] Record member account link and state changes using `RecordAuditEvent` in `app/Actions/ManageMemberAccount.php`
- [x] T026 [US3] Protect access configuration mutations and enforce the final access administrator invariant in `app/Actions/AssertAccessAdministratorRemains.php`, `app/Http/Controllers/AccessGroupController.php`, and `app/Http/Controllers/AdminUserController.php`
- [x] T027 [US3] Display associated group/account state and last-administrator validation errors in `resources/js/pages/access-groups/index.tsx` and `resources/js/pages/admin/users.tsx`

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run end-to-end validation and correct integration regressions.

- [x] T028 [P] Display general validation and last-administrator errors in `resources/js/pages/access-groups/index.tsx` and `resources/js/pages/admin/users.tsx`
- [x] T029 Run focused and full backend checks in Docker using `docker-compose exec app php artisan test`, `docker-compose exec app vendor/bin/pint`, and `docker-compose exec app vendor/bin/phpstan analyse`
- [x] T030 Run frontend type checking, scoped formatting/lint checks, and the production build in Docker; the repo-wide formatter reports existing issues in unrelated files
- [x] T031 Validate migration, group and account endpoints, same-session permission changes, and build checks listed in `specs/003-grupos-acesso/quickstart.md`

## Dependencies & Execution Order

- Setup precedes Foundational; Foundational blocks all user stories.
- US1 and US2 are both P1 and depend only on Foundational, though shared authorization paths favor implementing US1 then US2.
- US3 depends on group and account mutation paths from US1 and US2.
- Polish follows all stories.

## Parallel Opportunities

- T005 can proceed alongside migration work after schema fields are agreed.
- T009 and T017 test files can be drafted independently after foundational model contracts are stable.
- Frontend group UI (T014) can proceed alongside backend CRUD after request/response props are agreed.
- Member account UI (T022) can proceed alongside T019/T020 once account payload fields are established.

## Parallel Example: User Story 1

```text
Task: T009 Access group feature tests in tests/Feature/AccessGroupManagementTest.php
Task: T014 Access group interface in resources/js/pages/access-groups/index.tsx
```

## Implementation Strategy

Complete migrations and dynamic authorization first, then deliver group configuration (US1), linked member access (US2), and audit/lockout protections (US3). Validate each story independently before proceeding; retain a running full-suite verification at the end.
