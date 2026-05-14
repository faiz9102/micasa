# Backend Instructions

## Stack
- Node.js + Express 5 + TypeORM (EntitySchema)
- PostgreSQL

## Routes
- Mounted at `/rest/v1` in `backend/src/app.js`.

## Entity Rules
- Use `EntitySchema` only.
- Keep entities in `backend/src/entities/`.

## Data Access
- Repositories in `backend/src/repositories/`.
- Business logic in `backend/src/services/`.

## Migrations
- Generate: `pnpm migration:generate -- --name=<Name>`
- Run: `pnpm migration:run`

## Related
- `backend/AGENTS.md`
- `.github/instructions/api.instructions.md`
