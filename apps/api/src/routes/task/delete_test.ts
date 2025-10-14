import { afterEach, beforeEach, test } from "bun:test";
import { getPrisma } from "@packages/db";

const prisma = getPrisma();

beforeEach(async () => {
  await prisma.$executeRaw`BEGIN`; // トランザクション開始
});
afterEach(async () => {
  await prisma.$executeRaw`ROLLBACK`; // ロールバック
});

test("ダミー", () => {
  // ダミーテスト。beforeEach, afterEachの動作確認用
});
