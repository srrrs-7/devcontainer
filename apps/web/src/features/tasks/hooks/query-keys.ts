/**
 * Query keys for TanStack Query
 * Following the query key factory pattern for type-safe and organized keys
 */

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...taskKeys.lists(), { page, limit }] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (taskId: string) => [...taskKeys.details(), taskId] as const,
};
