import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { userHeaderSchema } from "../../validation/schemas";
import { createTaskBodySchema } from "../../validation/tasks";

export default new Hono().post(
  "/task",
  zValidator("json", createTaskBodySchema, (result, c) => {
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return c.json(
        {
          message: "Validation failed",
          error: {
            code: firstIssue?.code || "invalid_body",
            field: firstIssue?.path.join(".") || "body",
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
  async (c) => {
    const body = c.req.valid("json");
    const { "x-user-id": userId } = c.req.valid("header");
    return c.json(
      {
        taskId: "new-task-id",
        userId,
        content: body.content,
        status: body.status,
      },
      201,
    );
  },
);
