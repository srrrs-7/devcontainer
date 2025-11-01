import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { err, ok } from "neverthrow";
import { NotFoundError } from "../../../domain/error";
import { hashPassword } from "../../../domain/model/user";
import { updateUser } from "../../../infra/rds/users/repository";
import {
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
    const body = c.req.valid("json");

    let passwordHash: string | undefined;
    if (body.password) {
      const hashPasswordResult = await hashPassword(body.password);

      if (hashPasswordResult.isErr()) {
        return c.json({ error: "Failed to hash password" }, 500);
      }

      passwordHash = hashPasswordResult.value;
    }

    return await updateUser({
      userId: id,
      username: body.username,
      email: body.email,
      passwordHash,
    })
      .andThen((user) => {
        return user ? ok(user) : err(new NotFoundError("user"));
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
