import { serve } from "@hono/node-server";
import { logger } from "@packages/logger";
import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => {
  return c.text("OK");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    logger.info({
      message: `Server is running on http://localhost:${info.port}`,
    });
  },
);
