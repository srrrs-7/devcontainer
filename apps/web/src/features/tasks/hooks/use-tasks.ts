import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ApiError,
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  listTasks as listTasksApi,
  type Task,
  type UpdateTaskInput,
  updateTask as updateTaskApi,
} from "../api";
import { taskKeys } from "./query-keys";
import { useHonoClient } from "./use-hono-client";

type CreateTaskInput = { content: string };

interface UseTasksOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

interface UseTasksResult {
  tasks: Task[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  page: number;
  limit: number;
  refetch: () => void;
  createTask: (input: CreateTaskInput) => Promise<Task | null>;
  updateTask: (taskId: string, input: UpdateTaskInput) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  setPage: (page: number) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

/**
 * Custom hook for managing tasks with CRUD operations using TanStack Query
 */
export function useTasks(options: UseTasksOptions = {}): UseTasksResult {
  const { page: initialPage = 1, limit = 20, enabled = true } = options;

  const client = useHonoClient();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(initialPage);

  // Query for fetching tasks list
  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: taskKeys.list(page, limit),
    queryFn: () => listTasksApi(client, page, limit),
    enabled,
  });

  // Mutation for creating a task
  const createMutation = useMutation({
    mutationFn: (input: CreateTaskInput) =>
      createTaskApi(client, input.content),
    onSuccess: () => {
      // Invalidate and refetch tasks list
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Mutation for updating a task
  const updateMutation = useMutation({
    mutationFn: ({
      taskId,
      input,
    }: {
      taskId: string;
      input: UpdateTaskInput;
    }) => updateTaskApi(client, taskId, input),
    onSuccess: () => {
      // Invalidate and refetch tasks list
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Mutation for deleting a task
  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTaskApi(client, taskId),
    onSuccess: () => {
      // Invalidate and refetch tasks list
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  // Create task wrapper
  const createTask = async (input: CreateTaskInput): Promise<Task | null> => {
    try {
      const result = await createMutation.mutateAsync(input);
      return result;
    } catch {
      return null;
    }
  };

  // Update task wrapper
  const updateTask = async (
    taskId: string,
    input: UpdateTaskInput,
  ): Promise<boolean> => {
    try {
      const result = await updateMutation.mutateAsync({ taskId, input });
      return result.count > 0;
    } catch {
      return false;
    }
  };

  // Delete task wrapper
  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync(taskId);
      return true;
    } catch {
      return false;
    }
  };

  // Extract error message from various error types
  const getErrorMessage = (): string | null => {
    const error =
      queryError ||
      createMutation.error ||
      updateMutation.error ||
      deleteMutation.error;

    if (!error) return null;
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    return "An unexpected error occurred";
  };

  return {
    tasks: data?.tasks ?? [],
    isLoading,
    isFetching,
    error: getErrorMessage(),
    page,
    limit,
    refetch: () => void refetch(),
    createTask,
    updateTask,
    deleteTask,
    setPage,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
