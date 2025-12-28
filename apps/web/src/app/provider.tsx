import type { ReactNode } from "react";
import { AuthProvider } from "../features/auth";

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Application-level provider that wraps all providers.
 * Add new providers here to make them available throughout the app.
 */
export function AppProvider({ children }: AppProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
