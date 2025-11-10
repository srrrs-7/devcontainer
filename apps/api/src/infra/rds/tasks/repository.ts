import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
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
    prisma.tasks.create({
      data: {
        content: input.content,
        createdAt: dayjs().toDate(),
        updatedAt: dayjs().toDate(),
        users: {
          connect: { id: input.userId },
        },
      },
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

  const updateData: {
    content?: string;
    completedAt?: Date | null;
    updatedAt: Date;
  } = {
    updatedAt: dayjs().toDate(),
  };

  if (input.content !== undefined) {
    updateData.content = input.content;
  }
  if (input.completedAt !== undefined) {
    updateData.completedAt = input.completedAt;
  }

  return ResultAsync.fromPromise(
    prisma.tasks.updateMany({
      where: {
        id: input.taskId,
        users: {
          some: {
            id: input.userId,
          },
        },
      },
      data: updateData,
    }),
    (error) => new DatabaseError(error),
  );
};

export const deleteTask = (
  input: DeleteTaskInput,
): ResultAsync<{ count: number }, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.tasks.deleteMany({
      where: {
        id: input.taskId,
        users: {
          some: {
            id: input.userId,
          },
        },
      },
    }),
    (error) => new DatabaseError(error),
  );
};

export const getTask = (
  input: GetTaskInput,
): ResultAsync<Task | null, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.tasks.findFirst({
      where: {
        id: input.taskId,
        users: {
          some: {
            id: input.userId,
          },
        },
      },
    }),
    (error) => new DatabaseError(error),
  ).map((task): Task | null => {
    if (!task) return null;
    return {
      userId: input.userId,
      taskId: task.id,
      content: task.content,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  });
};

export const listTasks = (
  input: ListTasksInput,
): ResultAsync<Task[], DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.tasks.findMany({
      where: {
        users: {
          some: {
            id: input.userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (input.page - 1) * input.limit,
      take: input.limit,
    }),
    (error) => new DatabaseError(error),
  ).map((tasks): Task[] =>
    tasks.map((task) => ({
      userId: input.userId,
      taskId: task.id,
      content: task.content,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    })),
  );
};
