import { getPrisma } from "../../src";

/**
 * Rolesテーブルのシードデータを投入する
 */
export async function seedRoles() {
  const prisma = getPrisma();

  const roles = [
    {
      roleId: "40000000-0000-0000-0000-000000000001",
      name: "システム管理者",
      description: "全システムの管理権限を持つ最高権限ロール",
    },
    {
      roleId: "40000000-0000-0000-0000-000000000002",
      name: "組織管理者",
      description: "組織全体の管理権限を持つロール",
    },
    {
      roleId: "40000000-0000-0000-0000-000000000003",
      name: "クライアント管理者",
      description: "クライアント単位の管理権限を持つロール",
    },
    {
      roleId: "40000000-0000-0000-0000-000000000004",
      name: "部門管理者",
      description: "部門単位の管理権限を持つロール",
    },
    {
      roleId: "40000000-0000-0000-0000-000000000005",
      name: "マネージャー",
      description: "チームやプロジェクトを管理するロール",
    },
    {
      roleId: "40000000-0000-0000-0000-000000000006",
      name: "一般ユーザー",
      description: "基本的な機能のみ利用可能な標準ロール",
    },
    {
      roleId: "40000000-0000-0000-0000-000000000007",
      name: "閲覧専用ユーザー",
      description: "データの閲覧のみ可能なロール",
    },
    {
      roleId: "40000000-0000-0000-0000-000000000008",
      name: "申請承認者",
      description: "申請の承認・却下権限を持つロール",
    },
    {
      roleId: "40000000-0000-0000-0000-000000000009",
      name: "監査担当者",
      description: "システムログと監査情報にアクセスできるロール",
    },
    {
      roleId: "40000000-0000-0000-0000-000000000010",
      name: "ゲストユーザー",
      description: "限定的な機能のみ利用可能な一時的ロール",
    },
  ];

  console.log("🌱 Seeding roles...");

  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  console.log(`✅ Successfully seeded ${roles.length} roles`);
}
