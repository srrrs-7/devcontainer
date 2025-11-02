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
import { afterEach, beforeEach, vi } from "vitest";

type PrismaClient = ReturnType<typeof getPrisma>;

let prismaTestingHelper: PrismaTestingHelper<PrismaClient>;

declare global {
  var testPrismaClient: PrismaClient;
}

vi.doMock("@packages/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@packages/db")>();
  return {
    ...actual,
    getPrisma: () => global.testPrismaClient,
  };
});

// Initialize Prisma testing helper and fabbrica at setup time
const originalPrisma = getPrisma();
prismaTestingHelper = new PrismaTestingHelper(originalPrisma);
global.testPrismaClient = prismaTestingHelper.getProxyClient();

// Initialize fabbrica with test Prisma client (must be done before any test runs)
initialize({
  prisma: () => global.testPrismaClient,
});

beforeEach(async () => {
  await prismaTestingHelper.startNewTransaction();

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
