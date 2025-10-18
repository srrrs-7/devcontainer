# Project Overview

## Purpose
This is a task management monorepo application that provides both a web frontend and REST API backend for managing tasks.

## Tech Stack

### Core Technologies
- **Package Manager**: Bun 1.3.0 (NOT npm/yarn/pnpm)
- **Language**: TypeScript
- **Monorepo**: Bun workspaces

### Frontend (apps/web)
- **Framework**: React 19
- **Server**: Bun.serve() with native HMR (Hot Module Replacement)
- **Bundler**: Bun native bundler (no Vite/Webpack)
- **Port**: 3000
- **Entry**: `apps/web/src/index.tsx` serves `index.html`

### Backend (apps/api)
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Node.js with @hono/node-server
- **Port**: 8080
- **Entry**: `apps/api/src/index.ts`
- **Testing**: Vitest
- **Validation**: Zod with @hono/zod-validator
- **Error Handling**: neverthrow library (Result-based, no exceptions)

### Database (packages/db)
- **ORM**: Prisma 6.16.x
- **Database**: PostgreSQL
- **Adapter**: @prisma/adapter-pg for connection pooling
- **Schema**: `packages/db/prisma/schema.prisma`
- **Generated Client**: `packages/db/src/generated/prisma/`
- **Current Model**: Tasks table with composite PK (userId, taskId)
  - TaskStatus enum: PENDING, IN_PROGRESS, COMPLETED
  - Fields: userId, taskId, content, status, completedAt, createdAt, updatedAt

### Logging (packages/logger)
- **Library**: Pino
- **Features**: Request ID tracking via AsyncLocalStorage
- **Usage**: `runWithRequestId(requestId, async () => { ... })`
- **Config**: LOG_LEVEL environment variable (default: "info")

### Development Tools
- **Linting/Formatting**: Biome
- **Spell Check**: cspell
- **Git Hooks**: husky
- **CI/CD**: GitHub Actions with devcontainer

## Project Structure

```
/workspace/main/
├── apps/
│   ├── web/          # React 19 frontend (Bun.serve)
│   │   └── src/index.tsx
│   └── api/          # Hono API backend
│       └── src/
│           ├── index.ts
│           └── routes/task/  # CRUD routes (get, post, put, delete, list)
├── packages/
│   ├── db/           # Prisma ORM package
│   │   ├── prisma/schema.prisma
│   │   └── src/index.ts (exports getPrisma())
│   └── logger/       # Pino logging package
│       └── src/index.ts
├── biome.jsonc       # Linter/formatter config
├── cspell.config.yaml
├── compose.yaml      # Docker compose for web + api
└── CLAUDE.md         # Claude Code instructions
```

## Key Architecture Patterns

### API Route Organization
- Routes modularized by feature in `apps/api/src/routes/`
- Each route file exports a Hono instance
- Routes composed in `index.ts` using `.route()` method
- Test files co-located with route files (e.g., `get.ts` and `get.test.ts`)

### Database Access
- Use `getPrisma()` function from `@packages/db`
- Returns configured PrismaClient with logging integration
- Database URL built from environment variables (not .env directly)

### Testing
- API uses Vitest with transactional rollback (`@chax-at/transactional-prisma-testing`)
- Setup file: `apps/api/__test__/setup.ts` mocks `@packages/db`
- Tests run with `LOG_LEVEL=silent`

### Environment Variables
- Database package uses `.env.db` loaded via dotenvx
- Required: DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DBNAME
- Bun automatically loads `.env` files (no dotenv package needed)
