import { getPrisma } from "../../src";

/**
 * UserClientRolesテーブルのシードデータを投入する
 * ユーザーに特定のクライアントスコープでロールを割り当てる
 */
export async function seedUserClientRoles() {
  const prisma = getPrisma();

  const userClientRoles = [
    // User 1: システム管理者（東京本社スコープ）
    {
      userId: "30000000-0000-0000-0000-000000000001",
      clientId: "20000000-0000-0000-0000-000000000001",
      roleId: "40000000-0000-0000-0000-000000000001", // システム管理者
      assignedByUserId: null, // 初期設定
    },
    // User 2: 部門管理者（開発部スコープ）
    {
      userId: "30000000-0000-0000-0000-000000000002",
      clientId: "20000000-0000-0000-0000-000000000002",
      roleId: "40000000-0000-0000-0000-000000000004", // 部門管理者
      assignedByUserId: "30000000-0000-0000-0000-000000000001", // User 1が割り当て
    },
    // User 3: マネージャー（営業部スコープ）
    {
      userId: "30000000-0000-0000-0000-000000000003",
      clientId: "20000000-0000-0000-0000-000000000003",
      roleId: "40000000-0000-0000-0000-000000000005", // マネージャー
      assignedByUserId: "30000000-0000-0000-0000-000000000001",
    },
    // User 4: クライアント管理者（大阪支社スコープ）
    {
      userId: "30000000-0000-0000-0000-000000000004",
      clientId: "20000000-0000-0000-0000-000000000004",
      roleId: "40000000-0000-0000-0000-000000000003", // クライアント管理者
      assignedByUserId: null, // 初期設定
    },
    // User 5: 一般ユーザー（コンサルティング部スコープ）
    {
      userId: "30000000-0000-0000-0000-000000000005",
      clientId: "20000000-0000-0000-0000-000000000005",
      roleId: "40000000-0000-0000-0000-000000000006", // 一般ユーザー
      assignedByUserId: "30000000-0000-0000-0000-000000000004",
    },
    // User 6: 一般ユーザー（福岡オフィススコープ）
    {
      userId: "30000000-0000-0000-0000-000000000006",
      clientId: "20000000-0000-0000-0000-000000000006",
      roleId: "40000000-0000-0000-0000-000000000006", // 一般ユーザー
      assignedByUserId: null,
    },
    // User 7: マネージャー（名古屋支店スコープ）
    {
      userId: "30000000-0000-0000-0000-000000000007",
      clientId: "20000000-0000-0000-0000-000000000007",
      roleId: "40000000-0000-0000-0000-000000000005", // マネージャー
      assignedByUserId: null,
    },
    // User 8: 申請承認者（横浜事業所スコープ）
    {
      userId: "30000000-0000-0000-0000-000000000008",
      clientId: "20000000-0000-0000-0000-000000000008",
      roleId: "40000000-0000-0000-0000-000000000008", // 申請承認者
      assignedByUserId: null,
    },
    // User 9: 閲覧専用ユーザー（金融サービス部門スコープ）
    {
      userId: "30000000-0000-0000-0000-000000000009",
      clientId: "20000000-0000-0000-0000-000000000009",
      roleId: "40000000-0000-0000-0000-000000000007", // 閲覧専用ユーザー
      assignedByUserId: null,
    },
    // User 10: 監査担当者（AI研究センタースコープ）
    {
      userId: "30000000-0000-0000-0000-000000000010",
      clientId: "20000000-0000-0000-0000-000000000010",
      roleId: "40000000-0000-0000-0000-000000000009", // 監査担当者
      assignedByUserId: null,
    },
  ];

  console.log("🌱 Seeding user client roles...");

  for (const ucr of userClientRoles) {
    await prisma.userClientRole.upsert({
      where: {
        userId_clientId_roleId: {
          userId: ucr.userId,
          clientId: ucr.clientId,
          roleId: ucr.roleId,
        },
      },
      update: ucr,
      create: ucr,
    });
  }

  console.log(
    `✅ Successfully seeded ${userClientRoles.length} user-client-role assignments`,
  );
}
