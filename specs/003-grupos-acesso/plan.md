# Implementation Plan: Grupos de acesso por cargo

**Branch**: `003-grupos-acesso` | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-grupos-acesso/spec.md`

## Summary

Implement named access groups with view/edit permissions by existing area, associate at most one group with each club role, link member accounts to members, and derive authorization on every protected request from the member's currently effective role. Preserve direct permission grants for existing administrative accounts. Record changes in the existing audit event system and prevent removal of the final access administrator.

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript, Laravel 13, React 19
**Primary Dependencies**: Laravel, Inertia 3, Fortify, React, Tailwind CSS 4, shadcn/ui
**Storage**: Existing relational database schema (PostgreSQL in Docker deployment; migrations remain database-portable)
**Testing**: PHPUnit/Laravel feature tests, Pint, PHPStan, frontend checks
**Target Platform**: Dockerized web application
**Project Type**: Full-stack web application
**Performance Goals**: Authorization must use current database state on every protected operation; avoid per-area permission query fan-out.
**Constraints**: Member accounts inherit access from active role assignments and active groups. Existing unlinked admin accounts retain direct permission grants. No public signup.
**Scale/Scope**: Club-scale member registry; five existing areas (`cadastros`, `cobrancas`, `caixa`, `relatorios`, `administracao`), each with view/edit actions.

## Constitution Check

The repository constitution is still the untouched Spec Kit placeholder template and defines no ratified project principles. No constitution gates can be evaluated. Design follows the established single Laravel/Inertia application, keeps authorization server-side, and reuses current authentication, role assignment, audit, and permission-grant patterns.

**Post-design check**: Pass. No new application boundary or external service is introduced. Authorization remains enforced in Laravel on each operation; sensitive configuration changes are auditable.

## Project Structure

### Documentation (this feature)

```text
specs/003-grupos-acesso/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code

```text
app/Models/                 # User, Member, ClubRole, access group and permission models
app/Actions/                # Access group and member account mutation/audit actions
app/Http/Controllers/       # Access group, role association and member account endpoints
app/Http/Requests/          # Validated mutation inputs
app/Http/Middleware/        # Existing active-user protection; effective access resolved by User
database/migrations/        # Access groups, group permissions and member account link
resources/js/pages/         # Access group and role access administration screens
resources/js/components/    # Permission matrix and access summary components
routes/web.php              # Authenticated feature routes
tests/Feature/              # Authorization, account linking, auditing and UI endpoint behavior
```

**Structure Decision**: Extend the existing single Laravel/Inertia application. Keep `permission_grants` as the legacy grant source for unlinked administrators and use a dedicated access-group model for member role inheritance.

## Complexity Tracking

No constitution violations or additional architectural projects.
