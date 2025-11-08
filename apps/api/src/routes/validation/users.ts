import z from "zod";
import { emailSchema, usernameSchema, uuidSchema } from "./schemas";

/**
 * User-specific validation schemas
 */

export const userIdParamSchema = z.object({
  id: uuidSchema.describe("User ID must be a valid UUID"),
});

export const createUserBodySchema = z.object({
  clientId: uuidSchema.describe("Client ID must be a valid UUID"),
  username: usernameSchema,
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

export const updateUserBodySchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
  })
  .refine(
    (data) =>
      data.username !== undefined ||
      data.email !== undefined ||
      data.password !== undefined,
    {
      message:
        "At least one field (username, email, or password) must be provided",
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
