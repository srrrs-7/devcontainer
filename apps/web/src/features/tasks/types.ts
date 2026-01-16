/**
 * Task domain types for the frontend
 * Re-exports from API layer with minimal additional types
 */

// Re-export core types from API
export type { Task, UpdateTaskInput } from "./api/tasks-api";

// Task status type
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// Input type for creating tasks
export type CreateTaskInput = {
  content: string;
};

// Response types - use Task type directly (these are aliases for backward compatibility)
export type {
  Task as CreateTaskResponse,
  Task as GetTaskResponse,
  Task as TaskListItem,
} from "./api/tasks-api";

// Update response type
export type UpdateTaskResponse = {
  count: number;
};

// List response type
export type ListTasksResponse = {
  tasks: import("./api/tasks-api").Task[];
  page: number;
  limit: number;
};

// Alias for backward compatibility
export type TaskListResponse = ListTasksResponse;
