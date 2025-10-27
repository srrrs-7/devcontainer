import { logger } from "@packages/logger";
import type { Context } from "hono";
import type { z } from "zod";
import type { DatabaseError, NotFoundError } from "../domain/error";

export const okResponse = <T>(c: Context, data: T) => {
  return c.json(data, 200);
};

export const createdResponse = <T>(c: Context, data: T) => {
  return c.json(data, 201);
};

export const noContentResponse = (c: Context) => {
  return c.body(null, { status: 204 });
};

export const validationErrorResponse = (
  c: Context,
  issues: z.ZodError["issues"],
) => {
  logger.warn({ issues }, "Validation failed");
  return c.json(
    {
      message: "Validation failed",
      error: issues,
    },
    400,
  );
};

export const notFoundResponse = (c: Context, error: NotFoundError) => {
  logger.error({ error }, "Not found");
  return c.json(
    {
      message: error.message,
      error: error,
    },
    404,
  );
};

export const databaseErrorResponse = (c: Context, error: DatabaseError) => {
  logger.error({ error }, "Database error");
  return c.json(
    {
      message: error.message,
      error: error,
    },
    500,
  );
};

export const unExpectedErrorResponse = (c: Context, error: unknown) => {
  logger.error({ error }, "Unexpected server error");
  return c.json(
    {
      message: "Unexpected server error",
      error: error,
    },
    500,
  );
};
