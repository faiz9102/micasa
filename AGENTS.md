# Agent Instructions: micasa

## 🤖 1. AI Rules of Engagement (CRITICAL)
- **Plan Before Coding:** Always state your plan and the files you intend to modify before writing code.
- **No TypeScript:** This codebase is strictly Javascript (`.js`/`.jsx`). Do NOT generate or suggest `.ts` or `.tsx` files.
- **No Placeholders:** Write complete code. Never use `// ... existing code` or placeholders unless specifically requested to abbreviate.
- **Package Manager:** Strictly use `pnpm` (v10+). Never use `npm` or `yarn`.
- **Workspace Awareness:** Run all commands from the root directory using workspace filters (e.g., `pnpm -C backend dev` or `pnpm --filter backend <command>`).

## 🏗️ 2. Architecture & Tech Stack
- **Monorepo:** pnpm workspaces (`backend`, `frontend`, `shared`).
- **Backend:** Node.js (v20+), Express 5, PostgreSQL, TypeORM.
- **Frontend:** React 19, Vite, Tailwind CSS 4 (via Vite plugin), Redux Toolkit, React Router 7.
- **Shared:** Zod schemas for validation (`@micasa/shared`).

## ⚙️ 3. Backend Directives & Specifics
- **Entry point:** `backend/src/server.js` (includes graceful shutdown handling for SIGTERM, SIGINT, uncaughtException, and unhandledRejection).
- **Entity Definition:** You MUST use TypeORM's `EntitySchema` API for all entities in `backend/src/entities/`. **NEVER use decorators** (e.g., `@Entity`, `@Column`), as this project does not compile them.
- **Database Migrations:** - Stored in `backend/migrations/`.
    - To generate: `pnpm migration:generate --name=<NameOfMigration>` (requires `--name=` flag, generated via `scripts/generate-migration.js`).
    - To run: `pnpm migration:run`.
- **DB Sync:** `synchronize: true` is enabled in development via `data-source.js`.
- **Environment Setup:** Copy `backend/.env-sample` to `backend/.env`. Backend runs on port 3000 by default. Required variables:
    - `DB_HOST`: Database host (default: localhost)
    - `DB_PORT`: Database port (default: 5432)
    - `DB_USERNAME`: Database username
    - `DB_PASSWORD`: Database password
    - `DB_NAME` / `DB_DATABASE`: Database name
    - `JWT_SECRET`: JWT signing secret
    - `JWT_EXPIRES_IN`: JWT expiration time (default: 7d)
    - `NODE_ENV`: Environment mode (development/production)
- **Config:** `backend/src/config.json` contains auth (JWT) and cryptography settings.
- **Structure:**
    - `src/entities/` - TypeORM EntitySchema definitions
    - `src/controllers/` - Request handlers
    - `src/routes/` - Route definitions (Follow RESTful conventions)
    - `src/middlewares/` - Custom middleware
    - `src/services/` - Business logic
    - `src/repositories/` - Database interaction logic
    - `src/utils/` - Utility functions

## 🎨 4. Frontend Directives & Specifics
- **Entry point:** `frontend/src/main.jsx`.
- **React Compiler:** The Vite config uses the React Compiler (`babel-plugin-react-compiler`). You do not need to manually optimize with `useMemo` or `useCallback` unless specifically instructed.
- **Styling:** Tailwind CSS 4 (Vite plugin). Uses `@tailwindcss/vite`. Avoid assuming a traditional v3 setup, even though a legacy `tailwind.config.js` exists.
- **State Management:** Use Redux Toolkit (`@reduxjs/toolkit`) for global state, located in `frontend/src/store/`.
- **API Integration:** Uses fetch/axios with Redux Toolkit for state management.
- **Structure:**
    - `src/components/` - Reusable components
    - `src/pages/` - Page components
    - `src/store/` - Redux Toolkit store and slices
    - `src/hooks/` - Custom hooks
    - `src/services/` - API service calls
    - `src/utils/` - Utility functions
    - `src/router.jsx` - React Router configuration

## 📦 5. Shared Workspace (@micasa/shared)
- **Purpose:** Single source of truth for validation logic. All shared validation logic must be placed here.
- **Implementation:** Centralized Zod schemas in `shared/validations/` (e.g., `user.schema.js`).
- **Imports:** Import cross-workspace modules using subpath exports to optimize bundle size.
    - *Example:* `import { ... } from "@micasa/shared/validations/user.schema.js"`
- **Structure:**
    - `validations/` - Zod validation schemas
    - `utils/` - Shared utility functions

## 💻 6. Essential Commands (Root Level)
*Note: You are operating in an Arch Linux environment using the `fish` shell. Format your command suggestions accordingly.*
- `pnpm dev:backend`: Starts backend in dev mode (nodemon).
- `pnpm dev:frontend`: Starts frontend in dev mode (vite).
- `pnpm migration:generate`: Generates a new TypeORM migration.
- `pnpm migration:run`: Runs pending migrations.
- `pnpm build:backend`: Builds the backend for production.
- `pnpm build:frontend`: Builds the frontend for production.
- `pnpm lint`: Runs ESLint 9 (Flat Config) across the monorepo.
- `pnpm test`: Runs tests (if configured).

## 🔄 7. Development Workflow
1. **Schema changes**:
    - Update `EntitySchema` in `backend/src/entities/`
    - Run `pnpm migration:generate -- --name=<name>`
    - Run `pnpm migration:run` to apply changes
2. **Validation**:
    - Always check `shared/validations/` before adding new input validation logic.
    - Update schemas as needed for new validation requirements.
3. **Order**: `lint -> typecheck -> test` (when applicable)
4. **Feature Development**:
    - Create new branch for each feature
    - Implement feature in isolation
    - Run linting and type checking
    - Write tests (if applicable)
    - Merge to main branch after review
5. **Database Changes**:
    - Generate migration with descriptive name
    - Review migration file for correctness
    - Test migration locally before deployment

## 📌 8. Key Conventions & Git Workflow
- **Git Branch Naming:** `feature/<description>`, `bugfix/<description>`, `hotfix/<description>`
- **Commits:** Messages follow conventional commits format.
- **PRs:** Pull requests require code review before merging. CI/CD pipeline runs linting and type checking on PRs.
- **Testing:** No test framework configured currently (scripts return error).