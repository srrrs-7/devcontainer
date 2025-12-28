import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";
import { Hono } from "hono";
import { updateTask } from "../../../infra/rds/tasks/repository";
import {
  databaseErrorResponse,
  okResponse,
  validationErrorResponse,
} from "../../response";
import {
  taskIdParamSchema,
  updateTaskBodySchema,
} from "../../validation/tasks";

type Response = {
  count: number;
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
  async (c) => {
    const { id } = c.req.valid("param");
    const { content, status, version } = c.req.valid("json");
    const { userId } = c.get("user");

    const result = updateTask({
      taskId: id,
      userId,
      content: content,
      completedAt: status === "COMPLETED" ? dayjs().toDate() : null,
      version,
    }).map((count): Response => count);

    return result.match(
      (response) => okResponse(c, response),
      (error) => {
        const errName = error.name;
        switch (errName) {
          case "DatabaseError":
            return databaseErrorResponse(c, error);
          default:
            errName satisfies never;
            return databaseErrorResponse(c, error);
        }
      },
    );
  },
);
