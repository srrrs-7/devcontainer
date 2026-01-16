import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTask } from "../../../infra/rds/tasks/repository";
import {
  databaseErrorResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import { createTaskBodySchema } from "../../validation/tasks";

type Response = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: Date | null;
  version: number;
  createdAt?: string;
  updatedAt?: string;
};

export default new Hono().post(
  "/task",
  zValidator("json", createTaskBodySchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const { userId } = c.get("user");

    const result = createTask({
      userId,
      content: body.content,
    }).map(
      (task): Response => ({
        taskId: task.getTaskId(),
        userId: task.getUserId(),
        content: task.getContent(),
        completedAt: task.getCompletedAt(),
        version: task.getVersion(),
        createdAt: task.getCreatedAt()?.toISOString(),
        updatedAt: task.getUpdatedAt()?.toISOString(),
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
