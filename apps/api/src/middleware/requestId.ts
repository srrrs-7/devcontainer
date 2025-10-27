import { randomUUID } from "node:crypto";
import { runWithRequestId } from "@packages/logger";
import type { MiddlewareHandler } from "hono";

/**
 * Request ID middleware
 * Generates a unique request ID and sets it in AsyncLocalStorage context
 * The request ID will be automatically attached to all logs via the logger package
 */
export const requestIdMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    // Generate or use existing request ID from header
    const requestId = c.req.header("x-request-id") || randomUUID();

    // Set the request ID in the context for downstream use
    c.set("requestId", requestId);

    // Run the rest of the request handling within the AsyncLocalStorage context
    await runWithRequestId(requestId, async () => {
      await next();
    });

    // Add request ID to response headers
    c.header("x-request-id", requestId);
  };
};
