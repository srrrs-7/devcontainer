import { defineConfig } from "prisma/config";

export default defineConfig({
  migrations: {
    seed: "bun run prisma/seeds/seed.ts",
  },
});
