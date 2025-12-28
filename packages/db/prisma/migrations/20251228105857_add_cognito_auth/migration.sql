-- DropForeignKey
ALTER TABLE "_TasksToUser" DROP CONSTRAINT "_TasksToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "application_histories" DROP CONSTRAINT "application_histories_changed_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_client_roles" DROP CONSTRAINT "user_client_roles_assigned_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_client_roles" DROP CONSTRAINT "user_client_roles_user_id_fkey";

-- AlterTable
ALTER TABLE "_TasksToUser" DROP CONSTRAINT "_TasksToUser_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE VARCHAR(128),
ADD CONSTRAINT "_TasksToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "application_histories" ALTER COLUMN "changed_by_user_id" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "applications" ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "user_client_roles" ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "assigned_by_user_id" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "password_hash",
ADD COLUMN     "name" VARCHAR(255),
ADD COLUMN     "picture" TEXT,
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(128),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_histories" ADD CONSTRAINT "application_histories_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_client_roles" ADD CONSTRAINT "user_client_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_client_roles" ADD CONSTRAINT "user_client_roles_assigned_by_user_id_fkey" FOREIGN KEY ("assigned_by_user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TasksToUser" ADD CONSTRAINT "_TasksToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
