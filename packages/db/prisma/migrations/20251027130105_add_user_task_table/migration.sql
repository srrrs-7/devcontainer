-- CreateTable
CREATE TABLE "user_tasks" (
    "user_task_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "task_user_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tasks_pkey" PRIMARY KEY ("user_task_id")
);

-- CreateIndex
CREATE INDEX "user_tasks_user_id_idx" ON "user_tasks"("user_id");

-- CreateIndex
CREATE INDEX "user_tasks_task_user_id_task_id_idx" ON "user_tasks"("task_user_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_tasks_user_id_task_user_id_task_id_key" ON "user_tasks"("user_id", "task_user_id", "task_id");

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_task_user_id_task_id_fkey" FOREIGN KEY ("task_user_id", "task_id") REFERENCES "tasks"("user_id", "task_id") ON DELETE CASCADE ON UPDATE CASCADE;
