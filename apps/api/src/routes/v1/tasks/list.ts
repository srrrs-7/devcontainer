import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { paginationSchema, userHeaderSchema } from "../../validation/schemas";

export default new Hono().get(
  "/tasks",
  zValidator("query", paginationSchema, (result, c) => {
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return c.json(
        {
          message: "Validation failed",
          error: {
            code: firstIssue?.code || "invalid_query",
            field: firstIssue?.path.join(".") || "query",
          },
        },
        400,
      );
    }
  }),
  zValidator("header", userHeaderSchema, (result, c) => {
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return c.json(
        {
          message: "Validation failed",
          error: {
            code: firstIssue?.code || "invalid_header",
            field: firstIssue?.path.join(".") || "header",
          },
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
