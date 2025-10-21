import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { userHeaderSchema } from "../../validation/schemas";
import { createTaskBodySchema } from "../../validation/tasks";

export default new Hono().post(
  "/task",
  zValidator("json", createTaskBodySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        { error: "Invalid request body", issues: result.error.issues },
        400,
      );
    }
  }),
  zValidator("header", userHeaderSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        { error: "Invalid headers", issues: result.error.issues },
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
