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
  return c.json(issues, 400);
};

export const forbiddenResponse = (c: Context, error: Error) => {
  logger.warn({ error }, "Forbidden");
  return c.json(error, 403);
};

export const unauthorizedResponse = (c: Context, error: Error) => {
  logger.warn({ error }, "Unauthorized");
  return c.json(error, 401);
};

export const conflictResponse = (c: Context, error: Error) => {
  logger.warn({ error }, "Conflict");
  return c.json(error, 409);
};

export const notFoundResponse = (c: Context, error: NotFoundError) => {
  logger.warn({ error }, "Not found");
  return c.json(error, 404);
};

export const domainErrorResponse = (c: Context, error: Error) => {
  logger.warn({ error }, "Domain error");
  return c.json(error, 500);
};

export const databaseErrorResponse = (c: Context, error: DatabaseError) => {
  logger.error({ error }, "Database error");
  return c.json(error, 500);
};

export const unExpectedErrorResponse = (c: Context, error: unknown) => {
  logger.error({ error }, "Unexpected server error");
  return c.json(error, 500);
};
