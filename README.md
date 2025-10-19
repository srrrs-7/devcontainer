# Bun Monorepo Starter

A modern, production-ready monorepo powered by Bun, featuring a React 19 web app and Hono API server with PostgreSQL database. Built with developer experience in mind, including devcontainer support, Claude Code extensions, and comprehensive tooling.

## ✨ Features

- **⚡ Lightning Fast**: Bun for package management, testing, and web server with Hot Module Replacement
- **🎯 Type-Safe**: Full TypeScript support with strict mode across all packages
- **🏗️ Clean Architecture**: Layered architecture with clear separation of concerns (Routes → Service → Repository → Domain)
- **🔐 Secure by Default**: Result-based error handling with neverthrow, Zod validation, transactional tests
- **🎨 Modern Stack**: React 19, Hono, Prisma, PostgreSQL, Biome, Vitest
- **🐳 Container Ready**: DevContainer and Docker Compose configurations included
- **🤖 AI-Powered**: Custom Claude Code extensions (Skills, Slash Commands, Agents, Hooks)
- **📊 Observable**: Pino logging with AsyncLocalStorage for request ID tracking

## Quick Start

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Set up environment:**
   ```bash
   cp .devcontainer/compose.override.yaml.sample compose.override.yaml
   ```

3. **Start database and run migrations:**
   ```bash
   docker compose up -d
   bun run db:migrate:dev
   ```

4. **Start development servers:**
   ```bash
   # Web app (http://localhost:3000)
   bun dev

   # API server (http://localhost:8080)
   bun dev:api

   # Or start both
   bun run dev:all
   ```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.3.0 or later
- [Docker](https://www.docker.com/) and Docker Compose (for database)
- Node.js (for API runtime)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd play-devcontainer
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create `compose.override.yaml` from the sample file:
   ```bash
   cp .devcontainer/compose.override.yaml.sample compose.override.yaml
   ```

   Edit `compose.override.yaml` to configure your database credentials if needed.

4. **Start the database**
   ```bash
   docker compose up -d
   ```

5. **Set up the database schema**
   ```bash
   bun run db:migrate:dev
   ```

### Running the Application

#### Development Mode

**Start Web app (default):**
```bash
bun dev
# or explicitly
bun dev:web
```
The web app will be available at http://localhost:3000

**Start API server:**
```bash
bun dev:api
```
The API will be available at http://localhost:8080

**Start both Web and API servers:**
```bash
bun run dev:all
```

#### Production Mode

**Build all workspaces:**
```bash
bun build:ws
```

**Start in production:**
```bash
# Web app
bun start:web

# API server
bun start:api
```

## Project Structure

This is a Bun workspace monorepo with the following structure:

```
.
├── apps/
│   ├── web/          # React 19 web app with Bun native server
│   └── api/          # Hono API server on Node.js
├── packages/
│   ├── db/           # Prisma ORM with PostgreSQL
│   └── logger/       # Pino-based logging with request ID tracking
└── compose.yaml      # Docker Compose for PostgreSQL database
```

### Tech Stack

- **Package Manager:** Bun v1.3.0
- **Web Framework:** React 19 with Bun.serve() (HMR, HTML imports)
- **API Framework:** Hono with @hono/node-server
- **Database:** PostgreSQL with Prisma ORM
- **Logging:** Pino with AsyncLocalStorage for request tracking
- **Code Quality:** Biome (linting/formatting), cspell (spell checking)
- **Testing:** Vitest with transactional test isolation

## Available Commands

### Development
```bash
bun dev              # Start web dev server (default)
bun dev:api          # Start API dev server
bun dev:web          # Start web dev server
bun run dev:all      # Start both web and API servers
```

### Building
```bash
bun build:ws         # Build all workspaces
bun run build:web    # Build web app only
bun run build:api    # Build API app only
bun run clean        # Clean all workspaces
bun run clean:web    # Clean web app only
bun run clean:api    # Clean API app only
```

### Database Management
```bash
bun run db:generate        # Generate Prisma client (after schema changes)
bun run db:migrate:dev     # Create and apply migration in development
bun run db:migrate:deploy  # Apply migrations in production
bun run db:migrate:reset   # Reset database (WARNING: destructive)
bun run db:studio          # Open Prisma Studio GUI
bun run db:seed            # Seed database with initial data
```

**Important:** Database commands use `dotenvx` to load `.env.db` file. Required environment variables:
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_DBNAME`

### Code Quality
```bash
bun check            # Run all checks (type check, biome, spell)
bun check:type       # Type check all workspaces
bun format           # Format code with Biome
bun check:biome      # Check and fix code style with Biome
bun check:spell      # Spell check
```

### Testing
```bash
bun run test:run     # Run API tests once
bun run test:watch   # Run API tests in watch mode
```

**Note:** API tests use Vitest with `@chax-at/transactional-prisma-testing` for database test isolation. Each test runs in a transaction that rolls back automatically.

## Development

### Bun Workspace Features

- **`--filter <pattern>`**: Run scripts in specific workspaces
  ```bash
  bun --filter api dev
  bun --filter "pkg-*" build
  ```
- **`--workspaces`**: Run scripts across all workspace packages
  ```bash
  bun run --workspaces test
  ```

### Code Style

- **Indentation:** Spaces (configured in biome.jsonc)
- **Import organization:** Enabled (Biome auto-organizes imports)
- **Floating promises:** Must be handled (enforced by Biome)
- **Generated code:** Never edit files in `packages/db/src/generated/prisma/`

### Prisma Workflow

1. Edit `packages/db/prisma/schema.prisma`
2. Run `bun db:migrate:dev` (creates migration + regenerates client)
3. Or run `bun db:generate` (just regenerates client without migration)

## Docker

The project includes Docker Compose configuration for both development and production:

- **Web service:** Built from `apps/web/.images/Dockerfile`, exposed on port 3000
- **API service:** Built from `apps/api/.images/Dockerfile`, exposed on port 8080
- **Database service:** PostgreSQL 15, exposed on port 5432

Run with:
```bash
docker compose up       # Start services
docker compose up -d    # Start in detached mode
docker compose down     # Stop services
```

## Architecture

### Layered Architecture (API)

The API follows clean architecture principles with clear separation of concerns:

```
apps/api/src/
├── routes/         → HTTP handlers (request/response)
│   └── task/       → Task-related endpoints with co-located tests
├── service/        → Business logic layer
│   └── task/       → Task business operations (get, post, put, delete, list)
├── infra/rds/      → Data access layer (repositories)
│   └── task/       → Prisma-based task repository
└── domain/         → Domain models and errors
    ├── model/      → Domain entities (Task)
    └── error.ts    → Error hierarchy (AppError, NotFoundError, DatabaseError)
```

**Data Flow:**
```
HTTP Request → Route Handler → Service → Repository → Prisma → Database
                   ↓              ↓          ↓
             Validation    Business      Data
                          Logic        Access
```

**Key Principles:**
- **Routes**: Handle HTTP concerns only (validation, request/response mapping)
- **Service**: Pure business logic, returns `Result<T, AppError>` (no exceptions)
- **Repository**: Database operations, error transformation
- **Domain**: Business entities and error types

### Web App Architecture

- **Framework**: React 19 with Bun.serve()
- **Bundler**: Bun native bundler (no Vite/Webpack)
- **Features**: HTML imports, HMR, built-in API routing
- **Port**: 3000 (development)

### Database Package

- **ORM**: Prisma with PostgreSQL adapter
- **Connection**: @prisma/adapter-pg for connection pooling
- **Schema**: `packages/db/prisma/schema.prisma`
- **Client**: Auto-generated to `packages/db/src/generated/prisma/`
- **Logging**: All Prisma events logged via @packages/logger

### Logger Package

- **Framework**: Pino (high-performance JSON logger)
- **Request Tracking**: AsyncLocalStorage for automatic `requestId` attachment
- **Usage**: `runWithRequestId(requestId, async () => { ... })`
- **Configuration**: `LOG_LEVEL` environment variable

## DevContainer Development

This project includes a complete DevContainer setup for VS Code and GitHub Codespaces:

### Features

- **Pre-configured environment**: Bun, Node.js, Git, GitHub CLI
- **Database included**: PostgreSQL 15 with health checks
- **Auto port forwarding**: Web (3000), API (8080), PostgreSQL (5432), Prisma Studio (5555)
- **VS Code extensions**: Biome, Prisma, Spell Checker, Vitest Explorer
- **Serena MCP**: Code analysis and editing at symbol level

### Setup

1. Copy the sample environment file:
   ```bash
   cp .devcontainer/compose.override.yaml.sample .devcontainer/compose.override.yaml
   ```

2. Open in VS Code:
   - Install "Dev Containers" extension
   - Command: "Dev Containers: Reopen in Container"

3. The container automatically runs:
   - `bun install`
   - `bun db:generate`
   - `bun db:migrate:deploy`

### Configuration

- **devcontainer.json**: Container configuration and VS Code settings
- **compose.yaml**: Database and development container services
- **compose.override.yaml**: Database credentials (gitignored)

## Git Worktree Workflow

This project supports parallel development using git worktrees via Makefile commands:

### Commands

```bash
make wt      # Create new worktree at ../wt_1 from origin/main
make wt-d    # Delete worktree
make wt-l    # List all worktrees and branches
make cp      # Copy devcontainer compose override sample
```

### Worktree Creation Process

When you run `make wt`, it automatically:

1. Creates git worktree at `../wt_1` from `origin/main`
2. Changes ownership to `vscode:vscode` for devcontainer compatibility
3. Installs dependencies (`bun ci`)
4. Generates Prisma client (`bun run db:generate`)
5. Applies database migrations (`bun run db:migrate:deploy`)
6. Runs all checks (`bun run check`)
7. Runs tests (`bun run test:run`)
8. Configures Serena MCP server if not already configured
9. Lists all worktrees and branches

### Use Cases

- Work on multiple features simultaneously in separate directories
- Test changes in isolation without affecting main working directory
- Code review with actual code execution in separate environment

## Claude Code Extensions

This repository includes custom extensions for [Claude Code](https://claude.ai/code):

### Skills (`.claude/skills/`)

Reusable prompt templates for common tasks. Invoke with the Skill tool.

**Available:**
- **`database`**: Database schema design and Prisma migrations expert
- **`notice`**: Terminal notification system for task feedback

### Slash Commands (`.claude/commands/`)

Workflow automations. Use SlashCommand tool or type `/command-name`.

**Available:**
- `/speckit.specify` - Create/update feature specifications
- `/speckit.plan` - Execute implementation planning workflow
- `/speckit.tasks` - Generate actionable, dependency-ordered tasks
- `/speckit.clarify` - Identify underspecified areas
- `/speckit.implement` - Execute implementation plan
- `/speckit.checklist` - Generate custom checklist
- `/speckit.analyze` - Cross-artifact consistency analysis
- `/speckit.constitution` - Create/update project constitution

### Agents (`.claude/agents/`)

Specialized agents for specific domains. Launched via Task tool.

**Available:**
- **`bun-runtime-specialist`**: Bun configurations and troubleshooting
- **`pjt-security-code-reviewer`**: Code quality and security review
- **`github-spec-kit-architect`**: Agent specification design

**Events:**
- **PostToolUse**: After Edit/Write/Bash/Task execution
- **Stop**: When Claude completes a response
- **Notification**: When user approval needed

**Logs:** `~/.claude/notifications.log`

## CI/CD

GitHub Actions workflow runs on push to main and pull requests:

- Uses devcontainer for consistent build environment
- Runs checks (lint, spell, type check)
- Builds all workspaces
- Runs tests
- Caches devcontainer image to GitHub Container Registry

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   docker compose ps
   ```

2. Check database credentials in `compose.override.yaml`

3. Ensure environment variables are loaded:
   ```bash
   # In packages/db directory
   cat .env.db
   ```

### Prisma Client Issues

If you see "Cannot find module '@prisma/client'" errors:

```bash
bun run db:generate
```

### Build Failures

If builds fail with type errors:

1. Clean and rebuild:
   ```bash
   bun run clean
   bun build:ws
   ```

2. Check TypeScript version consistency across packages

### Test Failures

If tests fail with database errors:

1. Ensure migrations are applied:
   ```bash
   bun run db:migrate:deploy
   ```

2. Check test database isolation (should use transactional rollback)

### Bun Issues

If Bun commands fail:

1. Verify Bun version:
   ```bash
   bun --version  # Should be 1.3.0 or later
   ```

2. Clear Bun cache:
   ```bash
   rm -rf node_modules
   bun install
   ```

## Contributing

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Run checks: `bun check`
5. Run tests: `bun run test:run`
6. Commit with descriptive messages
7. Push and create a pull request

## Documentation

- **CLAUDE.md**: Comprehensive guide for Claude Code integration and development workflow
- **API Documentation**: See `apps/api/README.md` (if available)
- **Database Schema**: See `packages/db/prisma/schema.prisma`

## License

MIT
