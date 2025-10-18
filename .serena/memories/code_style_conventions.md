# Code Style and Conventions

## Formatting and Linting

### Biome Configuration
- **Tool**: Biome (NOT ESLint/Prettier)
- **Config**: `biome.jsonc`
- **Indentation**: Spaces (space indentation preferred for code generation)
- **Import Organization**: Auto-organize enabled
- **VCS Integration**: Git-aware, uses .gitignore

### Ignored Paths
- `**/src/generated` (Prisma generated code)
- `**/prisma/migrations`

### Rules
- Recommended rules enabled
- **No Floating Promises**: Error level (must handle all promises)

## TypeScript

### Type Checking
- TypeScript 5.x used across all packages
- Type check command: `bun check:type`
- Direct execution of .ts files (no compilation needed in dev)

### Naming Conventions
- **Files**: lowercase with hyphens (kebab-case) or camelCase for TS/TSX
- **Exports**: Named exports or default exports (varies by file type)
- **Database fields**: snake_case in database, camelCase in TypeScript (via Prisma @map)

## Error Handling

### API Routes
- **Use neverthrow library**: Result-based error handling
- Avoid throwing exceptions, return `Result<T, E>` types
- Example pattern seen in route files

## Database Conventions

### Prisma Schema
- **Location**: `packages/db/prisma/schema.prisma`
- **Generated Code**: NEVER edit `packages/db/src/generated/prisma/`
- **Field Mapping**: Use `@map()` for database column names (snake_case in DB, camelCase in TS)
- **Table Mapping**: Use `@@map()` for table names

### Schema Workflow
1. Edit `packages/db/prisma/schema.prisma`
2. Run `bun db:migrate:dev` (creates migration + regenerates client)
3. Or run `bun db:generate` (just regenerates client)

## Testing Conventions

### API Tests
- **Co-located**: Test files next to route files (e.g., `get.ts` + `get.test.ts`)
- **Framework**: Vitest (not Bun's native test runner for API)
- **Isolation**: Transactional testing with automatic rollback
- **Setup**: `apps/api/__test__/setup.ts` configures test environment
- **Logging**: Tests run with `LOG_LEVEL=silent`

### Test File Naming
- Pattern: `*.test.ts`
- Located alongside source files

## Package Management

### Workspace Dependencies
- Use `workspace:*` protocol for internal dependencies
- Example: `"@packages/db": "workspace:*"`

### Commands
- **ALWAYS use Bun**: `bun install`, `bun run`, `bun test`
- **NEVER use**: npm, yarn, pnpm, npx

## Spell Checking

### Custom Words (cspell.config.yaml)
Project-specific terms allowed:
- bunx, dotenvx, neverthrow
- chax-at (package name)
- Various project-specific names

### Ignored Paths
- .git, bun.lockb, **/generated, **/prisma/migrations

## Import Organization

Biome automatically organizes imports when formatting.

## Environment Files

- Database: `.env.db` (loaded via dotenvx in packages/db)
- General: `.env` (automatically loaded by Bun)
- **Never commit** `.env` files to git
