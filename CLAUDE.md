# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Code Analysis and Editing Tools

**MANDATORY**: When Claude Code performs ANY code analysis, exploration, or editing tasks in this repository, it **MUST use Serena MCP tools**. This is non-negotiable.

### Why Serena MCP is Required

- **Token efficiency**: Serena tools allow reading and editing code at the symbol level (classes, methods, functions) instead of reading entire files
- **Precise operations**: Symbol-based editing is more accurate and less error-prone than line-based edits
- **Better understanding**: Overview and symbol search tools provide structured information about code architecture
- **Never read entire files first**: Always start with `mcp__serena__get_symbols_overview` or `mcp__serena__find_symbol` before reading full files

### Serena MCP Workflow

1. **Exploring code**: Use `mcp__serena__get_symbols_overview` to understand file structure, then `mcp__serena__find_symbol` to read specific symbols
2. **Finding code**: Use `mcp__serena__find_symbol` with name paths (e.g., "ClassName/methodName") and substring matching
3. **Understanding relationships**: Use `mcp__serena__find_referencing_symbols` to see where code is used
4. **Pattern search**: Use `mcp__serena__search_for_pattern` for regex-based searches across the codebase
5. **Editing code**: Use `mcp__serena__replace_symbol_body`, `mcp__serena__insert_after_symbol`, or `mcp__serena__insert_before_symbol` for precise modifications

### Thinking Mode

**Use `ultrathink` mode** when analyzing complex architectural questions, planning multi-step changes, or reasoning about code relationships. This enables deeper analysis before taking action.

## Project Overview

This is a monorepo using **Bun workspaces** with native Bun features for task orchestration. The project includes:
- **Web app** (`apps/web`): React 19 with Bun native server (HMR, HTML imports)
- **API app** (`apps/api`): Hono web framework on Node.js
- **Database package** (`packages/db`): Prisma ORM with PostgreSQL adapter
- **Logger package** (`packages/logger`): Pino-based logging with request ID tracking via AsyncLocalStorage

## Package Manager & Workspaces

- Uses **Bun** (version 1.3.0) - **ALWAYS use `bun` or `bunx` commands, NEVER `npm`, `yarn`, `pnpm`, or `npx`**
- Workspace packages are linked using `workspace:*` protocol
- Root workspace defines common dev tools (Biome, cspell, husky)
- Uses Bun's built-in `--filter` and `--workspaces` flags for monorepo management
- Bun automatically loads `.env` files - no need for dotenv package

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

**Build Process Notes**:
- The root `build` script runs: `clean` → `db:generate` → `build:ws` (builds all workspace packages)
- **Always regenerate Prisma client** before building if schema changed (happens automatically with root `build` script)
- Logger and DB packages have no build step (TypeScript source used directly)

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
# Run API tests once (using Vitest)
bun run test:run
# or from apps/api:
bun test

# Run API tests in watch mode
bun run test:watch
# or from apps/api:
bun test:watch

# Run specific test file
cd apps/api && bun test src/routes/task/get.test.ts

# Run tests matching a pattern
cd apps/api && bun test -t "pattern"
```

**API Testing Setup**:
- Uses **Vitest** (not Bun's native test runner) for API tests
- **Database test isolation**: Uses `@chax-at/transactional-prisma-testing` to wrap each test in a transaction that rolls back
- **Setup file**: `apps/api/__test__/setup.ts` configures test environment and mocks `@packages/db` to use transactional Prisma client
- **Test pattern**: Route test files are co-located with route files (e.g., `get.ts` and `get.test.ts` in same directory)
- Tests run with `LOG_LEVEL=silent` to reduce noise (configured in `vitest.config.ts`)

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
- **Entry Point**: `apps/web/src/index.tsx` serves `index.html` which imports frontend React code
- **Features**:
  - HTML imports for .tsx/.jsx/.css files (import directly in `<script>` tags)
  - Built-in API routing via Bun.serve routes object (see `index.tsx` for examples)
  - Development mode with browser console logging (`console: true`)
  - TypeScript support without compilation step
  - Hot reloading with `--hot` flag in dev mode

### Database Package (`@packages/db`)
- **Prisma schema**: `packages/db/prisma/schema.prisma`
- **Generated client**: `packages/db/src/generated/prisma/` (ignored by Biome)
- **Main export**: `getPrisma()` function returns configured PrismaClient instance
- **Adapter**: Uses `@prisma/adapter-pg` for PostgreSQL connection pooling
- **Logging**: Prisma events (query, info, warn, error) are logged via `@packages/logger`
- **Connection**: Database URL constructed from environment variables (not from `.env` file directly)
- **Data Model**: Currently defines `Tasks` model with composite primary key on `userId` and `taskId`

### Logger Package (`@packages/logger`)
- Built on Pino logger
- **Request ID tracking**: Uses Node.js AsyncLocalStorage to automatically attach `requestId` to all logs within a request context
- Usage: Call `runWithRequestId(requestId, async () => { ... })` to set context
- Log level controlled by `LOG_LEVEL` environment variable (default: "info")

### API App (`apps/api`)
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Node.js with `@hono/node-server`
- **Port**: 8080
- **Entry Point**: `apps/api/src/index.ts`
- **Route Organization**: Routes are modularized by feature in `apps/api/src/routes/` directory
  - Each route file exports a Hono instance with specific route handlers
  - Routes are composed in `index.ts` using `.route()` method
  - Example structure: `routes/task/` contains CRUD operations (get.ts, post.ts, put.ts, delete.ts, list.ts)
- **Development**: Uses `bun --watch` for auto-reload on file changes
- **Production Build**: TypeScript compiled with `tsc` to `dist/` directory, run with `node dist/index.js`
- **Error Handling**: Uses `neverthrow` library for Result-based error handling (avoids throwing exceptions)
- **Validation**: Uses `@hono/zod-validator` with Zod schemas for request validation

## Important Conventions

### Code Style
- **Indentation**: Space (configured in biome.jsonc)
- Biome ignores `**/src/generated` and `**/prisma/migrations`
- Import organization enabled (Biome auto-organizes imports)
- Floating promises must be handled (Biome nursery rule enforced)
- **Spell checking**: Custom words defined in `cspell.config.yaml` (includes project-specific terms like "bunx", "dotenvx", "neverthrow")

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
- `compose.yaml` defines both web and api services
- Web service: `apps/web/.images/Dockerfile`, exposed on port 3000
- API service: `apps/api/.images/Dockerfile`, exposed on port 8080
- Run with: `docker compose up` or `docker compose up -d` for detached mode
