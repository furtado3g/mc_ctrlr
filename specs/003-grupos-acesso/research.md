# Research: Grupos de acesso por cargo

## Decisions

### Reuse the existing area/action vocabulary
- **Decision**: Access groups grant `view` and `edit` per existing area: `cadastros`, `cobrancas`, `caixa`, `relatorios`, and `administracao`.
- **Rationale**: The application already uses these ten area/action pairs in `AppServiceProvider` Gates and stores direct grants in `permission_grants`.
- **Alternatives considered**: Free-form permissions would make typo prevention, UI configuration, and route consistency harder.

### Resolve member permissions dynamically
- **Decision**: `User::canAccess` queries the linked member's current role assignment, active role, active access group, and group permission; it does not cache the result in the session.
- **Rationale**: Spec FR-011 requires updates to take effect on the next protected operation in an existing session.
- **Alternatives considered**: Session-cached permissions require invalidation across active sessions and risk stale access.

### Preserve administrator grants separately
- **Decision**: Users with no `member_id` continue to use direct `permission_grants`; linked member accounts derive access from role groups.
- **Rationale**: This preserves the current admin authorization behavior as required by FR-013 while avoiding unintended union of manually granted and inherited access.
- **Alternatives considered**: Combining grant sources for linked accounts could retain revoked permissions unexpectedly.

### One deterministic effective role
- **Decision**: Select among current assignments using the lowest `club_roles.sort_order`; tie-break on assignment ID. Require assignment end date to be null or not earlier than today and role active.
- **Rationale**: Matches the spec assumption and existing hierarchy ordering while ensuring a stable result.
- **Alternatives considered**: Unioning every current assignment would make an accidental overlapping assignment broaden access.

### Audit sensitive mutations via existing audit infrastructure
- **Decision**: Record group, permission, role-group association, and member account changes through the existing `AuditEvent` / `RecordAuditEvent` pattern with before/after payloads.
- **Rationale**: Reuses the application's established audit model and actor attribution.
- **Alternatives considered**: A separate access audit log duplicates infrastructure and reporting behavior.

### Account provisioning
- **Decision**: Authorized administrators create/link member accounts; `users.member_id` is nullable and unique; no public registration is added. Deactivation uses the existing active flag.
- **Rationale**: Aligns with the specification and existing Fortify authentication and password reset flows.
- **Alternatives considered**: A separate member credentials table would duplicate authentication and recovery flows.

## Existing application patterns reviewed

- Laravel 13, PHP 8.3, Inertia 3, React 19; Docker-based development/deployment.
- `User::canAccess` currently checks `permission_grants`; Gates are defined for the five areas and two actions.
- `Member`, `ClubRole`, and `RoleAssignment` already represent members, hierarchy, and role dates.
- `RecordAuditEvent` is the shared audit action; `AdminUserController` manages existing administrative direct grants.
- Routes use authenticated, verified, active-user middleware and controller-level Gate authorization.
