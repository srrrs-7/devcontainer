import z from "zod";
import { contentSchema, uuidSchema } from "./schemas";

/**
 * Task-specific schemas
 */
export const taskStatusSchema = z.enum(
  ["PENDING", "IN_PROGRESS", "COMPLETED"],
  {
    message: "Status must be one of: PENDING, IN_PROGRESS, COMPLETED",
  },
);

export const taskIdParamSchema = z.object({
  id: uuidSchema.describe("Task ID must be a valid UUID"),
});

export const createTaskBodySchema = z.object({
  content: contentSchema(1000).describe("Task content"),
  status: taskStatusSchema.optional().default("PENDING"),
});

export const updateTaskBodySchema = z
  .object({
    content: contentSchema(1000).optional(),
    status: taskStatusSchema.optional(),
    version: z.number().int().min(0).describe("Version for optimistic locking"),
  })
  .refine((data) => data.content !== undefined || data.status !== undefined, {
    message: "At least one field (content or status) must be provided",
  });
