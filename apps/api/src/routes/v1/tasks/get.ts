import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { userHeaderSchema } from "../../validation/schemas";
import { taskIdParamSchema } from "../../validation/tasks";

export default new Hono().get(
  "/task/:id",
  zValidator("param", taskIdParamSchema, (result, c) => {
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return c.json(
        {
          message: "Validation failed",
          error: {
            code: firstIssue?.code || "invalid_parameter",
            field: firstIssue?.path.join(".") || "param",
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
    const { id } = c.req.valid("param");
    const { "x-user-id": userId } = c.req.valid("header");
    return c.json({ taskId: id, userId, status: "in-progress" });
  },
);
