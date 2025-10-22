import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { paginationSchema, userHeaderSchema } from "../../validation/schemas";

export default new Hono().get(
  "/tasks",
  zValidator("query", paginationSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: "Validation failed",
          error: result.error.issues,
        },
        400,
      );
    }
  }),
  zValidator("header", userHeaderSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: "Validation failed",
          error: result.error.issues,
        },
        400,
      );
    }
  }),
  (c) => {
    const { page, limit } = c.req.valid("query");
    const { "x-user-id": userId } = c.req.valid("header");
    return c.json({
      userId,
      page,
      limit,
      tasks: [
        { taskId: "task-1", content: "Sample task 1", status: "in-progress" },
        { taskId: "task-2", content: "Sample task 2", status: "completed" },
      ],
    });
  },
);
