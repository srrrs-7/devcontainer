import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { ResultAsync } from "neverthrow";
import { DatabaseError } from "../../../domain/error/error";
import type {
  CreateTaskInput,
  DeleteTaskInput,
  GetTaskInput,
  ListTasksInput,
  UpdateTaskInput,
} from "../../../domain/task/input";
import { Task } from "../../../domain/task/task";

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
    (task): Task =>
      new Task(
        input.userId,
        task.id,
        task.content,
        task.completedAt,
        task.version,
        task.createdAt,
        task.updatedAt,
      ),
  );
};

export const updateTask = (
  input: UpdateTaskInput,
): ResultAsync<{ count: number }, DatabaseError> => {
  const prisma = getPrisma();

  const updateData: {
    content?: string;
    completedAt?: Date | null;
    version: { increment: number };
    updatedAt: Date;
  } = {
    version: { increment: 1 },
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
        version: input.version,
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
    return new Task(
      input.userId,
      task.id,
      task.content,
      task.completedAt,
      task.version,
      task.createdAt,
      task.updatedAt,
    );
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
    tasks.map(
      (task) =>
        new Task(
          input.userId,
          task.id,
          task.content,
          task.completedAt,
          task.version,
          task.createdAt,
          task.updatedAt,
        ),
    ),
  );
};
