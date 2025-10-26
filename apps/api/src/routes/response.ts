import type { Context } from "hono";
import type { z } from "zod";
import type { DatabaseError, NotFoundError } from "../domain/error";

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

export const notFoundResponse = (c: Context, error: NotFoundError) => {
  return c.json(
    {
      message: error.message,
      error: error,
    },
    404,
  );
};

export const databaseErrorResponse = (c: Context, error: DatabaseError) => {
  return c.json(
    {
      message: error.message,
      error: error,
    },
    500,
  );
};

export const unExpectedErrorResponse = (c: Context, error: unknown) => {
  return c.json(
    {
      message: "Unexpected server error",
      error: error,
    },
    500,
  );
};
