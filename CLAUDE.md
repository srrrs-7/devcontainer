# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo using **Bun workspaces** with native Bun features for task orchestration. The project includes:
- **Web app** (`apps/web`): React 19 with Bun native server (HMR, HTML imports)
- **API app** (`apps/api`): Hono web framework on Node.js
- **Database package** (`packages/db`): Prisma ORM with PostgreSQL adapter
- **Logger package** (`packages/logger`): Pino-based logging with request ID tracking via AsyncLocalStorage

## Package Manager & Workspaces

- Uses **Bun** (version 1.1.38) - **ALWAYS use `bun` or `bunx` commands, NEVER `npm`, `yarn`, `pnpm`, or `npx`**
- Workspace packages are linked using `workspace:*` protocol
- Root workspace defines common dev tools (Biome, cspell, husky)
- Uses Bun's built-in `--filter` and `--workspaces` flags for monorepo management

### Bun Workspace Features

- **`--filter <pattern>`**: Run scripts in specific workspaces matching a pattern
  - Example: `bun --filter api dev` runs dev script only in api package
  - Supports glob patterns: `bun --filter "pkg-*" build`
- **`--workspaces`**: Run scripts across all workspace packages
  - Example: `bun run --workspaces test` runs test in all packages
- **Fast installation**: Bun installs dependencies significantly faster than npm/yarn
- **Built-in test runner**: Use `bun test` for fast, native testing (no Vitest needed)
- **TypeScript support**: Direct execution of .ts files without compilation

## Common Commands

### Development
```bash
# Start Web dev server (from root) - default
bun dev
# or explicitly:
bun dev:web

# Start API dev server
bun dev:api

# Start all dev servers (web + api) in parallel
bun run dev:all

# Start from subdirectories
cd apps/web && bun dev    # Web dev server
cd apps/api && bun dev    # API dev server
```

### Building
```bash
# Build all packages (clean, generate Prisma client, then build all workspaces)
bun run build

# Build specific package
bun run build:web    # Web app
bun run build:api    # API app
# or using filter:
bun --filter web build
bun --filter api build

# Clean build artifacts
bun run clean           # Clean all workspaces
bun run clean:web       # Clean web app only
bun run clean:api       # Clean api app only
```

### Production Start
```bash
# Start Web in production mode
bun start:web

# Start API in production mode
bun start:api
```

### Code Quality
```bash
# Run all checks (type check all workspaces, biome, spell)
bun check

# Type check all workspaces
bun run check:type:ws

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

Database commands can be run from root using Bun's `--filter` flag:

```bash
# Generate Prisma client (after schema changes)
bun run db:generate
# or from packages/db:
bun db:generate

# Create and apply migration in development
bun run db:migrate:dev
# or from packages/db:
bun db:migrate:dev

# Apply migrations in production (no schema changes)
bun run db:migrate:deploy

# Reset database (WARNING: destructive)
bun run db:migrate:reset

# Open Prisma Studio GUI
bun run db:studio
# or from packages/db:
bun db:studio

# Seed database with initial data
bun run db:seed

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
# Run tests in watch mode (using Bun's test runner)
bun test

# Run tests once
bun run test:run

# Run tests across all workspaces
bun run test:ws
```

## Architecture

### Monorepo Structure
- **apps/**: Application packages (web, api)
- **packages/**: Shared packages (db, logger)
- Root-level tools: Biome (linting/formatting), cspell (spell checking), husky (git hooks)
- Task orchestration: Bun's native `--filter` and `--workspaces` flags

### Web App (`apps/web`)
- **Framework**: React 19
- **Server**: Bun.serve() with native HMR (Hot Module Replacement)
- **Port**: 3000 (default)
- **Bundler**: Bun native bundler (no Vite/Webpack needed)
- **Features**:
  - HTML imports for .tsx/.jsx/.css files
  - Built-in API routing via Bun.serve routes
  - Development mode with browser console logging
  - TypeScript support without compilation step

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
- **Port**: 8080
- **Route Organization**: Routes are modularized in `apps/api/src/routes/` directory
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

### Generated Code
- **Never edit** files in `packages/db/src/generated/prisma/` - regenerate with `bun db:generate`
- Prisma client is generated to custom output directory (not default node_modules)

### Prisma Workflow
1. Edit `packages/db/prisma/schema.prisma`
2. Run `bun db:migrate:dev` (creates migration + regenerates client)
3. Or run `bun db:generate` (just regenerates client without migration)

## Docker
- `compose.yaml` defines API service (web service is commented out)
- API service references `apps/api/.images/Dockerfile`
- Docker configuration may be incomplete
