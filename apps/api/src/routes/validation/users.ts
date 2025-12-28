import z from "zod";
import { emailSchema, usernameSchema, uuidSchema } from "./schemas";

/**
 * User-specific validation schemas
 * Note: With Cognito authentication, userId is the Cognito sub which can be
 * either a UUID (for Cognito User Pool) or a different format (for federated IdPs)
 */

// Cognito sub can be up to 128 characters
export const cognitoSubSchema = z
  .string()
  .min(1, "User ID must not be empty")
  .max(128, "User ID must not exceed 128 characters");

export const userIdParamSchema = z.object({
  id: cognitoSubSchema.describe("User ID (Cognito sub)"),
});

export const createUserBodySchema = z.object({
  userId: cognitoSubSchema.describe("User ID (Cognito sub)"),
  clientId: uuidSchema.describe("Client ID must be a valid UUID"),
  username: usernameSchema,
  email: emailSchema,
  name: z.string().max(255, "Name must not exceed 255 characters").optional(),
  picture: z.string().url("Picture must be a valid URL").optional(),
});

export const updateUserBodySchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    name: z.string().max(255, "Name must not exceed 255 characters").nullable(),
    picture: z.string().url("Picture must be a valid URL").nullable(),
  })
  .partial()
  .refine(
    (data) =>
      data.username !== undefined ||
      data.email !== undefined ||
      data.name !== undefined ||
      data.picture !== undefined,
    {
      message:
        "At least one field (username, email, name, or picture) must be provided",
    },
  );

export const listUsersQuerySchema = z.object({
  clientId: uuidSchema.describe("Client ID must be a valid UUID"),
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .max(10000, "Page must not exceed 10000")
    .default(1),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must not exceed 100")
    .default(20),
});
