import { useMemo } from "react";
import { useAuth } from "../../auth/AuthContext";
import { type ApiClient, createApiClient } from "../api";

/**
 * Hook that provides an authenticated Hono API client
 */
export function useHonoClient(): ApiClient {
  const { getAccessToken, isConfigured } = useAuth();

  const client = useMemo(() => {
    return createApiClient(async () => {
      if (!isConfigured) return null;
      return getAccessToken();
    });
  }, [getAccessToken, isConfigured]);

  return client;
}
