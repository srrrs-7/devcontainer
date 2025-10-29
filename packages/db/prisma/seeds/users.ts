import { getPrisma } from "../../src";

/**
 * Usersテーブルのシードデータを投入する
 * パスワードは実際の本番環境ではbcryptなどでハッシュ化すること
 */
export async function seedUsers() {
  const prisma = getPrisma();

  const users = [
    {
      id: "30000000-0000-0000-0000-000000000001",
      clientId: "20000000-0000-0000-0000-000000000001",
      username: "yamada_taro",
      email: "yamada.taro@tech-innovation.co.jp",
      passwordHash: "$2b$10$dummyHashForYamadaTaro123456789", // ダミーハッシュ
    },
    {
      id: "30000000-0000-0000-0000-000000000002",
      clientId: "20000000-0000-0000-0000-000000000002",
      username: "sato_hanako",
      email: "sato.hanako@tech-innovation.co.jp",
      passwordHash: "$2b$10$dummyHashForSatoHanako123456789",
    },
    {
      id: "30000000-0000-0000-0000-000000000003",
      clientId: "20000000-0000-0000-0000-000000000003",
      username: "suzuki_ichiro",
      email: "suzuki.ichiro@tech-innovation.co.jp",
      passwordHash: "$2b$10$dummyHashForSuzukiIchiro12345678",
    },
    {
      id: "30000000-0000-0000-0000-000000000004",
      clientId: "20000000-0000-0000-0000-000000000004",
      username: "tanaka_jiro",
      email: "tanaka.jiro@global-consulting.co.jp",
      passwordHash: "$2b$10$dummyHashForTanakaJiro123456789",
    },
    {
      id: "30000000-0000-0000-0000-000000000005",
      clientId: "20000000-0000-0000-0000-000000000005",
      username: "takahashi_misaki",
      email: "takahashi.misaki@global-consulting.co.jp",
      passwordHash: "$2b$10$dummyHashForTakahashiMisaki12345",
    },
    {
      id: "30000000-0000-0000-0000-000000000006",
      clientId: "20000000-0000-0000-0000-000000000006",
      username: "ito_kenta",
      email: "ito.kenta@cloud-solutions.co.jp",
      passwordHash: "$2b$10$dummyHashForItoKenta1234567890ab",
    },
    {
      id: "30000000-0000-0000-0000-000000000007",
      clientId: "20000000-0000-0000-0000-000000000007",
      username: "watanabe_mai",
      email: "watanabe.mai@digital-marketing.co.jp",
      passwordHash: "$2b$10$dummyHashForWatanabeMai12345678",
    },
    {
      id: "30000000-0000-0000-0000-000000000008",
      clientId: "20000000-0000-0000-0000-000000000008",
      username: "nakamura_daisuke",
      email: "nakamura.daisuke@enterprise-systems.co.jp",
      passwordHash: "$2b$10$dummyHashForNakamuraDaisuke123456",
    },
    {
      id: "30000000-0000-0000-0000-000000000009",
      clientId: "20000000-0000-0000-0000-000000000009",
      username: "kobayashi_sakura",
      email: "kobayashi.sakura@fintech.co.jp",
      passwordHash: "$2b$10$dummyHashForKobayashiSakura123456",
    },
    {
      id: "30000000-0000-0000-0000-000000000010",
      clientId: "20000000-0000-0000-0000-000000000010",
      username: "kato_yosuke",
      email: "kato.yosuke@ai-research-lab.co.jp",
      passwordHash: "$2b$10$dummyHashForKatoYosuke123456789",
    },
  ];

  console.log("🌱 Seeding users...");

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  console.log(`✅ Successfully seeded ${users.length} users`);
}
