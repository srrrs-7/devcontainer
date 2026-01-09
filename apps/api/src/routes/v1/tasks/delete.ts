import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { err, ok } from "neverthrow";
import { NotFoundError } from "../../../domain/error/error";
import { deleteTask } from "../../../infra/rds/tasks/repository";
import {
  databaseErrorResponse,
  noContentResponse,
  notFoundResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import { taskIdParamSchema } from "../../validation/tasks";

export default new Hono().delete(
  "/task/:id",
  zValidator("param", taskIdParamSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const { userId } = c.get("user");

    return await deleteTask({ userId, taskId: id })
      .andThen((result) => {
        return result.count > 0
          ? ok(result)
          : err(new NotFoundError("Task not found", "task"));
      })
      .match(
        () => noContentResponse(c),
        (error) => {
          const errorName = error.name;
          switch (errorName) {
            case "NotFoundError":
              return notFoundResponse(c, error);
            case "DatabaseError":
              return databaseErrorResponse(c, error);
            default:
              errorName satisfies never;
              return unExpectedErrorResponse(c, error);
          }
        },
      );
  },
);
