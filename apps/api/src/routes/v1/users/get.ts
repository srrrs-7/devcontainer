import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { err, ok } from "neverthrow";
import { NotFoundError } from "../../../domain/error";
import { getUser } from "../../../infra/rds/users/repository";
import {
  databaseErrorResponse,
  notFoundResponse,
  okResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import { userIdParamSchema } from "../../validation/users";

type Response = {
  userId: string;
  clientId: string;
  username: string;
  email: string;
};

export default new Hono().get(
  "/user/:id",
  zValidator("param", userIdParamSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    return await getUser({ userId: id })
      .andThen((user) => {
        return user
          ? ok(user)
          : err(new NotFoundError(new Error("User not found"), "User"));
      })
      .map((user): Response => {
        return {
          userId: user.userId,
          clientId: user.clientId,
          username: user.username,
          email: user.email,
        };
      })
      .match(
        (response) => okResponse(c, response),
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
