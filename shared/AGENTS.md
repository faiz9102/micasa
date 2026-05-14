# Shared Agent Instructions

## Scope
- Applies to `shared/` only.

## Core Rules
- Put all Zod validation in `shared/validations/`.
- Import via subpath exports, e.g. `@micasa/shared/validations/user.schema.js`.
- Keep schemas source-of-truth for both frontend and backend.

## Structure
- `validations/` Zod schemas
- `utils/` Shared helpers

## Related Instructions
- `.github/instructions/shared.instructions.md`
