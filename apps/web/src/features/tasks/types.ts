/**
 * Task domain types for the frontend
 * Types are defined locally and match the API response structure
 */

// Re-export types from tasks-api
export type { Task, UpdateTaskInput } from "./api/tasks-api";

// Task status enum
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// Input types
export type CreateTaskInput = {
  content: string;
};

// Response types (matching API responses)
export type CreateTaskResponse = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: string | null;
  version: number;
  createdAt?: string;
  updatedAt?: string;
};

export type GetTaskResponse = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: string | null;
  version: number;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateTaskResponse = {
  count: number;
};

export type TaskListItem = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: string | null;
  version: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ListTasksResponse = {
  tasks: TaskListItem[];
  page: number;
  limit: number;
};

// Alias for backward compatibility
export type TaskListResponse = ListTasksResponse;
