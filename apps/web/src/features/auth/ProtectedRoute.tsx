import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that protects its children from unauthenticated users.
 * Shows loading state while checking authentication.
 * Shows fallback (or default login prompt) if not authenticated.
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, isConfigured, login } = useAuth();

  // If auth is not configured, render children anyway (development mode)
  if (!isConfigured) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="auth-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please sign in to access this page.</p>
        <button type="button" onClick={() => login()}>
          Sign In
        </button>
        <button type="button" onClick={() => login("Google")}>
          Sign In with Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
