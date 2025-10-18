# devcontainer

A Bun-powered monorepo featuring a React 19 web app and Hono API server with PostgreSQL database.

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

## CI/CD

GitHub Actions workflow runs on push to main and pull requests:

- Uses devcontainer for consistent build environment
- Runs checks (lint, spell, type check)
- Builds all workspaces
- Runs tests
- Caches devcontainer image to GitHub Container Registry

## License

MIT
