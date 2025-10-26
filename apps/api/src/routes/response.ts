import type { Context } from "hono";
import type { z } from "zod";
import type { NotFoundError } from "../domain/error";

/**
 * ������������ (400)
 */
export const validationErrorResponse = (
  c: Context,
  issues: z.ZodError["issues"],
) => {
  return c.json(
    {
      message: "Validation failed",
      error: issues,
    },
    400,
  );
};

/**
 * NotFound������ (404)
 */
export const notFoundResponse = (c: Context, error: NotFoundError) => {
  return c.json(
    {
      message: error.message,
      error: { resourceName: error.resourceName },
    },
    404,
  );
};

export const databaseErrorResponse = (c: Context) => {
  return c.json({ error: "Database error occurred" }, 500);
};

export const unExpectedErrorResponse = (c: Context) => {
  return c.json({ error: "Internal server error" }, 500);
};
