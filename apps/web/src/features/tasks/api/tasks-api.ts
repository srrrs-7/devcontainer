/**
 * Task API functions using Hono RPC Client
 * Type-safe API calls with automatic type inference from API routes
 */

import type { AppType } from "api/src/index";
import { hc } from "hono/client";

// API base URL from environment
const API_URL = import.meta.env?.BUN_PUBLIC_API_URL || "";

/**
 * Create a type-safe Hono client with authentication
 */
export const createApiClient = (
  getAccessToken: () => Promise<string | null>,
) => {
  return hc<AppType>(API_URL, {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = await getAccessToken();
      const headers = new Headers(init?.headers);
      headers.set("Content-Type", "application/json");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return fetch(input, { ...init, headers });
    },
  });
};

/**
 * Type alias for the Hono client
 */
export type ApiClient = ReturnType<typeof createApiClient>;

/**
 * Extract success data from Hono client response
 */
async function extractData<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, error?.message || res.statusText, error);
  }
  return res.json() as Promise<T>;
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Task type (inferred from API response structure)
 */
export type Task = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: string | null;
  version: number;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateTaskInput = {
  content?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  version: number;
};

/**
 * Fetch a single task by ID
 */
export const getTask = async (client: ApiClient, taskId: string) => {
  const res = await client.v1.task[":id"].$get({ param: { id: taskId } });
  return extractData<Task>(res);
};

/**
 * Fetch a paginated list of tasks
 */
export const listTasks = async (client: ApiClient, page = 1, limit = 20) => {
  const res = await client.v1.tasks.$get({
    query: { page: String(page), limit: String(limit) },
  });
  return extractData<{ tasks: Task[]; page: number; limit: number }>(res);
};

/**
 * Create a new task
 */
export const createTask = async (client: ApiClient, content: string) => {
  const res = await client.v1.task.$post({ json: { content } });
  return extractData<Task>(res);
};

/**
 * Update an existing task
 */
export const updateTask = async (
  client: ApiClient,
  taskId: string,
  input: UpdateTaskInput,
) => {
  const res = await client.v1.task[":id"].$put({
    param: { id: taskId },
    json: input,
  });
  return extractData<{ count: number }>(res);
};

/**
 * Delete a task by ID
 */
export const deleteTask = async (client: ApiClient, taskId: string) => {
  const res = await client.v1.task[":id"].$delete({ param: { id: taskId } });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(
      res.status,
      (error as { message?: string })?.message || res.statusText,
      error,
    );
  }
};
