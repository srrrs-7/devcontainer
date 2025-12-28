import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { listTasks } from "../../../infra/rds/tasks/repository";
import {
  databaseErrorResponse,
  okResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import { paginationSchema } from "../../validation/schemas";

type TaskItem = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: Date | null;
  version: number;
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
  async (c) => {
    const { page, limit } = c.req.valid("query");
    const { userId } = c.get("user");

    const result = await listTasks({ userId, page, limit }).map(
      (tasks): Response => {
        return {
          tasks: tasks.map((task) => ({
            taskId: task.taskId,
            userId: task.userId,
            content: task.content,
            completedAt: task.completedAt,
            version: task.version,
          })),
          page,
          limit,
        };
      },
    );

    return result.match(
      (response) => okResponse(c, response),
      (error) => {
        const errName = error.name;
        switch (errName) {
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
