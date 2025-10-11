# Use Bun official image
FROM oven/bun:1.3.0-alpine AS base
WORKDIR /app


####################
# Installer
FROM base AS installer
COPY . .
# Skip husky install in Docker (HUSKY=0 disables git hooks setup)
RUN HUSKY=0 bun install --production --no-lockfile


####################
# Runner
FROM base AS runner
# Copy built application and dependencies
COPY --from=installer /app .
# Expose the port the app runs on
CMD ["bun", "run", "/app/apps/api/src/index.ts"]