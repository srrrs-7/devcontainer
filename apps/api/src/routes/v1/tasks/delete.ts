import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { err, ok } from "neverthrow";
import { NotFoundError } from "../../../domain/error";
import { deleteTaskInput } from "../../../domain/model/task";
import { deleteTask } from "../../../infra/rds/tasks/repository";
import { userHeaderSchema } from "../../validation/schemas";
import { taskIdParamSchema } from "../../validation/tasks";

export default new Hono().delete(
  "/task/:id",
  zValidator("param", taskIdParamSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        { error: "Invalid parameters", issues: result.error.issues },
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
    const { "x-user-id": userId } = c.req.valid("header");

    return await deleteTask(deleteTaskInput(userId, id))
      .andThen((result) => {
        return result.count > 0
          ? ok(result)
          : err(new NotFoundError("Resource not found"));
      })
      .match(
        () => c.body(null, 204),
        (error) => {
          const errorName = error.name;
          switch (errorName) {
            case "NotFoundError":
              return c.json({ error: error.message }, 404);
            case "DatabaseError":
              return c.json({ error: "Database error occurred" }, 500);
            default:
              errorName satisfies never;
              return c.json({ error: "Internal server error" }, 500);
          }
        },
      );
  },
);
