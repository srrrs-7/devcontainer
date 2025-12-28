import { useMemo } from "react";
import { AuthCallback } from "../features/auth";
import { Home } from "./routes/home";

/**
 * Simple path-based router for the application.
 * Uses window.location.pathname for client-side routing.
 */
export function AppRouter() {
  const path = useMemo(() => window.location.pathname, []);

  // Route matching
  switch (path) {
    case "/auth/callback":
      return <AuthCallback />;
    default:
      return <Home />;
  }
}
