export type Task = {
  userId: string;
  taskId: string;
  content: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTaskInput = {
  userId: string;
  content: string;
};

export type UpdateTaskInput = {
  userId: string;
  taskId: string;
  content?: string;
  completedAt?: Date | null;
};

export type DeleteTaskInput = {
  userId: string;
  taskId: string;
};

export type GetTaskInput = {
  userId: string;
  taskId: string;
};

export type ListTasksInput = {
  userId: string;
};

// Factory functions for creating input types
export const createTaskInput = (
  userId: string,
  content: string,
): CreateTaskInput => ({
  userId,
  content,
});

export const updateTaskInput = (
  userId: string,
  taskId: string,
  data: { content?: string; completedAt?: Date | null },
): UpdateTaskInput => ({
  userId,
  taskId,
  ...data,
});

export const deleteTaskInput = (
  userId: string,
  taskId: string,
): DeleteTaskInput => ({
  userId,
  taskId,
});

export const getTaskInput = (userId: string, taskId: string): GetTaskInput => ({
  userId,
  taskId,
});

export const listTasksInput = (userId: string): ListTasksInput => ({
  userId,
});
