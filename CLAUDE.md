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

**Use `ultrathink` mode** when:
- Analyzing complex architectural questions or design decisions
- Planning multi-step changes that affect multiple layers (routes → service → repository → domain)
- Reasoning about code relationships and data flow
- Debugging intricate issues that span multiple files or packages
- Designing new features that require careful consideration of trade-offs

This enables deeper analysis before taking action and helps avoid mistakes in complex scenarios.

## Project Overview

This is a monorepo using **Bun workspaces** with native Bun features for task orchestration. The project includes:
- **Web app** (`apps/web`): React 19 with Bun native server (HMR, HTML imports)
- **API app** (`apps/api`): Hono web framework on Node.js
- **Database package** (`packages/db`): Prisma ORM with PostgreSQL adapter
- **Logger package** (`packages/logger`): Pino-based logging with request ID tracking via AsyncLocalStorage

## Package Manager & Workspaces

- Uses **Bun** (version 1.3.5) - **ALWAYS use `bun` or `bunx` commands, NEVER `npm`, `yarn`, `pnpm`, or `npx`**
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
- **Built-in test runner**: Use `bun test` for fast, native testing
- **TypeScript support**: Direct execution of .ts files without compilation
- **Type checking**: Uses `tsgo` (TypeScript 7 native compiler) - 10x faster than traditional tsc

## Common Commands

### Development
```bash
# Start BOTH web and api dev servers in parallel (from root)
bun dev

# Start only Web dev server
bun dev:web

# Start only API dev server
bun dev:api

# Start from subdirectories (same result as above)
cd apps/web && bun dev    # Web dev server only
cd apps/api && bun dev    # API dev server only
```

### Building
```bash
# Build all workspaces
bun build:ws

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
- Web app build outputs to `apps/web/dist/` directory
- API build compiles TypeScript to `apps/api/dist/` directory
- **Always regenerate Prisma client** before building if schema changed: `bun db:generate`
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
bun check:type

# Format code with Biome
bun format

# Check and fix code style with Biome
bun check:biome

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

# Run any Prisma command directly (from packages/db):
prisma [command]
```

**Database Seeding**:
- Seed script: `packages/db/prisma/seed.ts`
- Automatically creates sample data for Organizations, Clients, Users, Applications, Roles, and Permissions
- Useful for development and testing with realistic data structure
- Run after migrations to populate fresh database

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
cd apps/api && bun test src/routes/v1/tasks/get.test.ts

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
- **Build Output**: `apps/web/dist/` directory
- **Features**:
  - HTML imports for .tsx/.jsx/.css files (import directly in `<script>` tags)
  - Built-in API routing via Bun.serve routes object (see `index.tsx` for examples)
  - Development mode with browser console logging (`console: true`)
  - TypeScript support without compilation step
  - Hot reloading with `--hot` flag in dev mode
- **Additional Documentation**: See `apps/web/CLAUDE.md` for detailed Bun.serve() API usage and patterns

### Database Package (`@packages/db`)
- **Prisma schema**: `packages/db/prisma/schema.prisma`
- **Generated client**: `packages/db/src/generated/prisma/` (ignored by Biome)
- **Main export**: `getPrisma()` function returns configured PrismaClient instance
- **Adapter**: Uses `@prisma/adapter-pg` for PostgreSQL connection pooling
- **Logging**: Prisma events (query, info, warn, error) are logged via `@packages/logger`
- **Connection**: Database URL constructed from environment variables (not from `.env` file directly)
- **Data Model**:
  - **Tasks**: Simple task management with UUID PK, status tracking, optimistic locking (version)
  - **Organization Management**: Organizations and hierarchical Client structure
  - **User Management**: Users linked to clients, ID is Cognito sub (VARCHAR(128), not UUID)
  - **Application Management**: Application workflow with type, status, and history tracking
  - **RBAC System**: Role-Based Access Control with Roles, Permissions, and client-specific user role assignments

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
- **Development**: Uses `bun --watch` for auto-reload on file changes
- **Production Build**: TypeScript compiled with `bun build` to `dist/` directory, run with `node dist/index.js`
- **Build Output**: `apps/api/dist/` directory
- **Error Handling**: Uses `neverthrow` library for Result-based error handling (avoids throwing exceptions)
- **Validation**: Uses `@hono/zod-validator` with Zod schemas for request validation
- **Authentication**: AWS Cognito JWT validation via `jose` library (see middleware/cognitoAuth.ts)

#### Layered Architecture

The API follows a clean layered architecture with clear separation of concerns:

```
apps/api/src/
├── routes/v1/      → HTTP handlers (request/response)
├── infra/rds/      → Data access layer (repositories)
└── domain/         → Domain models and errors
```

**Layer Responsibilities**:

1. **Routes Layer** (`routes/v1/tasks/`)
   - HTTP request/response handling
   - Request validation using Zod schemas
   - Maps HTTP concepts to repository calls
   - Co-located with test files (e.g., `get.ts` and `get.test.ts`)
   - Each route exports a Hono instance for composition

2. **Repository Layer** (`infra/rds/tasks/`)
   - Database access via Prisma
   - Handles database errors and transforms them to domain errors
   - Returns `ResultAsync<T, DatabaseError>` using neverthrow
   - Isolates Prisma client from business logic

3. **Domain Layer** (`domain/`)
   - Domain models: `model/task.ts` defines Task type
   - Domain errors: `error.ts` defines error hierarchy
     - `AppError` (base class)
     - `NotFoundError`, `ForbiddenError`, `UnauthorizedError`, `ConflictError`
     - `ValidationError`, `DatabaseError`, `DomainError`, `ApiError`

**Data Flow Example**:
```
HTTP Request → Route Handler → Repository → Prisma → Database
                    ↓              ↓
              Validation       Data Access
              (Zod)           (neverthrow Result)
```

## Important Conventions

### Code Style
- **Indentation**: Space (configured in biome.jsonc)
- Biome ignores `**/src/generated` and `**/prisma/migrations`
- Import organization enabled (Biome auto-organizes imports)
- Floating promises must be handled (Biome nursery rule enforced)
- **Spell checking**: Custom words defined in `cspell.config.yaml` (includes project-specific terms like "bunx", "dotenvx", "neverthrow")

### TypeScript Configuration
- **Type checker**: `tsgo` (@typescript/native-preview 7.x) - Go-based TypeScript compiler
- **Type definitions**: Uses `@types/bun` (NOT @types/node) for Bun runtime types
- **Strict mode**: All packages use `strict: true`
- **Module resolution**: `bundler` mode for modern bundler semantics
- **JSX Configuration**:
  - API app: Uses `hono/jsx` runtime
  - Web app: Uses React's JSX with `react-jsx` transform
- **Target**: `ESNext` for all packages
- **Additional strict checks** (web app):
  - `noUncheckedIndexedAccess: true` - Prevents unchecked array/object access
  - `noImplicitOverride: true` - Requires explicit `override` keyword
- **Note**: `baseUrl` is NOT supported by tsgo - use relative paths in `paths` config

### Environment Files
- Database package uses `.env.db` file (loaded via dotenvx)

### Generated Code
- **Never edit** files in `packages/db/src/generated/prisma/` - regenerate with `bun db:generate`
- Prisma client is generated to custom output directory (not default node_modules)

### Prisma Workflow (Prisma 7)
1. Edit `packages/db/prisma/schema.prisma`
2. Run `bun db:migrate:dev` (creates migration + regenerates client)
3. Or run `bun db:generate` (just regenerates client without migration)

**Prisma 7 Configuration**:
- Uses `prisma.config.ts` for datasource URL (NOT in schema.prisma)
- Schema file: `packages/db/prisma/schema.prisma` (no `url` in datasource block)
- Config file: `packages/db/prisma.config.ts` (contains migration URL)

## Development Environment

### DevContainer Setup
- **Configuration**: `.devcontainer/devcontainer.json`
- **Docker Compose**: Uses `compose.yaml` and `compose.override.yaml`
- **Important**: Copy `.devcontainer/compose.override.yaml.sample` to `.devcontainer/compose.override.yaml` before starting devcontainer
  - This file contains database credentials and configuration
  - Not committed to git (in .gitignore)
- **Services**:
  - `dev`: Development container with Bun, Node.js, Git, GitHub CLI
  - `db`: PostgreSQL 15 with health checks
- **Features**:
  - VSCode extensions: Biome, Prisma, Spell Checker, Vitest Explorer
  - Automatic port forwarding: 3000 (web), 8080 (api), 5432 (PostgreSQL), 5555 (Prisma Studio), 24282 (Serena)
  - Post-create command runs `.devcontainer/setup.sh`

### Docker
- `compose.yaml` defines both web and api services
- Web service: `apps/web/.images/Dockerfile`, exposed on port 3000
- API service: `apps/api/.images/Dockerfile`, exposed on port 8080
- Run with: `docker compose up` or `docker compose up -d` for detached mode

## CI/CD

GitHub Actions workflow in `.github/workflows/cicd.yml` handles both CI and CD:

### Triggers
| Trigger | Branches | Action |
|---------|----------|--------|
| push | main, develop | CI + auto deploy to dev |
| pull_request | main, develop | CI only (no deploy) |
| workflow_dispatch | main | Manual deploy to dev or prd |
| workflow_dispatch | develop | Manual deploy to dev only |

### Branch Restrictions
- **workflow_dispatch**: Only allowed from `main` or `develop` branches
- **prd deployment**: Only allowed from `main` branch

### Pipeline Jobs

```
ci ─────────────────────────────────────────────────────┐
  └─→ setup ─→ deploy-frontend ─────────────────────────┤
              └─→ db-migrate ─→ deploy-backend ─────────┘
```

1. **ci**: Lint, type check, build, test (runs in devcontainer)
2. **setup**: Determines environment and deployment flags
3. **deploy-frontend**: Build and deploy to S3 + CloudFront invalidation
4. **db-migrate**: Run Prisma migrations via ECS run-task
5. **deploy-backend**: Build Docker image, push to ECR, update ECS service

### Environment Configuration
- Uses GitHub Environments (`dev`, `prd`) for secrets/variables
- AWS authentication via OIDC (role assumption)
- Environment-specific variables: `S3_BUCKET_NAME`, `CLOUDFRONT_DISTRIBUTION_ID`, `ECS_CLUSTER_NAME`, etc.

## Infrastructure as Code (IaC)

Terraform-based AWS infrastructure in `apps/iac/`:

### Structure
```
apps/iac/
├── environments/
│   ├── dev/          # Development environment
│   └── prd/          # Production environment
└── modules/
    ├── vpc/          # VPC, subnets, NAT Gateway, Flow Logs
    ├── ecr/          # Container registry
    ├── ecs/          # Fargate cluster, service, auto-scaling
    ├── aurora/       # Aurora Serverless v2 PostgreSQL
    ├── api_gateway/  # HTTP API with VPC Link
    ├── s3_cloudfront/# Static hosting with CDN
    ├── waf/          # Web Application Firewall
    ├── acm/          # SSL certificates
    ├── route53/      # DNS records
    └── cognito/      # User Pool, Hosted UI, Google IdP
```

### AWS Architecture
```
                          Cognito User Pool (Hosted UI, Google IdP)
                                    │
                                    ▼ JWT
Browser ─→ CloudFront ─→ S3 (static)
                │
                └─→ API Gateway ─→ VPC Link ─→ NLB ─→ ECS Fargate ─→ Aurora Serverless v2
                                                          │
                                                          └─→ Secrets Manager
```

### Environment Differences
| Feature | Dev | Prd |
|---------|-----|-----|
| NAT Gateway | Single | Multi-AZ |
| ECS Tasks | 1 (Spot) | 2+ (Standard) |
| Aurora Capacity | 0.5-2 ACU | 0.5-16 ACU |
| Auto-scaling | Disabled | Enabled |
| Deletion Protection | No | Yes |
| Log Retention | 7 days | 90 days |

### IaC Workflow (`.github/workflows/iac.yml`)

Manual workflow for Terraform deployments:

**Trigger**: `workflow_dispatch` (manual only)
- **environment**: `dev` or `prd`
- **action**: `plan`, `apply`, or `destroy`

**Branch Restrictions**:
- Only `main` or `develop` branches can run workflow
- `prd` deployment only from `main` branch
- `destroy` action blocked for `prd` environment

**Pipeline Jobs**:
```
validate → plan → apply/destroy
```

**Required GitHub Environment Configuration**:
| Type | Name | Description |
|------|------|-------------|
| Variable | `AWS_ROLE_ARN` | OIDC IAM role ARN |
| Variable | `DOMAIN_NAME` | Route53 hosted zone domain |
| Variable | `APP_DOMAIN_NAME` | Application subdomain |
| Variable | `COGNITO_USER_POOL_ID` | Cognito User Pool ID |
| Variable | `COGNITO_CLIENT_ID` | Cognito SPA client ID |
| Variable | `COGNITO_DOMAIN` | Cognito Hosted UI domain |
| Secret | `DB_USERNAME` | Database username |
| Secret | `DB_PASSWORD` | Database password |
| Secret | `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| Secret | `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |

### Local Terraform Commands
```bash
cd apps/iac/environments/dev  # or prd

# Initialize
terraform init

# Plan changes
terraform plan -var-file="terraform.tfvars"

# Apply changes
terraform apply -var-file="terraform.tfvars"
```

### Required Variables
- `domain_name`: Base domain (Route53 hosted zone)
- `app_domain_name`: Application subdomain
- `db_name`, `db_username`, `db_password`: Database credentials
- `vpc_cidr`: VPC CIDR block

## Dependency Management

### Dependabot
- Configuration: `.github/dependabot.yml`
- **Package ecosystem**: `bun` (NOT npm)
- Weekly updates on Monday 09:00 JST
- Groups related packages (hono, react, prisma, etc.)
- Covers: Bun packages, GitHub Actions, Docker images

### Security Policies (bunfig.toml)
- **Minimum release age**: 21 days (1814400 seconds) - prevents installing very new packages
- **Exclusions**: `@types/bun`, `bun-types`, `typescript` are exempt from age restriction
- **Security scanner**: Uses `@bun-security-scanner/osv` for vulnerability scanning
- Run `bun audit` to check for known vulnerabilities

## Git Worktree Workflow

This project uses Makefile for git worktree management to enable parallel development:

```bash
# Create new worktree at ../wt_1 from origin/main
make wt

# Delete worktree
make wt-d

# List all worktrees and branches
make wt-l

# Copy devcontainer compose override sample (for initial setup)
make cp
```

**Worktree Creation Process (`make wt`):**
1. Creates git worktree at `../wt_1` from `origin/main`
2. Changes ownership to `vscode:vscode` for devcontainer compatibility
3. Installs dependencies (`bun ci`)
4. Generates Prisma client (`bun run db:generate`)
5. Applies database migrations (`bun run db:migrate:deploy`)
6. Runs all checks (`bun run check`)
7. Runs tests (`bun run test:run`)
8. Configures Serena MCP server if not already configured
9. Lists all worktrees and branches

**Use Cases:**
- Working on multiple features simultaneously in separate directories
- Testing changes in isolation without affecting main working directory
- Code review with actual code execution in separate environment

## Claude Code Extensions

This repository includes custom Claude Code extensions in `.claude/` directory:

### Skills (`.claude/skills/`)

Skills are reusable prompt templates for common tasks. Invoke with the Skill tool.

**Available Skills:**

#### `database` - Database Schema Specialist
Expert assistant for Prisma schema design and database management.

**Capabilities:**
- Create new models with proper conventions (camelCase fields → snake_case columns)
- Modify existing models and relationships
- Design indexes and optimization strategies
- Manage migrations and Prisma client generation
- Follows project naming conventions (UUIDs, timestamps, enums)
- Guides through complete workflow: design → migration → code integration

**Key Features:**
- Interactive requirement gathering with clarifying questions
- Follows PostgreSQL and Prisma best practices
- Automatic validation checklist for schema changes
- Integration guidance for all code layers (routes, service, repository, domain)

**Common Tasks:**
- Create new model with relationships
- Add fields to existing models
- Design one-to-many, many-to-many, or one-to-one relationships
- Add indexes for query optimization
- Modify enums safely

**Usage:**
```
Invoke Skill tool with command: "database"
```

#### `notice` - Notification System Specialist
Notification assistant for sending terminal notifications during Claude Code sessions.

**Capabilities:**
- Send visual terminal notifications with colored output and emoji icons
- Provide audio feedback via terminal bell
- Persistent logging with automatic rotation
- Support multiple event types (COMPLETE, STOP, APPROVAL, START, INFO)

**Notification Types:**
- **COMPLETE** (✅ Green): Task completion, successful operations
- **STOP** (🏁 Blue): Process completion, workflow end
- **APPROVAL** (⏸️ Yellow): User input required, approval needed
- **START** (🔔 Cyan): Process start, initialization
- **INFO** (🔔 Cyan): General information, status updates

**Common Use Cases:**
- Build and test completion notifications
- Long-running task status updates
- User confirmation prompts
- Git operation feedback
- Workflow milestone notifications

**Script Location:** `.claude/skills/notice/script.sh` (in project root)

**Usage:**
```bash
# Via Bash tool (use absolute path to project root)
./.claude/skills/notice/script.sh [TYPE] "[MESSAGE]" "[DETAILS]"

# Examples
./.claude/skills/notice/script.sh COMPLETE "Build complete" "All packages built successfully"
./.claude/skills/notice/script.sh START "Starting migration" "Updating database schema..."
./.claude/skills/notice/script.sh APPROVAL "Confirmation required" "Deploy to production?"
```

Or invoke the skill for guidance:
```
Invoke Skill tool with command: "notice"
```

### Slash Commands (`.claude/commands/`)

Slash commands are workflow automations. Use SlashCommand tool or type `/command-name`.

**Available Commands:**
- `/speckit.specify` - Create or update feature specifications
- `/speckit.plan` - Execute implementation planning workflow
- `/speckit.tasks` - Generate actionable, dependency-ordered tasks
- `/speckit.clarify` - Identify underspecified areas and ask clarification questions
- `/speckit.implement` - Execute implementation plan from tasks.md
- `/speckit.checklist` - Generate custom checklist for current feature
- `/speckit.analyze` - Cross-artifact consistency analysis
- `/speckit.constitution` - Create or update project constitution

### Agents (`.claude/agents/`)

Specialized agents for specific domains. Launched via Task tool with `subagent_type` parameter.

**Available Agents:**
- **`bun-runtime-specialist`**: Bun-specific configurations, features, troubleshooting
- **`pjt-security-code-reviewer`**: Code quality, security vulnerabilities, best practices
- **`github-spec-kit-architect`**: Design and review GitHub specification kits for agents
- **`aws-log-investigator`**: AWS CLI-based log investigation for ECS, API Gateway, Aurora, WAF, CloudFront, and VPC Flow Logs

### Hooks and Permissions (`.claude/settings.local.json`)

The repository uses a custom hooks and permissions system to control Claude Code's behavior:

**Permission System:**
- **Allowed**: Read operations, git status/diff/log, bun commands, docker ps/logs, notification script
- **Denied**: npm/yarn/pnpm/npx (enforcing Bun-only policy), destructive operations, force push to main/master
- **Require Approval**: git operations (add, commit, push, merge, rebase), bun add/remove, docker compose up/down, worktree operations

**Active Hook Events:**

These hooks automatically trigger the notification script (`.claude/skills/notice/script.sh`):

1. **PostToolUse** - Fires after Edit/Write/Bash/Task execution
   - Visual: `✅ [Claude Code] タスク完了` (green)
   - Shows executed tool name
   - Audio: Single terminal bell

2. **Stop** - Fires when Claude completes a response
   - Visual: `🏁 [Claude Code] 応答完了` (blue)
   - Indicates waiting for next request
   - Audio: Single terminal bell

3. **Notification** - Fires when Claude requests user approval
   - Visual: `⏸️ [Claude Code] 承認待ち` (yellow)
   - Alerts user that input is required
   - Audio: Three terminal beeps (for attention)

**Log Format**: `~/.claude/notifications.log`
```
[2025-10-19 09:36:05] [COMPLETE] タスク完了 - ツール: Edit
[2025-10-19 09:36:11] [STOP] 応答完了 - 次のリクエストを待機中
[2025-10-19 09:37:22] [APPROVAL] 承認待ち - データベース移行を実行しますか？
```

**Customization**: Modify `.claude/settings.local.json` to adjust hook behavior, permissions, or add matcher patterns for specific tools
