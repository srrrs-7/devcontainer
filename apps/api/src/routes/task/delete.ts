import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { deleteTaskInput } from "../../domain/model/task";
import { deleteTask } from "../../infra/rds/task/repository";

const paramSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
});

const headerSchema = z.object({
  "x-user-id": z.string().min(1, "User ID is required"),
});

export default new Hono().delete(
  "/task/:id",
  zValidator("param", paramSchema),
  zValidator("header", headerSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { "x-user-id": userId } = c.req.valid("header");

    return await deleteTask(deleteTaskInput(userId, id)).match(
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
