import path from "node:path";
import type { PrismaConfig } from "prisma";

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DBNAME, DB_PORT } = process.env;

export default {
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
    seed: "bun prisma/seeds/index.ts",
  },
  datasource: {
    url: `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT ?? 5432}/${DB_DBNAME}?schema=public`,
  },
} satisfies PrismaConfig;
