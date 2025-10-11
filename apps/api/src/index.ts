import { serve } from "@hono/node-server";
import { logger } from "@packages/logger";
import { Hono } from "hono";
import deleteTask from "./routes/task/delete";
import getTask from "./routes/task/get";
import listTask from "./routes/task/list";
import postTask from "./routes/task/post";
import putTask from "./routes/task/put";

const app = new Hono()
  .get("/health", (c) => c.text("OK"))
  .route("/", getTask)
  .route("/", listTask)
  .route("/", postTask)
  .route("/", putTask)
  .route("/", deleteTask);

serve({ fetch: app.fetch, port: 8080 }, (info) => {
  logger.info({
    message: `Server is running on http://localhost:${info.port}`,
  });
});
