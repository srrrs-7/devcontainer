import { Hono } from "hono";

export default new Hono().get("/task/:id", (c) => {
  const { id } = c.req.param();
  return c.json({ taskId: id, status: "in-progress" });
});
