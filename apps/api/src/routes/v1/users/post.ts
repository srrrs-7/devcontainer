import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { hashPassword } from "../../../domain/service/user";
import { createUser } from "../../../infra/rds/users/repository";
import {
  databaseErrorResponse,
  okResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import { createUserBodySchema } from "../../validation/users";

type Response = {
  userId: string;
  clientId: string;
  username: string;
  email: string;
};

export default new Hono().post(
  "/user",
  zValidator("json", createUserBodySchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");

    const hashPasswordResult = await hashPassword(body.password);
    if (hashPasswordResult.isErr()) {
      return c.json({ error: "Failed to hash password" }, 500);
    }
    const passwordHash = hashPasswordResult.value;

    return await createUser({
      clientId: body.clientId,
      username: body.username,
      email: body.email,
      passwordHash,
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
