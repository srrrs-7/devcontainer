/*
  Warnings:

  - The primary key for the `role_permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `tasks` table. All the data in the column will be lost.
  - The primary key for the `user_client_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_client_role_id` on the `user_client_roles` table. All the data in the column will be lost.
  - You are about to drop the column `task_user_id` on the `user_tasks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[role_id,permission_id]` on the table `role_permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,task_id]` on the table `user_tasks` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `role_permissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `user_client_roles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."clients" DROP CONSTRAINT "clients_parent_client_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_tasks" DROP CONSTRAINT "user_tasks_task_user_id_task_id_fkey";

-- DropIndex
DROP INDEX "public"."user_tasks_task_user_id_task_id_idx";

-- DropIndex
DROP INDEX "public"."user_tasks_user_id_task_user_id_task_id_key";

-- AlterTable
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_pkey",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_pkey",
DROP COLUMN "user_id",
ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("task_id");

-- AlterTable
ALTER TABLE "user_client_roles" DROP CONSTRAINT "user_client_roles_pkey",
DROP COLUMN "user_client_role_id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "user_client_roles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_tasks" DROP COLUMN "task_user_id";

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "user_tasks_task_id_idx" ON "user_tasks"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_tasks_user_id_task_id_key" ON "user_tasks"("user_id", "task_id");

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_parent_client_id_fkey" FOREIGN KEY ("parent_client_id") REFERENCES "clients"("client_id") ON DELETE SET NULL ON UPDATE CASCADE;
