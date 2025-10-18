# Suggested Commands

## CRITICAL: Always use Bun, NEVER npm/yarn/pnpm/npx
All commands must use `bun` or `bunx` instead of npm/yarn/pnpm/npx.

## Development

### Start Development Servers
```bash
# Web dev server (default from root)
bun dev
# or explicitly:
bun dev:web

# API dev server
bun dev:api

# Start all dev servers (web + api) in parallel
bun run dev:all

# From subdirectories:
cd apps/web && bun dev    # Web dev server
cd apps/api && bun dev    # API dev server
```

## Testing

```bash
# Run API tests once (from root)
bun run test:run

# Run API tests in watch mode
bun run test:watch

# From apps/api directory:
cd apps/api && bun test                        # Run all tests
cd apps/api && bun test src/routes/task/get.test.ts   # Specific file
cd apps/api && bun test -t "pattern"           # Tests matching pattern
```

## Code Quality

### Run All Checks
```bash
bun check   # Runs: spell check + type check + biome check
```

### Individual Checks
```bash
# Type check all workspaces
bun check:type

# Format code with Biome
bun format

# Check and fix code style with Biome
bun check:biome

# Spell check
bun check:spell
```

## Building

```bash
# Build all workspaces
bun build:ws

# Build specific package
bun run build:web    # Web app
bun run build:api    # API app

# Clean build artifacts
bun run clean        # All workspaces
bun run clean:web    # Web only
bun run clean:api    # API only
```

## Production

```bash
# Start in production mode
bun start:web
bun start:api
```

## Database Management

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

# Seed database
bun run db:seed

# Run any Prisma command (from packages/db):
bun prisma [command]
```

## Docker

```bash
# Start all services
docker compose up

# Start in detached mode
docker compose up -d

# Stop services
docker compose down
```

## System Utilities (Linux)

Standard Linux commands are available:
- `ls`, `cd`, `pwd` - navigation
- `grep`, `find` - searching
- `cat`, `less`, `head`, `tail` - file viewing
- `git` - version control
- `mkdir`, `rm`, `cp`, `mv` - file operations
