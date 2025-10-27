import { getPrisma } from "../../src";

/**
 * Tasksテーブルのシードデータを投入する
 */
export async function seedTasks() {
  const prisma = getPrisma();

  // テスト用のユーザーID（UUID形式）
  const testUserId = "00000000-0000-0000-0000-000000000001";

  const tasks = [
    {
      content: "プロジェクトの要件定義を完成させる",
      status: "COMPLETED" as const,
      completedAt: new Date("2024-10-01T10:00:00Z"),
    },
    {
      content: "データベース設計を見直す",
      status: "COMPLETED" as const,
      completedAt: new Date("2024-10-05T15:30:00Z"),
    },
    {
      content: "APIエンドポイントの実装",
      status: "IN_PROGRESS" as const,
      completedAt: null,
    },
    {
      content: "フロントエンドのUI/UX改善",
      status: "IN_PROGRESS" as const,
      completedAt: null,
    },
    {
      content: "ユニットテストの作成",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      content: "統合テストの実装",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      content: "パフォーマンステストの実施",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      content: "ドキュメントの作成",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      content: "セキュリティレビューの実施",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      content: "本番環境へのデプロイ準備",
      status: "PENDING" as const,
      completedAt: null,
    },
  ];

  console.log("🌱 Seeding tasks...");

  for (const task of tasks) {
    // Create Task and UserTask in a transaction
    await prisma.$transaction(async (tx) => {
      const createdTask = await tx.tasks.create({
        data: {
          content: task.content,
          status: task.status,
          completedAt: task.completedAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create UserTask to associate task with user
      await tx.userTask.create({
        data: {
          userId: testUserId,
          taskId: createdTask.id,
        },
      });
    });
  }

  console.log(`✅ Successfully seeded ${tasks.length} tasks`);
}
