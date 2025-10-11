import { Hono } from "hono";

export default new Hono().post("/task", async (c) => {
  const body = await c.req.json();
  return c.json(
    { taskId: "new-task-id", content: body.content, status: "created" },
    201,
  );
});
