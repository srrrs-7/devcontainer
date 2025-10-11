import { Hono } from "hono";

export default new Hono().get("/tasks", (c) => {
  return c.json({
    tasks: [
      { taskId: "task-1", content: "Sample task 1", status: "in-progress" },
      { taskId: "task-2", content: "Sample task 2", status: "completed" },
    ],
  });
});
