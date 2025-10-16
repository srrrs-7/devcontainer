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
      userId: testUserId,
      content: "プロジェクトの要件定義を完成させる",
      status: "COMPLETED" as const,
      completedAt: new Date("2024-10-01T10:00:00Z"),
    },
    {
      userId: testUserId,
      content: "データベース設計を見直す",
      status: "COMPLETED" as const,
      completedAt: new Date("2024-10-05T15:30:00Z"),
    },
    {
      userId: testUserId,
      content: "APIエンドポイントの実装",
      status: "IN_PROGRESS" as const,
      completedAt: null,
    },
    {
      userId: testUserId,
      content: "フロントエンドのUI/UX改善",
      status: "IN_PROGRESS" as const,
      completedAt: null,
    },
    {
      userId: testUserId,
      content: "ユニットテストの作成",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      userId: testUserId,
      content: "統合テストの実装",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      userId: testUserId,
      content: "パフォーマンステストの実施",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      userId: testUserId,
      content: "ドキュメントの作成",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      userId: testUserId,
      content: "セキュリティレビューの実施",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      userId: testUserId,
      content: "本番環境へのデプロイ準備",
      status: "PENDING" as const,
      completedAt: null,
    },
  ];

  console.log("🌱 Seeding tasks...");

  for (const task of tasks) {
    await prisma.tasks.create({
      data: {
        userId: task.userId,
        content: task.content,
        status: task.status,
        completedAt: task.completedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log(`✅ Successfully seeded ${tasks.length} tasks`);
}
