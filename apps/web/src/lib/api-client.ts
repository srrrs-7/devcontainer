/**
 * Shared Hono RPC API client
 * Provides type-safe API calls with automatic authentication
 */

import type { AppType } from "api/src/index";
import { hc, type InferResponseType } from "hono/client";
import { useMemo } from "react";
import { useAuth } from "../features/auth/AuthContext";

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
 * Hook that provides an authenticated Hono API client
 */
export function useApiClient(): ApiClient {
  const { getAccessToken, isConfigured } = useAuth();

  return useMemo(() => {
    return createApiClient(async () => {
      if (!isConfigured) return null;
      return getAccessToken();
    });
  }, [getAccessToken, isConfigured]);
}

/**
 * API Error class for handling API errors
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
export const extractErrorMessage = (error: unknown): string => {
  if (Array.isArray(error) && error.length > 0) {
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

// Re-export Hono types for convenience
export type { InferResponseType };
