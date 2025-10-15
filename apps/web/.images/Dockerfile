# Use Bun official image
FROM oven/bun:1.3.0-slim AS base
WORKDIR /app

# Installer
FROM base AS installer
COPY . .
# Skip husky install in Docker (HUSKY=0 disables git hooks setup)
RUN HUSKY=0 bun ci --production --no-lockfile

# Builder
FROM installer AS builder
COPY --from=installer /app .
# Build the application (if applicable)
RUN bun build:web

# Runner
FROM nginx:alpine AS runner
# Copy nginx configuration for SPA routing
COPY apps/web/.images/nginx.conf /etc/nginx/conf.d/default.conf
# Copy all built files (HTML, JS, CSS, assets)
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
# Expose nginx default port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]