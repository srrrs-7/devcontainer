import { getPrisma } from "@packages/db";
import { ResultAsync } from "neverthrow";
import { DatabaseError, NotFoundError } from "../../../domain/error";
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
        userId: input.userId,
        content: input.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    (error) => new DatabaseError(error),
  ).map(
    (task): Task => ({
      userId: task.userId,
      taskId: task.taskId,
      content: task.content,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }),
  );
};

export const updateTask = (
  input: UpdateTaskInput,
): ResultAsync<Task, NotFoundError | DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.tasks.update({
      where: {
        userId_taskId: {
          userId: input.userId,
          taskId: input.taskId,
        },
      },
      data: {
        content: input.content,
        completedAt: input.completedAt,
        updatedAt: new Date(),
      },
    }),
    (error) => {
      // Prisma throws P2025 error code when record is not found
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2025"
      ) {
        return new NotFoundError(
          `Task not found: userId=${input.userId}, taskId=${input.taskId}`,
        );
      }
      return new DatabaseError(error);
    },
  ).map(
    (task): Task => ({
      userId: task.userId,
      taskId: task.taskId,
      content: task.content,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }),
  );
};

export const deleteTask = (
  input: DeleteTaskInput,
): ResultAsync<Task, NotFoundError | DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.tasks.delete({
      where: {
        userId_taskId: {
          userId: input.userId,
          taskId: input.taskId,
        },
      },
    }),
    (error) => {
      // Prisma throws P2025 error code when record is not found
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2025"
      ) {
        return new NotFoundError(
          `Task not found: userId=${input.userId}, taskId=${input.taskId}`,
        );
      }
      return new DatabaseError(error);
    },
  ).map(
    (task): Task => ({
      userId: task.userId,
      taskId: task.taskId,
      content: task.content,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }),
  );
};

export const getTask = (
  input: GetTaskInput,
): ResultAsync<Task | null, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.tasks.findUnique({
      where: {
        userId_taskId: {
          userId: input.userId,
          taskId: input.taskId,
        },
      },
    }),
    (error) => new DatabaseError(error),
  ).map((task): Task | null => {
    if (!task) return null;
    return {
      userId: task.userId,
      taskId: task.taskId,
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
        userId: input.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    (error) => new DatabaseError(error),
  ).map((tasks): Task[] =>
    tasks.map((task) => ({
      userId: task.userId,
      taskId: task.taskId,
      content: task.content,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    })),
  );
};
