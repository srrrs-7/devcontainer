import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { listUsers } from "../../../infra/rds/users/repository";
import {
  databaseErrorResponse,
  okResponse,
  unExpectedErrorResponse,
  validationErrorResponse,
} from "../../response";
import { listUsersQuerySchema } from "../../validation/users";

type UserItem = {
  userId: string;
  clientId: string;
  username: string;
  email: string;
};

type Response = {
  users: UserItem[];
  page: number;
  limit: number;
};

export default new Hono().get(
  "/users",
  zValidator("query", listUsersQuerySchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const { clientId, page, limit } = c.req.valid("query");

    return await listUsers({
      clientId,
      page,
      limit,
    })
      .map((users): Response => {
        return {
          users: users.map((user) => ({
            userId: user.getUserId(),
            clientId: user.getClientId(),
            username: user.getUsername(),
            email: user.getEmail(),
          })),
          page: page ?? 1,
          limit: limit ?? 20,
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
