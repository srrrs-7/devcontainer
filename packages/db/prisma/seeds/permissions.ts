import { getPrisma } from "../../src";

/**
 * Permissionsテーブルのシードデータを投入する
 */
export async function seedPermissions() {
  const prisma = getPrisma();

  const permissions = [
    {
      permissionId: "50000000-0000-0000-0000-000000000001",
      name: "view_organization",
      description: "組織情報の閲覧",
    },
    {
      permissionId: "50000000-0000-0000-0000-000000000002",
      name: "edit_organization",
      description: "組織情報の編集",
    },
    {
      permissionId: "50000000-0000-0000-0000-000000000003",
      name: "view_client",
      description: "クライアント情報の閲覧",
    },
    {
      permissionId: "50000000-0000-0000-0000-000000000004",
      name: "edit_client",
      description: "クライアント情報の編集",
    },
    {
      permissionId: "50000000-0000-0000-0000-000000000005",
      name: "view_user",
      description: "ユーザー情報の閲覧",
    },
    {
      permissionId: "50000000-0000-0000-0000-000000000006",
      name: "edit_user",
      description: "ユーザー情報の編集",
    },
    {
      permissionId: "50000000-0000-0000-0000-000000000007",
      name: "view_application",
      description: "申請情報の閲覧",
    },
    {
      permissionId: "50000000-0000-0000-0000-000000000008",
      name: "create_application",
      description: "新規申請の作成",
    },
    {
      permissionId: "50000000-0000-0000-0000-000000000009",
      name: "approve_application",
      description: "申請の承認",
    },
    {
      permissionId: "50000000-0000-0000-0000-000000000010",
      name: "view_audit_log",
      description: "監査ログの閲覧",
    },
  ];

  console.log("🌱 Seeding permissions...");

  for (const permission of permissions) {
    await prisma.permission.create({
      data: permission,
    });
  }

  console.log(`✅ Successfully seeded ${permissions.length} permissions`);
}
