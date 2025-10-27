import { logger } from "@packages/logger";
import type { MiddlewareHandler } from "hono";

/**
 * Bearer token extraction middleware
 * Extracts the bearer token from the Authorization header and sets it in the context
 * Does not perform authentication - only extraction and validation of header format
 */
export const bearerAuthMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const authHeader = c.req.header("authorization");

    if (!authHeader) {
      logger.warn("No authorization header provided");
      return c.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authorization header is required",
          },
        },
        401,
      );
    }

    // Check if the header starts with "Bearer "
    const bearerPrefix = "Bearer ";
    if (!authHeader.startsWith(bearerPrefix)) {
      logger.warn({ authHeader }, "Invalid authorization header format");
      return c.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authorization header must use Bearer scheme",
          },
        },
        401,
      );
    }

    // Extract the token
    const token = authHeader.substring(bearerPrefix.length).trim();

    if (!token) {
      logger.warn("Empty bearer token provided");
      return c.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Bearer token is required",
          },
        },
        401,
      );
    }

    // Set the token in the context for downstream use
    c.set("token", token);

    await next();
  };
};
