import { logger } from "@packages/logger";
import type { MiddlewareHandler } from "hono";

/**
 * Request logging middleware
 * Logs incoming requests and responses with timing information
 * Should be used after requestIdMiddleware to ensure requestId is in the log context
 */
export const requestLoggerMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const start = Date.now();
    const method = c.req.method;
    const path = c.req.path;
    const requestId = c.get("requestId");

    // Log incoming request
    logger.info(
      {
        method,
        path,
        requestId,
        query: c.req.query(),
        userAgent: c.req.header("user-agent"),
      },
      "Incoming request",
    );

    // Process the request
    await next();

    // Calculate duration
    const duration = Date.now() - start;
    const status = c.res.status;

    // Log response
    const logLevel = status >= 500 ? "error" : status >= 400 ? "warn" : "info";

    logger[logLevel](
      {
        method,
        path,
        requestId,
        status,
        duration,
      },
      "Request completed",
    );
  };
};
