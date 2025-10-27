import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { okResponse, validationErrorResponse } from "../../response";
import { userHeaderSchema } from "../../validation/schemas";
import {
  taskIdParamSchema,
  updateTaskBodySchema,
} from "../../validation/tasks";

type Response = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: Date | null;
};

export default new Hono().put(
  "/task/:id",
  zValidator("param", taskIdParamSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  zValidator("json", updateTaskBodySchema, (result, c) => {
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
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const { "x-user-id": userId } = c.req.valid("header");
    const response: Response = {
      taskId: id,
      userId,
      content: body.content ?? "Sample task content",
      completedAt: null,
    };
    return okResponse(c, response);
  },
);
