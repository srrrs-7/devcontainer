import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { err, ok } from "neverthrow";
import { NotFoundError } from "../../../domain/error";
import { deleteTaskInput } from "../../../domain/model/task";
import { deleteTask } from "../../../infra/rds/tasks/repository";
import {
  databaseErrorResponse,
  notFoundResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import { userHeaderSchema } from "../../validation/schemas";
import { taskIdParamSchema } from "../../validation/tasks";

export default new Hono().delete(
  "/task/:id",
  zValidator("param", taskIdParamSchema, (result, c) => {
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
    const { "x-user-id": userId } = c.req.valid("header");

    return await deleteTask(deleteTaskInput(userId, id))
      .andThen((result) => {
        return result.count > 0 ? ok(result) : err(new NotFoundError("task"));
      })
      .match(
        () => c.body(null, 204),
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
