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
 * Extract error message from various API error response formats
 */
const extractErrorMessage = (error: unknown): string => {
  if (Array.isArray(error) && error.length > 0) {
    // Zod validation issues array
    const firstIssue = error[0];
    if (
      firstIssue &&
      typeof firstIssue === "object" &&
      "message" in firstIssue
    ) {
      return String(firstIssue.message);
    }
    return "Validation error";
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "Unknown error";
};

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
export const getTask = async (
  client: ApiClient,
  taskId: string,
): Promise<Task> => {
  const res = await client.v1.task[":id"].$get({ param: { id: taskId } });

  switch (res.status) {
    case 200: {
      const data = await res.json();
      return data as Task;
    }
    case 400: {
      const error = await res.json();
      throw new ApiError(400, extractErrorMessage(error), error);
    }
    case 404: {
      const error = await res.json();
      throw new ApiError(404, extractErrorMessage(error), error);
    }
    case 500: {
      const error = await res.json();
      throw new ApiError(500, extractErrorMessage(error), error);
    }
    default: {
      res satisfies never;
      throw new ApiError(500, "Unexpected error");
    }
  }
};

/**
 * Fetch a paginated list of tasks
 */
export const listTasks = async (
  client: ApiClient,
  page = 1,
  limit = 20,
): Promise<{ tasks: Task[]; page: number; limit: number }> => {
  const res = await client.v1.tasks.$get({
    query: { page: String(page), limit: String(limit) },
  });

  switch (res.status) {
    case 200: {
      const data = await res.json();
      return data as { tasks: Task[]; page: number; limit: number };
    }
    case 400: {
      const error = await res.json();
      throw new ApiError(400, extractErrorMessage(error), error);
    }
    case 500: {
      const error = await res.json();
      throw new ApiError(500, extractErrorMessage(error), error);
    }
    default: {
      res satisfies never;
      throw new ApiError(500, "Unexpected error");
    }
  }
};

/**
 * Create a new task
 */
export const createTask = async (
  client: ApiClient,
  content: string,
): Promise<Task> => {
  const res = await client.v1.task.$post({ json: { content } });

  switch (res.status) {
    case 200: {
      const data = await res.json();
      return data as Task;
    }
    case 400: {
      const error = await res.json();
      throw new ApiError(400, extractErrorMessage(error), error);
    }
    case 500: {
      const error = await res.json();
      throw new ApiError(500, extractErrorMessage(error), error);
    }
    default: {
      res satisfies never;
      throw new ApiError(500, "Unexpected error");
    }
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (
  client: ApiClient,
  taskId: string,
  input: UpdateTaskInput,
): Promise<{ count: number }> => {
  const res = await client.v1.task[":id"].$put({
    param: { id: taskId },
    json: input,
  });

  switch (res.status) {
    case 200: {
      const data = await res.json();
      return data as { count: number };
    }
    case 400: {
      const error = await res.json();
      throw new ApiError(400, extractErrorMessage(error), error);
    }
    case 500: {
      const error = await res.json();
      throw new ApiError(500, extractErrorMessage(error), error);
    }
    default: {
      res satisfies never;
      throw new ApiError(500, "Unexpected error");
    }
  }
};

/**
 * Delete a task by ID
 */
export const deleteTask = async (
  client: ApiClient,
  taskId: string,
): Promise<void> => {
  const res = await client.v1.task[":id"].$delete({ param: { id: taskId } });

  switch (res.status) {
    case 204: {
      return;
    }
    case 400: {
      const error = await res.json();
      throw new ApiError(400, extractErrorMessage(error), error);
    }
    case 404: {
      const error = await res.json();
      throw new ApiError(404, extractErrorMessage(error), error);
    }
    case 500: {
      const error = await res.json();
      throw new ApiError(500, extractErrorMessage(error), error);
    }
    default: {
      res satisfies never;
      throw new ApiError(500, "Unexpected error");
    }
  }
};
