# Access Management Contract

All routes are authenticated, verified, and require an active user. Mutations require the relevant `administracao.edit` authorization. Responses use the application's Inertia conventions; validation failures return standard Laravel validation errors.

## Operations

- `GET /access-groups`: list groups, active state, permission matrix, and role usage.
- `POST /access-groups`: create `{name, active, permissions[]}`; permission items are `{area, action}`.
- `PATCH /access-groups/{group}`: update name, state, and full permission matrix; audit before/after values.
- `DELETE /access-groups/{group}`: delete only when no role references the group.
- `PATCH /club-roles/{role}/access-group`: set `{access_group_id: integer|null}` and audit association change.
- `POST /members/{member}/account`: provision `{name, email, password}` account linked to the member; unique email; no duplicate member account.
- `PATCH /members/{member}/account`: deactivate/reactivate linked account using `{active: boolean}`; prevent removal of final access manager.

## Authorization semantics

- Unlinked existing users: `area.action` is allowed only by a matching direct `permission_grants` row.
- Linked member users: allowed only by the current effective role's active group permission.
- Unknown area/action, missing relation, inactive user/group/role, and absent permission deny access.
- Every endpoint and protected read/mutation must authorize server-side. UI visibility is informational only.
- Group configuration endpoints are protected by the existing access-management permission path and must preserve at least one active identity able to administer access.
