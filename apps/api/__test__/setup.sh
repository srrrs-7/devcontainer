/**
 * テストセットアップ
 *
 * 各テストケースの前後でデータベースをクリーンアップします。
 * これにより、各テストケースは他のテストケースの影響を受けずにデータベース操作を実行できます。
 */
import { getPrisma } from "@packages/db";

type PrismaClient = ReturnType<typeof getPrisma>;

declare global {
  var testPrismaClient: PrismaClient;
}

// テスト用のPrismaクライアントを初期化
if (!global.testPrismaClient) {
  global.testPrismaClient = getPrisma();
}

vi.doMock("@packages/db", () => {
  return {
    getPrisma: () => global.testPrismaClient,
  };
});

afterEach(async () => {
  // 各テスト後にすべてのテーブルをクリーンアップ
  await global.testPrismaClient.tasks.deleteMany({});
});
