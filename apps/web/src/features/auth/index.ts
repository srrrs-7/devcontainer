// Re-export from shared lib for backward compatibility
export { ApiError, useApiClient } from "../../lib/api-client";
export { AuthCallback } from "./AuthCallback";
export { AuthProvider, useAuth } from "./AuthContext";
export { AuthStatus } from "./components/auth-status";
export { ProtectedRoute } from "./ProtectedRoute";
