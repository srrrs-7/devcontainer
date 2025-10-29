import { getPrisma } from "../../src";

/**
 * Tasksテーブルのシードデータを投入する
 */
export async function seedTasks() {
  const prisma = getPrisma();

  const tasks = [
    {
      id: "01000000-0000-0000-0000-000000000001",
      content: "プロジェクトの要件定義を完成させる",
      status: "COMPLETED" as const,
      completedAt: new Date("2024-10-01T10:00:00Z"),
    },
    {
      id: "01000000-0000-0000-0000-000000000002",
      content: "データベース設計を見直す",
      status: "COMPLETED" as const,
      completedAt: new Date("2024-10-05T15:30:00Z"),
    },
    {
      id: "01000000-0000-0000-0000-000000000003",
      content: "APIエンドポイントの実装",
      status: "IN_PROGRESS" as const,
      completedAt: null,
    },
    {
      id: "01000000-0000-0000-0000-000000000004",
      content: "フロントエンドのUI/UX改善",
      status: "IN_PROGRESS" as const,
      completedAt: null,
    },
    {
      id: "01000000-0000-0000-0000-000000000005",
      content: "ユニットテストの作成",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      id: "01000000-0000-0000-0000-000000000006",
      content: "統合テストの実装",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      id: "01000000-0000-0000-0000-000000000007",
      content: "パフォーマンステストの実施",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      id: "01000000-0000-0000-0000-000000000008",
      content: "ドキュメントの作成",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      id: "01000000-0000-0000-0000-000000000009",
      content: "セキュリティレビューの実施",
      status: "PENDING" as const,
      completedAt: null,
    },
    {
      id: "01000000-0000-0000-0000-000000000010",
      content: "本番環境へのデプロイ準備",
      status: "PENDING" as const,
      completedAt: null,
    },
  ];

  console.log("🌱 Seeding tasks...");

  for (const task of tasks) {
    await prisma.tasks.upsert({
      where: { id: task.id },
      update: {
        content: task.content,
        status: task.status,
        completedAt: task.completedAt,
        updatedAt: new Date(),
      },
      create: {
        id: task.id,
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
