import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { userHeaderSchema } from "../../validation/schemas";
import {
  taskIdParamSchema,
  updateTaskBodySchema,
} from "../../validation/tasks";

export default new Hono().put(
  "/task/:id",
  zValidator("param", taskIdParamSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        { error: "Invalid parameters", issues: result.error.issues },
        400,
      );
    }
  }),
  zValidator("json", updateTaskBodySchema, (result, c) => {
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
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const { "x-user-id": userId } = c.req.valid("header");
    return c.json({
      taskId: id,
      userId,
      content: body.content,
      status: body.status,
    });
  },
);
