/*
  Warnings:

  - You are about to drop the `user_tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_tasks" DROP CONSTRAINT "user_tasks_task_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_tasks" DROP CONSTRAINT "user_tasks_user_id_fkey";

-- DropTable
DROP TABLE "public"."user_tasks";

-- CreateTable
CREATE TABLE "_TasksToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_TasksToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TasksToUser_B_index" ON "_TasksToUser"("B");

-- AddForeignKey
ALTER TABLE "_TasksToUser" ADD CONSTRAINT "_TasksToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TasksToUser" ADD CONSTRAINT "_TasksToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
