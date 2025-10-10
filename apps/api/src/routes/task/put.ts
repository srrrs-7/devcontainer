import { Hono } from "hono";

export default new Hono().put("/task/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  return c.json({ taskId: id, content: body.content, status: "updated" });
});
