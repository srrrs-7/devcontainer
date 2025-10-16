import { getPrisma } from "../../src";
import { seedTasks } from "./tasks";

async function main() {
  const prisma = getPrisma();

  console.log("🌱 Starting database seeding...");

  try {
    // Tasksテーブルのシードデータを投入
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
