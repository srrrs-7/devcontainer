/**
 * `@chax-at/transactional-prisma-testing`のセットアップ
 * @see https://www.npmjs.com/package/@chax-at/transactional-prisma-testing
 *
 * 各テストケースに対して分離されたトランザクションを提供します。
 * これにより、各テストケースは他のテストケースの影響を受けずにデータベース操作を実行できます。
 * テストケース内で発生したすべてのデータベース操作は、テストケースの終了時にロールバックされます。
 */

import { PrismaTestingHelper } from "@chax-at/transactional-prisma-testing";
import { getPrisma, initialize } from "@packages/db";
import { Hono, type MiddlewareHandler } from "hono";
import { afterEach, beforeEach, vi } from "vitest";
import type { AuthUser } from "../src/middleware";

type PrismaClient = ReturnType<typeof getPrisma>;

let prismaTestingHelper: PrismaTestingHelper<PrismaClient>;

declare global {
  var testPrismaClient: PrismaClient;
  /** Current test user - set via setTestUser() */
  var testAuthUser: AuthUser;
}

// Default test user
global.testAuthUser = {
  userId: "test-user-id",
  email: "test@example.com",
  username: "testuser",
  groups: [],
};

/**
 * Set the test user for the current test
 * Call this in your test to customize the authenticated user
 */
export const setTestUser = (user: Partial<AuthUser>) => {
  global.testAuthUser = {
    ...global.testAuthUser,
    ...user,
  };
};

/**
 * Reset test user to default
 */
export const resetTestUser = () => {
  global.testAuthUser = {
    userId: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    groups: [],
  };
};

/**
 * Create a test app that wraps a route handler with mock auth middleware.
 * Use this when testing individual route files that expect c.get("user") to be set.
 *
 * @example
 * import { createTestApp } from "../../../../__test__/setup";
 * import routeHandler from "./get";
 * const app = createTestApp(routeHandler);
 */
export const createTestApp = <T extends Hono>(routeHandler: T): Hono => {
  const app = new Hono();

  // Apply mock auth middleware that sets user context
  app.use("*", async (c, next) => {
    c.set("user", global.testAuthUser);
    c.set("token", "test-token");
    await next();
  });

  // Mount the route handler
  app.route("/", routeHandler);

  return app;
};

// Initialize Prisma testing helper at setup time (module top-level)
const originalPrisma = getPrisma();
prismaTestingHelper = new PrismaTestingHelper(originalPrisma);
global.testPrismaClient = prismaTestingHelper.getProxyClient();

// Mock getPrisma to return test client for any code that calls it
vi.doMock("@packages/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@packages/db")>();
  return {
    ...actual,
    getPrisma: () => global.testPrismaClient,
  };
});

// Mock cognitoAuthMiddleware to bypass JWT validation in tests
vi.doMock("../src/middleware/cognitoAuth", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../src/middleware/cognitoAuth")>();

  const mockCognitoAuthMiddleware = (): MiddlewareHandler => {
    return async (c, next) => {
      // Set the test user in context
      c.set("user", global.testAuthUser);
      c.set("token", "test-token");
      await next();
    };
  };

  return {
    ...actual,
    cognitoAuthMiddleware: mockCognitoAuthMiddleware,
  };
});

beforeEach(async () => {
  // Reset test user to default for each test
  resetTestUser();

  await prismaTestingHelper.startNewTransaction();

  // Re-initialize fabbrica for each test to ensure it uses the current transaction's proxy client
  initialize({
    prisma: () => global.testPrismaClient,
  });

  // Seed データを全て削除（動的にすべてのテーブルを取得して一括削除）
  const testPrisma = global.testPrismaClient;

  // すべてのテーブル名を取得
  const tables = await testPrisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename::text
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename != '_prisma_migrations';
  `;

  if (tables.length > 0) {
    const tableNames = tables.map((t) => `"${t.tablename}"`).join(", ");
    await testPrisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`,
    );
  }
});

afterEach(async () => {
  prismaTestingHelper?.rollbackCurrentTransaction();
});
