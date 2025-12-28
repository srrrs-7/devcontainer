import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createUser } from "../../../infra/rds/users/repository";
import {
  databaseErrorResponse,
  okResponse,
  validationErrorResponse,
} from "../../response";
import { createUserBodySchema } from "../../validation/users";

type Response = {
  userId: string;
  clientId: string;
  username: string;
  email: string;
  name: string | null;
  picture: string | null;
};

/**
 * Create a new user in the database
 * This endpoint is typically called when a user first authenticates via Cognito
 * The userId should be the Cognito sub claim
 */
export default new Hono().post(
  "/user",
  zValidator("json", createUserBodySchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const { userId, clientId, username, email, name, picture } =
      c.req.valid("json");

    return await createUser({
      userId,
      clientId,
      username,
      email,
      name,
      picture,
    })
      .map(
        (user): Response => ({
          userId: user.userId,
          clientId: user.clientId,
          username: user.username,
          email: user.email,
          name: user.name,
          picture: user.picture,
        }),
      )
      .match(
        (response) => okResponse(c, response),
        (error) => databaseErrorResponse(c, error),
      );
  },
);
