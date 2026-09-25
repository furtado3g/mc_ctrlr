# Quickstart: Grupos de acesso por cargo

## Prerequisites

- Docker and Docker Compose are available.
- Start the project with `docker compose up -d` (or the repository's documented compose command).
- Install dependencies and configure the local environment using the repository README.

## Validate

1. Run migrations inside the application container: `docker compose exec app php artisan migrate` (adjust service name to the repository compose file).
2. Run focused access feature tests: `docker compose exec app php artisan test --filter=Access`.
3. Run the complete checks: `docker compose exec app composer ci:check` and the frontend check/build command from `package.json`.
4. In the admin UI, create an access group with `cadastros.view`, associate it with an active role, and link a member account to a member holding that role.
5. Sign in as that member: verify member/cadastro read access, and verify an ungranted write or other area returns HTTP 403, including direct requests.
6. Remove the role assignment or deactivate its role/group; repeat the protected request in the same session and verify HTTP 403.
7. Change the group/role association as an access administrator and inspect the audit record for actor, timestamp, before, and after values.
8. Confirm an unlinked administrative account continues to use its existing direct grants and the final access administrator cannot be deactivated or stripped of access.

See [data-model.md](data-model.md) and [contracts/access-management.md](contracts/access-management.md) for persistence and request behavior.
