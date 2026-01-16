import { useCallback } from "react";
import { useAuth } from "./AuthContext";

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

/**
 * Hook that provides an authenticated API client.
 * Automatically attaches Bearer token to requests when available.
 */
export function useApiClient() {
  const { getAccessToken, isConfigured } = useAuth();

  const apiUrl = import.meta.env?.BUN_PUBLIC_API_URL || "";

  const request = useCallback(
    async <T>(path: string, options?: RequestOptions): Promise<T> => {
      const headers = new Headers(options?.headers);
      headers.set("Content-Type", "application/json");

      // Add auth token if configured
      if (isConfigured) {
        const token = await getAccessToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      const url = apiUrl ? `${apiUrl}${path}` : path;
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          response.status,
          errorData?.message || response.statusText,
          errorData,
        );
      }

      return response.json();
    },
    [getAccessToken, isConfigured],
  );

  const get = useCallback(
    <T>(path: string, options?: Omit<RequestOptions, "method">) =>
      request<T>(path, { ...options, method: "GET" }),
    [request],
  );

  const post = useCallback(
    <T>(
      path: string,
      body?: unknown,
      options?: Omit<RequestOptions, "method" | "body">,
    ) =>
      request<T>(path, {
        ...options,
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      }),
    [request],
  );

  const put = useCallback(
    <T>(
      path: string,
      body?: unknown,
      options?: Omit<RequestOptions, "method" | "body">,
    ) =>
      request<T>(path, {
        ...options,
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      }),
    [request],
  );

  const del = useCallback(
    <T>(path: string, options?: Omit<RequestOptions, "method">) =>
      request<T>(path, { ...options, method: "DELETE" }),
    [request],
  );

  return { request, get, post, put, del };
}

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
