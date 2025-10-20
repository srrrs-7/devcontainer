import { getPrisma } from "../../src";
import { seedApplicationHistories } from "./application-histories";
import { seedApplications } from "./applications";
import { seedClients } from "./clients";
import { seedOrganizations } from "./organizations";
import { seedPermissions } from "./permissions";
import { seedRolePermissions } from "./role-permissions";
import { seedRoles } from "./roles";
import { seedTasks } from "./tasks";
import { seedUserClientRoles } from "./user-client-roles";
import { seedUsers } from "./users";

async function main() {
  const prisma = getPrisma();

  console.log("🌱 Starting database seeding...");

  try {
    // 依存関係の順序でシードデータを投入
    // 1. 組織とロール・権限（独立したマスタデータ）
    await seedOrganizations();
    await seedRoles();
    await seedPermissions();

    // 2. ロールと権限の関連付け
    await seedRolePermissions();

    // 3. クライアントとユーザー（組織に依存）
    await seedClients();
    await seedUsers();

    // 4. ユーザー・クライアント・ロールの関連付け
    await seedUserClientRoles();

    // 5. 申請データと履歴（ユーザーに依存）
    await seedApplications();
    await seedApplicationHistories();

    // 6. Tasksテーブル（既存データ）
    await seedTasks();

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
