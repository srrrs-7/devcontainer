import { expect, test } from "bun:test";
import { getPrisma } from "@packages/db";

const prisma = getPrisma();

test("トランザクションの動作確認", async () => {
  // トランザクション内でテストを実行し、最後にエラーをthrowしてロールバック
  try {
    await prisma.$transaction(async (tx) => {
      // GIVEN
      await tx.tasks.createMany({
        data: [
          {
            userId: "user-1",
            content: "Initial Task",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            userId: "user-2",
            content: "Another Task",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      // WHEN

      // THEN
      const tasks = await tx.tasks.findMany();
      expect(tasks.length).toBe(2);

      // テスト成功後、強制的にロールバック
      throw new Error("Rollback test data");
    });
  } catch (error) {
    // ロールバックのための意図的なエラーは無視
    if (error instanceof Error && error.message !== "Rollback test data") {
      throw error;
    }
  }
});
