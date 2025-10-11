# Use Bun official image
FROM oven/bun:1.3.0-slim AS base
WORKDIR /app

# Installer
FROM base AS installer
COPY . .
# Skip husky install in Docker (HUSKY=0 disables git hooks setup)
RUN HUSKY=0 bun install --production --no-lockfile

# Builder
FROM installer AS builder
COPY --from=installer /app .
# Build the application (if applicable)
RUN bun build:web

# Runner
FROM node:24-alpine AS runner
# Copy built application and dependencies
COPY --from=builder /app/apps/web/dist .
# Expose the port the app runs on
CMD ["node", "index.js"]