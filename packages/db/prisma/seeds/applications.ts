import { getPrisma } from "../../src";

/**
 * Applicationsテーブルのシードデータを投入する
 */
export async function seedApplications() {
  const prisma = getPrisma();

  const applications = [
    {
      id: "60000000-0000-0000-0000-000000000001",
      userId: "30000000-0000-0000-0000-000000000001",
      type: "LEAVE_REQUEST" as const,
      description: "2025年11月1日〜11月5日まで有給休暇を取得したい",
      applicationDate: new Date("2025-10-15T09:00:00Z"),
    },
    {
      id: "60000000-0000-0000-0000-000000000002",
      userId: "30000000-0000-0000-0000-000000000002",
      type: "EXPENSE_CLAIM" as const,
      description: "営業活動における交通費 15,000円の精算申請",
      applicationDate: new Date("2025-10-16T10:30:00Z"),
    },
    {
      id: "60000000-0000-0000-0000-000000000003",
      userId: "30000000-0000-0000-0000-000000000003",
      type: "SYSTEM_ACCESS" as const,
      description: "新プロジェクトのGitHubリポジトリへのアクセス権限申請",
      applicationDate: new Date("2025-10-17T11:00:00Z"),
    },
    {
      id: "60000000-0000-0000-0000-000000000004",
      userId: "30000000-0000-0000-0000-000000000004",
      type: "OTHER" as const,
      description:
        "リモートワーク環境整備のための機器購入申請（モニター、キーボード）",
      applicationDate: new Date("2025-10-17T14:00:00Z"),
    },
    {
      id: "60000000-0000-0000-0000-000000000005",
      userId: "30000000-0000-0000-0000-000000000005",
      type: "LEAVE_REQUEST" as const,
      description: "2025年12月25日〜12月27日まで年末休暇を取得したい",
      applicationDate: new Date("2025-10-18T09:30:00Z"),
    },
    {
      id: "60000000-0000-0000-0000-000000000006",
      userId: "30000000-0000-0000-0000-000000000006",
      type: "EXPENSE_CLAIM" as const,
      description: "クライアント訪問時の宿泊費 25,000円の精算申請",
      applicationDate: new Date("2025-10-18T13:00:00Z"),
    },
    {
      id: "60000000-0000-0000-0000-000000000007",
      userId: "30000000-0000-0000-0000-000000000007",
      type: "SYSTEM_ACCESS" as const,
      description: "本番環境データベースへの読み取り専用アクセス権限申請",
      applicationDate: new Date("2025-10-19T10:00:00Z"),
    },
    {
      id: "60000000-0000-0000-0000-000000000008",
      userId: "30000000-0000-0000-0000-000000000008",
      type: "LEAVE_REQUEST" as const,
      description: "2025年11月20日に私用のため半日休暇を取得したい",
      applicationDate: new Date("2025-10-19T11:30:00Z"),
    },
    {
      id: "60000000-0000-0000-0000-000000000009",
      userId: "30000000-0000-0000-0000-000000000009",
      type: "OTHER" as const,
      description:
        "業務効率化のためのSaaSツール導入申請（Notion Businessプラン）",
      applicationDate: new Date("2025-10-19T15:00:00Z"),
    },
    {
      id: "60000000-0000-0000-0000-000000000010",
      userId: "30000000-0000-0000-0000-000000000010",
      type: "EXPENSE_CLAIM" as const,
      description: "技術カンファレンス参加費 30,000円の精算申請",
      applicationDate: new Date("2025-10-20T09:00:00Z"),
    },
  ];

  console.log("🌱 Seeding applications...");

  for (const app of applications) {
    await prisma.application.upsert({
      where: { id: app.id },
      update: app,
      create: app,
    });
  }

  console.log(`✅ Successfully seeded ${applications.length} applications`);
}
