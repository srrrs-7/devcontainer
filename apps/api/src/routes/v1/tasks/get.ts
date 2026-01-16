import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { err, ok } from "neverthrow";
import { NotFoundError } from "../../../domain/error/error";
import { getTask } from "../../../infra/rds/tasks/repository";
import {
  databaseErrorResponse,
  notFoundResponse,
  okResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import { taskIdParamSchema } from "../../validation/tasks";

type Response = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export default new Hono().get(
  "/task/:id",
  zValidator("param", taskIdParamSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const { id: taskId } = c.req.valid("param");
    const { userId } = c.get("user");

    const result = await getTask({ taskId, userId })
      .andThen((task) => {
        return !task
          ? err(new NotFoundError(new Error("Task not found"), "task"))
          : ok(task);
      })
      .map(
        (task): Response => ({
          taskId: task.getTaskId(),
          userId: task.getUserId(),
          content: task.getContent(),
          completedAt: task.getCompletedAt()?.toISOString() ?? null,
          version: task.getVersion(),
          createdAt: task.getCreatedAt().toISOString(),
          updatedAt: task.getUpdatedAt().toISOString(),
        }),
      );

    return result.match(
      (response) => okResponse(c, response),
      (error) => {
        const errName = error.name;
        switch (errName) {
          case "NotFoundError":
            return notFoundResponse(c, error);
          case "DatabaseError":
            return databaseErrorResponse(c, error);
          default:
            errName satisfies never;
            return unExpectedErrorResponse(c, error);
        }
      },
    );
  },
);
