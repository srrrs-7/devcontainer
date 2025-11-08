import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteUser } from "../../../infra/rds/users/repository";
import {
  conflictResponse,
  databaseErrorResponse,
  noContentResponse,
  notFoundResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import { userIdParamSchema } from "../../validation/users";

export default new Hono().delete(
  "/user/:id",
  zValidator("param", userIdParamSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    return await deleteUser({ userId: id }).match(
      () => noContentResponse(c),
      (error) => {
        const errorName = error.name;
        switch (errorName) {
          case "NotFoundError":
            return notFoundResponse(c, error);
          case "ConflictError":
            return conflictResponse(c, error);
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
