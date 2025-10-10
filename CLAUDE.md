# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo using **Bun workspaces** and **Turborepo** for task orchestration. The project includes:
- **API app** (`apps/api`): Hono web framework on Node.js
- **Database package** (`packages/db`): Prisma ORM with PostgreSQL adapter
- **Logger package** (`packages/logger`): Pino-based logging with request ID tracking via AsyncLocalStorage

## Package Manager & Workspaces

- Uses **Bun** (version 1.1.38) - **ALWAYS use `bun` or `bunx` commands, NEVER `npm`, `yarn`, `pnpm`, or `npx`**
- Workspace packages are linked using `workspace:*` protocol
- Root workspace defines common dev tools (Biome, cspell, husky, turbo)

## Common Commands

### Development
```bash
# Start API dev server (from root)
bun --filter api dev

# Start API dev server (from apps/api)
bun dev
```

### Building
```bash
# Build all packages (orchestrated by Turborepo)
bunx turbo run build

# Build specific package
bun --filter api build
```

### Code Quality
```bash
# Run all checks (type, biome, spell)
bun check

# Format code with Biome
bun format

# Check code style with Biome
bun check:biome

# Fix code style issues
bun fix:biome

# Spell check
bun check:spell
```

### Database Management

Database commands must be run from the `packages/db` directory or using Turborepo:

```bash
# Generate Prisma client (after schema changes)
bunx turbo run db:generate
# or from packages/db:
bun db:generate

# Create and apply migration in development
bunx turbo run db:migrate:dev
# or from packages/db:
bun db:migrate:dev

# Apply migrations in production (no schema changes)
bunx turbo run db:migrate:deploy

# Reset database (WARNING: destructive)
bunx turbo run db:migrate:reset

# Open Prisma Studio GUI
bunx turbo run db:studio
# or from packages/db:
bun db:studio

# Run any Prisma command
# From packages/db:
bun prisma [command]
```

**Important**: Database commands in `packages/db` use `dotenvx` to load `.env.db` file for database credentials. Required environment variables:
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_DBNAME`

### Testing
```bash
# Run tests in watch mode
bunx turbo run test

# Run tests once
bunx turbo run test:run
```

## Architecture

### Monorepo Structure
- **apps/**: Application packages (api)
- **packages/**: Shared packages (db, logger)
- Root-level tools: Biome (linting/formatting), cspell (spell checking), husky (git hooks), Turborepo (task runner)

### Database Package (`@packages/db`)
- Prisma schema: `packages/db/prisma/schema.prisma`
- Generated client: `packages/db/src/generated/prisma/` (ignored by Biome)
- Main export: `getPrisma()` function returns configured PrismaClient instance
- Uses `@prisma/adapter-pg` for PostgreSQL connection pooling
- Prisma events are logged via `@packages/logger` (query, info, warn, error)
- Database URL constructed from environment variables (not from `.env` file directly)

### Logger Package (`@packages/logger`)
- Built on Pino logger
- **Request ID tracking**: Uses Node.js AsyncLocalStorage to automatically attach `requestId` to all logs within a request context
- Usage: Call `runWithRequestId(requestId, async () => { ... })` to set context
- Log level controlled by `LOG_LEVEL` environment variable (default: "info")

### API App (`apps/api`)
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Node.js with `@hono/node-server`
- **Port**: 3000
- TypeScript compiled with `tsc`, development uses `bun --watch`
- Uses `neverthrow` library for Result-based error handling

## Important Conventions

### Code Style
- **Indentation**: Space (configured in biome.jsonc)
- Biome ignores `**/src/generated` and `**/prisma/migrations`
- Import organization enabled (Biome auto-organizes imports)
- Floating promises must be handled (Biome nursery rule enforced)

### Environment Files
- Database package uses `.env.db` file (loaded via dotenvx)
- Environment variables are passed to Turborepo tasks via `env` config in turbo.jsonc

### Generated Code
- **Never edit** files in `packages/db/src/generated/prisma/` - regenerate with `bun db:generate`
- Prisma client is generated to custom output directory (not default node_modules)

### Prisma Workflow
1. Edit `packages/db/prisma/schema.prisma`
2. Run `bun db:migrate:dev` (creates migration + regenerates client)
3. Or run `bun db:generate` (just regenerates client without migration)

## Docker
- `compose.yaml` defines services: web, api
- Docker configuration is minimal/incomplete (no Dockerfiles specified)
