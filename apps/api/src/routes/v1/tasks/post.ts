import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { okResponse, validationErrorResponse } from "../../response";
import { userHeaderSchema } from "../../validation/schemas";
import { createTaskBodySchema } from "../../validation/tasks";

type Response = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: Date | null;
};

export default new Hono().post(
  "/task",
  zValidator("json", createTaskBodySchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  zValidator("header", userHeaderSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const { "x-user-id": userId } = c.req.valid("header");
    const response: Response = {
      taskId: "new-task-id",
      userId,
      content: body.content,
      completedAt: null,
    };
    return okResponse(c, response);
  },
);
