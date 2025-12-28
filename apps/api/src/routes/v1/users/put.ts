import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { err, ok } from "neverthrow";
import { NotFoundError } from "../../../domain/error";
import { updateUser } from "../../../infra/rds/users/repository";
import {
  conflictResponse,
  databaseErrorResponse,
  notFoundResponse,
  okResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import {
  updateUserBodySchema,
  userIdParamSchema,
} from "../../validation/users";

type Response = {
  userId: string;
  clientId: string;
  username: string;
  email: string;
  name: string | null;
  picture: string | null;
};

export default new Hono().put(
  "/user/:id",
  zValidator("param", userIdParamSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  zValidator("json", updateUserBodySchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const { username, email, name, picture } = c.req.valid("json");

    return await updateUser({
      userId: id,
      username,
      email,
      name: name ?? undefined,
      picture: picture ?? undefined,
    })
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
          name: user.name,
          picture: user.picture,
        };
      })
      .match(
        (response) => okResponse(c, response),
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
