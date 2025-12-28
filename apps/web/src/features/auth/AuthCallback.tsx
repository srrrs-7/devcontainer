import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

/**
 * Component that handles the OAuth callback redirect.
 * Displays a loading state while authentication is being processed.
 */
export function AuthCallback() {
  const { isLoading, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL params (OAuth errors)
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    const errorDescription = params.get("error_description");

    if (errorParam) {
      setError(errorDescription || errorParam);
      return;
    }

    // If authenticated, redirect to home
    if (!isLoading && isAuthenticated) {
      window.location.href = "/";
    }
  }, [isLoading, isAuthenticated]);

  if (error) {
    return (
      <div className="auth-callback">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <a href="/">Return to Home</a>
      </div>
    );
  }

  return (
    <div className="auth-callback">
      <h2>Authenticating...</h2>
      <p>Please wait while we complete your sign-in.</p>
    </div>
  );
}
