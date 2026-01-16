import { logger } from "@packages/logger";
import type { MiddlewareHandler } from "hono";
import type { JWTPayload } from "jose";
import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Cognito JWT payload type with specific claims
 */
interface CognitoJwtPayload extends JWTPayload {
  sub: string;
  email?: string;
  "cognito:username"?: string;
  "cognito:groups"?: string[];
  token_use: "access" | "id";
}

/**
 * Authenticated user context
 */
export interface AuthUser {
  /** Cognito sub claim - use as user ID */
  userId: string;
  /** User's email address */
  email?: string;
  /** Cognito username */
  username?: string;
  /** Cognito groups the user belongs to */
  groups: string[];
}

// Extend Hono context with auth user
declare module "hono" {
  interface ContextVariableMap {
    user: AuthUser;
    token: string;
  }
}

// Cache JWKS to avoid repeated fetches
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

/**
 * Get or create cached JWKS
 */
const getJWKS = (): ReturnType<typeof createRemoteJWKSet> => {
  const jwksUri = process.env.COGNITO_JWKS_URI;
  if (!jwksUri) {
    throw new Error("COGNITO_JWKS_URI environment variable is not set");
  }

  if (!jwksCache) {
    jwksCache = createRemoteJWKSet(new URL(jwksUri));
  }
  return jwksCache;
};

/**
 * Clear JWKS cache (useful for testing)
 */
export const clearJWKSCache = (): void => {
  jwksCache = null;
};

/**
 * Cognito JWT authentication middleware
 *
 * Validates the JWT token from the Authorization header using Cognito JWKS.
 * On success, sets the authenticated user in the Hono context.
 *
 * Required environment variables:
 * - COGNITO_JWKS_URI: JWKS endpoint URL for token validation
 * - COGNITO_ISSUER: Token issuer URL
 * - COGNITO_CLIENT_ID: Cognito app client ID (optional, for audience validation)
 */
export const cognitoAuthMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    // Skip authentication in development mode when SKIP_AUTH is set
    if (process.env.SKIP_AUTH === "true") {
      const devUser: AuthUser = {
        userId: process.env.DEV_USER_ID || "dev-user-id",
        email: "dev@example.com",
        username: "dev-user",
        groups: [],
      };
      c.set("user", devUser);
      c.set("token", "dev-token");
      logger.debug("Authentication skipped in development mode");
      await next();
      return;
    }

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

    try {
      const issuer = process.env.COGNITO_ISSUER;

      if (!issuer) {
        logger.error("COGNITO_ISSUER environment variable is not set");
        return c.json(
          {
            success: false,
            error: {
              code: "INTERNAL_ERROR",
              message: "Authentication service is not configured",
            },
          },
          500,
        );
      }

      const jwks = getJWKS();

      // Verify the token
      const { payload } = await jwtVerify<CognitoJwtPayload>(token, jwks, {
        issuer,
      });

      // Validate token_use claim (should be 'access' for API calls)
      if (payload.token_use !== "access") {
        logger.warn(
          { token_use: payload.token_use },
          "Invalid token type - expected access token",
        );
        return c.json(
          {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Invalid token type",
            },
          },
          401,
        );
      }

      // Set user in context
      const user: AuthUser = {
        userId: payload.sub,
        email: payload.email,
        username: payload["cognito:username"],
        groups: payload["cognito:groups"] ?? [],
      };

      c.set("user", user);
      c.set("token", token);

      logger.debug({ userId: user.userId }, "User authenticated successfully");

      await next();
    } catch (error) {
      logger.warn({ error }, "JWT validation failed");
      return c.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid or expired token",
          },
        },
        401,
      );
    }
  };
};

/**
 * Middleware to require specific Cognito groups
 *
 * Must be used after cognitoAuthMiddleware.
 *
 * @param requiredGroups - Array of group names, user must belong to at least one
 */
export const requireGroups = (
  ...requiredGroups: string[]
): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get("user");

    if (!user) {
      logger.warn("requireGroups called without authenticated user");
      return c.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        },
        401,
      );
    }

    const hasRequiredGroup = requiredGroups.some((group) =>
      user.groups.includes(group),
    );

    if (!hasRequiredGroup) {
      logger.warn(
        { userId: user.userId, requiredGroups, userGroups: user.groups },
        "User does not have required group",
      );
      return c.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Insufficient permissions",
          },
        },
        403,
      );
    }

    await next();
  };
};
