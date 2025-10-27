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
