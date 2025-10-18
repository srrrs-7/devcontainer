# Task Completion Checklist

When you complete a development task, follow these steps to ensure code quality:

## 1. Code Quality Checks

### Run All Checks
```bash
bun check
```

This runs:
- Spell checking (cspell)
- Type checking (tsc --noEmit on all workspaces)
- Biome linting and formatting

### Or Run Individual Checks

#### Type Check
```bash
bun check:type
```

#### Format Code
```bash
bun format
```

#### Lint and Fix
```bash
bun check:biome
```

#### Spell Check
```bash
bun check:spell
```

## 2. Testing

### Run Tests
```bash
# API tests
bun run test:run

# Or in watch mode during development
bun run test:watch
```

### Write Tests If:
- Adding new API routes
- Modifying existing route logic
- Adding business logic functions
- **Pattern**: Co-locate test files with source files

## 3. Database Changes

### If Schema Changed
```bash
# Create migration and regenerate client
bun db:migrate:dev

# Or just regenerate client (no migration)
bun db:generate
```

### Verify
- Check migration files in `packages/db/prisma/migrations/`
- Ensure generated code in `packages/db/src/generated/prisma/` is updated
- **NEVER manually edit generated code**

## 4. Build Verification (Optional)

```bash
# Build all workspaces to catch build-time errors
bun build:ws
```

## 5. Git Workflow

### Before Committing
1. Ensure all checks pass: `bun check`
2. Ensure tests pass: `bun run test:run`
3. Review your changes: `git diff`

### Husky Hooks
- Pre-commit hooks are configured via husky
- Hooks run automatically on `git commit`
- Fix any issues raised by hooks before committing

## 6. CI/CD Awareness

### What CI Runs
The GitHub Actions CI pipeline (`.github/workflows/ci.yml`) runs:
1. `bun check` - All code quality checks
2. `bun build:ws` - Build all workspaces
3. `bun test` - Run all tests

**Ensure your changes pass locally before pushing** to avoid CI failures.

## Common Gotchas

### Prisma
- Always regenerate Prisma client after schema changes
- Run migrations in dev: `bun db:migrate:dev`

### Floating Promises
- Biome enforces no floating promises (error level)
- Always await or explicitly handle promises
- Use `.catch()` or assign to variable if intentionally not awaiting

### Bun Commands
- NEVER use npm/yarn/pnpm commands
- Always use `bun` or `bunx`

### Import Organization
- Biome auto-organizes imports
- Run `bun format` to fix import order

## Quick Checklist

- [ ] Code formatted: `bun format`
- [ ] Linting passes: `bun check:biome`
- [ ] Types correct: `bun check:type`
- [ ] Spelling correct: `bun check:spell`
- [ ] Tests pass: `bun run test:run`
- [ ] Tests written for new features
- [ ] Prisma client regenerated (if schema changed)
- [ ] No floating promises
- [ ] Using Bun commands only
