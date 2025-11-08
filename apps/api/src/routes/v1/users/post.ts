import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { hashPassword } from "../../../domain/model/user";
import { createUser } from "../../../infra/rds/users/repository";
import {
  databaseErrorResponse,
  domainErrorResponse,
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
    const { clientId, username, email, password } = c.req.valid("json");

    return await hashPassword(password)
      .andThen((passwordHash) =>
        createUser({
          clientId: clientId,
          username: username,
          email: email,
          passwordHash,
        }),
      )
      .map(
        (user): Response => ({
          userId: user.userId,
          clientId: user.clientId,
          username: user.username,
          email: user.email,
        }),
      )
      .match(
        (response) => okResponse(c, response),
        (error) => {
          const errorName = error.name;
          switch (errorName) {
            case "DomainError":
              return domainErrorResponse(c, error);
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
