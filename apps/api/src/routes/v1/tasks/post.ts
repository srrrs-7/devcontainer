import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTask } from "../../../infra/rds/tasks/repository";
import {
  databaseErrorResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
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

    const result = createTask({
      userId,
      content: body.content,
    }).map(
      (task): Response => ({
        taskId: task.taskId,
        userId: task.userId,
        content: task.content,
        completedAt: task.completedAt,
      }),
    );

    return result.match(
      (response) => {
        return c.json(response, 200);
      },
      (error) => {
        const errName = error.name;
        switch (errName) {
          case "DatabaseError":
            return databaseErrorResponse(c, error);
          default:
            return unExpectedErrorResponse(c, error);
        }
      },
    );
  },
);
