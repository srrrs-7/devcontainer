import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { okResponse, validationErrorResponse } from "../../response";
import { paginationSchema, userHeaderSchema } from "../../validation/schemas";

type TaskItem = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: Date | null;
};

type Response = {
  tasks: TaskItem[];
  page: number;
  limit: number;
};

export default new Hono().get(
  "/tasks",
  zValidator("query", paginationSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  zValidator("header", userHeaderSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  (c) => {
    const { page, limit } = c.req.valid("query");
    const { "x-user-id": userId } = c.req.valid("header");
    const response: Response = {
      tasks: [
        {
          taskId: "task-1",
          userId,
          content: "Sample task 1",
          completedAt: null,
        },
        {
          taskId: "task-2",
          userId,
          content: "Sample task 2",
          completedAt: new Date(),
        },
      ],
      page,
      limit,
    };
    return okResponse(c, response);
  },
);
