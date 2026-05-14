# Backend Agent Instructions

## Scope
- Applies to `backend/` only.

## Core Rules
- Use TypeORM `EntitySchema` in `backend/src/entities/`. No decorators.
- Keep routes RESTful and defined in `backend/src/routes/`.
- Put validation in `shared/validations/` and import via `@micasa/shared/...`.

## Structure
- `src/entities/` EntitySchema definitions
- `src/controllers/` Request handlers
- `src/services/` Business logic
- `src/repositories/` Data access
- `src/middlewares/` Middleware
- `src/routes/` Routing
- `src/utils/` Utilities

## Migrations
- Generate: `pnpm migration:generate -- --name=<Name>`
- Run: `pnpm migration:run`

## Related Instructions
- `.github/instructions/backend.instructions.md`
- `.github/instructions/api.instructions.md`
