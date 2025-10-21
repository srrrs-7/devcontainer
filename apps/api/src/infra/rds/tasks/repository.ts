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
): ResultAsync<{ count: number }, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.tasks.updateMany({
      where: {
        userId: input.userId,
        taskId: input.taskId,
      },
      data: {
        content: input.content,
        completedAt: input.completedAt,
        updatedAt: new Date(),
      },
    }),
    (error) => new DatabaseError(error),
  ).map((result) => ({ count: result.count }));
};

export const deleteTask = (
  input: DeleteTaskInput,
): ResultAsync<{ count: number }, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.tasks.deleteMany({
      where: {
        userId: input.userId,
        taskId: input.taskId,
      },
    }),
    (error) => new DatabaseError(error),
  ).map((result) => ({ count: result.count }));
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
