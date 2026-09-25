# Data Model: Grupos de acesso por cargo

## AccessGroup

- `id`: primary key.
- `name`: required string, max 120, unique.
- `active`: required boolean, default true.
- timestamps.
- Relationships: has many `AccessGroupPermission`; may be associated with many `ClubRole` records.
- Rules: an inactive group grants no permissions; a group referenced by a role cannot be deleted until associations are resolved.

## AccessGroupPermission

- `id`: primary key.
- `access_group_id`: required FK to `access_groups`, cascade with group deletion.
- `area`: required enum/string, one of `cadastros`, `cobrancas`, `caixa`, `relatorios`, `administracao`.
- `action`: required enum/string, one of `view`, `edit`.
- Unique `(access_group_id, area, action)`.
- A permission is effective only when the group and effective role are active.

## ClubRole

- Existing fields: `name`, `sort_order`, `active`.
- Add nullable `access_group_id` FK to `access_groups`; the role has one scalar association and an access group may be shared by multiple roles.
- A null or inactive group grants no role-derived permissions.

## User (member account)

- Existing auth fields remain unchanged.
- Add nullable unique `member_id` FK to `members`; null identifies existing standalone administrative accounts.
- Linked account uses existing unique email, Fortify password recovery, and `active` flag.
- Enforce at most one active linked account per member in application transaction/validation; a member has no more than one account link.
- Unlinked users keep direct `permission_grants`; linked users use role-derived access only.

## Effective role and access resolution

An effective role is a role assignment where `started_at <= today`, `ended_at IS NULL OR ended_at >= today`, and the referenced role is active. If multiple assignments qualify, choose smallest `sort_order`, then smallest assignment ID. A linked user receives a permission only if the selected role has an active access group containing that exact area/action grant. Missing member, assignment, role, group, or permission means deny.

## AuditEvent

Reuse existing event entity. Record actor, event time, target type/id, and before/after values for group CRUD/status, permission matrix changes, role-group associations, and member-account linking/deactivation. Credentials and password values are never recorded.
