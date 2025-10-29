import { getPrisma } from "../../src";

/**
 * Clientsテーブルのシードデータを投入する
 * 階層構造を含む（親子関係）
 */
export async function seedClients() {
  const prisma = getPrisma();

  const clients = [
    // Organization 1のクライアント（階層あり）
    {
      id: "20000000-0000-0000-0000-000000000001",
      organizationId: "10000000-0000-0000-0000-000000000001",
      parentClientId: null,
      name: "東京本社",
      contactPerson: "山田太郎",
      email: "yamada@tech-innovation.co.jp",
    },
    {
      id: "20000000-0000-0000-0000-000000000002",
      organizationId: "10000000-0000-0000-0000-000000000001",
      parentClientId: "20000000-0000-0000-0000-000000000001", // 東京本社の子
      name: "東京本社 開発部",
      contactPerson: "佐藤花子",
      email: "sato@tech-innovation.co.jp",
    },
    {
      id: "20000000-0000-0000-0000-000000000003",
      organizationId: "10000000-0000-0000-0000-000000000001",
      parentClientId: "20000000-0000-0000-0000-000000000001", // 東京本社の子
      name: "東京本社 営業部",
      contactPerson: "鈴木一郎",
      email: "suzuki@tech-innovation.co.jp",
    },
    // Organization 2のクライアント
    {
      id: "20000000-0000-0000-0000-000000000004",
      organizationId: "10000000-0000-0000-0000-000000000002",
      parentClientId: null,
      name: "大阪支社",
      contactPerson: "田中次郎",
      email: "tanaka@global-consulting.co.jp",
    },
    {
      id: "20000000-0000-0000-0000-000000000005",
      organizationId: "10000000-0000-0000-0000-000000000002",
      parentClientId: "20000000-0000-0000-0000-000000000004", // 大阪支社の子
      name: "大阪支社 コンサルティング部",
      contactPerson: "高橋美咲",
      email: "takahashi@global-consulting.co.jp",
    },
    // Organization 3のクライアント
    {
      id: "20000000-0000-0000-0000-000000000006",
      organizationId: "10000000-0000-0000-0000-000000000003",
      parentClientId: null,
      name: "福岡オフィス",
      contactPerson: "伊藤健太",
      email: "ito@cloud-solutions.co.jp",
    },
    // Organization 4のクライアント
    {
      id: "20000000-0000-0000-0000-000000000007",
      organizationId: "10000000-0000-0000-0000-000000000004",
      parentClientId: null,
      name: "名古屋支店",
      contactPerson: "渡辺麻衣",
      email: "watanabe@digital-marketing.co.jp",
    },
    // Organization 5のクライアント
    {
      id: "20000000-0000-0000-0000-000000000008",
      organizationId: "10000000-0000-0000-0000-000000000005",
      parentClientId: null,
      name: "横浜事業所",
      contactPerson: "中村大輔",
      email: "nakamura@enterprise-systems.co.jp",
    },
    // Organization 6のクライアント
    {
      id: "20000000-0000-0000-0000-000000000009",
      organizationId: "10000000-0000-0000-0000-000000000006",
      parentClientId: null,
      name: "金融サービス部門",
      contactPerson: "小林さくら",
      email: "kobayashi@fintech.co.jp",
    },
    // Organization 7のクライアント
    {
      id: "20000000-0000-0000-0000-000000000010",
      organizationId: "10000000-0000-0000-0000-000000000007",
      parentClientId: null,
      name: "AI研究センター",
      contactPerson: "加藤洋介",
      email: "kato@ai-research-lab.co.jp",
    },
  ];

  console.log("🌱 Seeding clients...");

  for (const client of clients) {
    await prisma.client.upsert({
      where: { id: client.id },
      update: client,
      create: client,
    });
  }

  console.log(`✅ Successfully seeded ${clients.length} clients`);
}
