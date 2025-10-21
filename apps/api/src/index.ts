import { serve } from "@hono/node-server";
import { logger } from "@packages/logger";
import { Hono } from "hono";
import deleteTask from "./routes/v1/tasks/delete";
import getTask from "./routes/v1/tasks/get";
import listTask from "./routes/v1/tasks/list";
import postTask from "./routes/v1/tasks/post";
import putTask from "./routes/v1/tasks/put";

// Create v1 API router with base path
const v1 = new Hono()
  // Define task routes
  .route("/", getTask)
  .route("/", listTask)
  .route("/", postTask)
  .route("/", putTask)
  .route("/", deleteTask);

// Main app with health check and v1 routes
const app = new Hono().get("/health", (c) => c.text("OK")).route("/v1", v1);

serve({ fetch: app.fetch, port: 8080 }, (info) => {
  logger.info({
    message: `Server is running on http://localhost:${info.port}`,
  });
});
