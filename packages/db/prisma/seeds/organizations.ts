import { getPrisma } from "../../src";

/**
 * Organizationsテーブルのシードデータを投入する
 */
export async function seedOrganizations() {
  const prisma = getPrisma();

  const organizations = [
    {
      organizationId: "10000000-0000-0000-0000-000000000001",
      name: "株式会社テックイノベーション",
      description: "最先端のIT技術を提供するテクノロジー企業",
    },
    {
      organizationId: "10000000-0000-0000-0000-000000000002",
      name: "グローバルコンサルティング株式会社",
      description: "経営戦略とITコンサルティングサービス",
    },
    {
      organizationId: "10000000-0000-0000-0000-000000000003",
      name: "株式会社クラウドソリューションズ",
      description: "クラウドインフラとSaaSプロダクトの開発",
    },
    {
      organizationId: "10000000-0000-0000-0000-000000000004",
      name: "デジタルマーケティング株式会社",
      description: "デジタル広告とマーケティングオートメーション",
    },
    {
      organizationId: "10000000-0000-0000-0000-000000000005",
      name: "株式会社エンタープライズシステムズ",
      description: "大規模エンタープライズシステムの構築・運用",
    },
    {
      organizationId: "10000000-0000-0000-0000-000000000006",
      name: "フィンテック株式会社",
      description: "金融テクノロジーとブロックチェーンソリューション",
    },
    {
      organizationId: "10000000-0000-0000-0000-000000000007",
      name: "株式会社AIリサーチラボ",
      description: "人工知能と機械学習の研究開発",
    },
    {
      organizationId: "10000000-0000-0000-0000-000000000008",
      name: "セキュリティソリューションズ株式会社",
      description: "サイバーセキュリティとリスク管理",
    },
    {
      organizationId: "10000000-0000-0000-0000-000000000009",
      name: "株式会社モバイルアプリデザイン",
      description: "モバイルアプリケーションの企画・開発・運用",
    },
    {
      organizationId: "10000000-0000-0000-0000-000000000010",
      name: "IoTプラットフォーム株式会社",
      description: "IoTデバイスとプラットフォームサービスの提供",
    },
  ];

  console.log("🌱 Seeding organizations...");

  for (const org of organizations) {
    await prisma.organization.create({
      data: org,
    });
  }

  console.log(`✅ Successfully seeded ${organizations.length} organizations`);
}
