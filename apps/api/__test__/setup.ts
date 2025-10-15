/**
 * `@chax-at/transactional-prisma-testing`のセットアップ
 * @see https://www.npmjs.com/package/@chax-at/transactional-prisma-testing
 *
 * 各テストケースに対して分離されたトランザクションを提供します。
 * これにより、各テストケースは他のテストケースの影響を受けずにデータベース操作を実行できます。
 * テストケース内で発生したすべてのデータベース操作は、テストケースの終了時にロールバックされます。
 */

import { PrismaTestingHelper } from "@chax-at/transactional-prisma-testing";
import { getPrisma } from "@packages/db";
import { afterEach, beforeEach, vi } from "vitest";

type PrismaClient = ReturnType<typeof getPrisma>;

let prismaTestingHelper: PrismaTestingHelper<PrismaClient>;

declare global {
  var testPrismaClient: PrismaClient;
}

vi.doMock("@packages/db", () => {
  return {
    getPrisma: () => global.testPrismaClient,
  };
});

beforeEach(async () => {
  if (prismaTestingHelper == null) {
    const originalPrisma = getPrisma();
    prismaTestingHelper = new PrismaTestingHelper(originalPrisma);
    global.testPrismaClient = prismaTestingHelper.getProxyClient();
  }

  await prismaTestingHelper.startNewTransaction();
});

afterEach(async () => {
  prismaTestingHelper?.rollbackCurrentTransaction();
});
