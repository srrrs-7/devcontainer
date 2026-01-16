/**
 * Task status enum
 */
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

/**
 * Task entity from API
 */
export interface Task {
  taskId: string;
  userId: string;
  content: string;
  completedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response for GET /v1/task/:id
 */
export interface GetTaskResponse {
  taskId: string;
  userId: string;
  content: string;
  completedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response item for GET /v1/tasks
 */
export interface TaskListItem {
  taskId: string;
  userId: string;
  content: string;
  completedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response for GET /v1/tasks
 */
export interface ListTasksResponse {
  tasks: TaskListItem[];
  page: number;
  limit: number;
}

/**
 * Request body for POST /v1/task
 */
export interface CreateTaskInput {
  content: string;
}

/**
 * Response for POST /v1/task
 */
export interface CreateTaskResponse {
  taskId: string;
  userId: string;
  content: string;
  completedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request body for PUT /v1/task/:id
 */
export interface UpdateTaskInput {
  content?: string;
  status?: TaskStatus;
  version: number;
}

/**
 * Response for PUT /v1/task/:id
 */
export interface UpdateTaskResponse {
  count: number;
}
