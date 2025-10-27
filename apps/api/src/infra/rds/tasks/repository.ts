import { getPrisma } from "@packages/db";
import { ResultAsync } from "neverthrow";
import { DatabaseError } from "../../../domain/error";
import type {
  CreateTaskInput,
  DeleteTaskInput,
  GetTaskInput,
  ListTasksInput,
  Task,
  UpdateTaskInput,
} from "../../../domain/model/task";

export const createTask = (
  input: CreateTaskInput,
): ResultAsync<Task, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.$transaction(async (tx) => {
      // Tasksを作成
      const task = await tx.tasks.create({
        data: {
          content: input.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // UserTaskを作成してTaskと関連付け
      await tx.userTask.create({
        data: {
          userId: input.userId,
          taskId: task.id,
        },
      });

      return task;
    }),
    (error) => new DatabaseError(error),
  ).map(
    (task): Task => ({
      userId: input.userId,
      taskId: task.id,
      content: task.content,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }),
  );
};

export const updateTask = (
  input: UpdateTaskInput,
): ResultAsync<{ count: number }, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.$transaction(async (tx) => {
      // UserTaskが存在するか確認
      const userTask = await tx.userTask.findUnique({
        where: {
          userId_taskId: {
            userId: input.userId,
            taskId: input.taskId,
          },
        },
      });

      if (!userTask) {
        return { count: 0 };
      }

      // Tasksを更新
      const updateData: {
        content?: string;
        completedAt?: Date | null;
        updatedAt: Date;
      } = {
        updatedAt: new Date(),
      };

      if (input.content !== undefined) {
        updateData.content = input.content;
      }
      if (input.completedAt !== undefined) {
        updateData.completedAt = input.completedAt;
      }

      await tx.tasks.update({
        where: {
          id: input.taskId,
        },
        data: updateData,
      });

      return { count: 1 };
    }),
    (error) => new DatabaseError(error),
  );
};

export const deleteTask = (
  input: DeleteTaskInput,
): ResultAsync<{ count: number }, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.$transaction(async (tx) => {
      // UserTaskを削除
      const result = await tx.userTask.deleteMany({
        where: {
          userId: input.userId,
          taskId: input.taskId,
        },
      });

      // UserTaskが削除された場合、Tasksも削除
      if (result.count > 0) {
        // 他のUserTaskが存在しないか確認
        const otherUserTasks = await tx.userTask.count({
          where: {
            taskId: input.taskId,
          },
        });

        // 他のユーザーがこのタスクを持っていなければTasksも削除
        if (otherUserTasks === 0) {
          await tx.tasks.delete({
            where: {
              id: input.taskId,
            },
          });
        }
      }

      return { count: result.count };
    }),
    (error) => new DatabaseError(error),
  );
};

export const getTask = (
  input: GetTaskInput,
): ResultAsync<Task | null, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: input.userId,
          taskId: input.taskId,
        },
      },
      include: {
        task: true,
      },
    }),
    (error) => new DatabaseError(error),
  ).map((userTask): Task | null => {
    if (!userTask) return null;
    return {
      userId: userTask.userId,
      taskId: userTask.task.id,
      content: userTask.task.content,
      completedAt: userTask.task.completedAt,
      createdAt: userTask.task.createdAt,
      updatedAt: userTask.task.updatedAt,
    };
  });
};

export const listTasks = (
  input: ListTasksInput,
): ResultAsync<Task[], DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.userTask.findMany({
      where: {
        userId: input.userId,
      },
      include: {
        task: true,
      },
      orderBy: {
        task: {
          createdAt: "desc",
        },
      },
    }),
    (error) => new DatabaseError(error),
  ).map((userTasks): Task[] =>
    userTasks.map((userTask) => ({
      userId: userTask.userId,
      taskId: userTask.task.id,
      content: userTask.task.content,
      completedAt: userTask.task.completedAt,
      createdAt: userTask.task.createdAt,
      updatedAt: userTask.task.updatedAt,
    })),
  );
};
