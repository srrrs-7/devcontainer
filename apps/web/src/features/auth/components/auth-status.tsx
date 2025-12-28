import { useAuth } from "../AuthContext";

/**
 * Authentication status component.
 * Displays current user info or login buttons.
 */
export function AuthStatus() {
  const { isConfigured, isLoading, isAuthenticated, user, login, logout } =
    useAuth();

  if (!isConfigured) {
    return (
      <div className="auth-status">
        <p>Auth not configured (development mode)</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="auth-status">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="auth-status">
        <p>Signed in as: {user.email || user.username}</p>
        <button type="button" onClick={logout}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-status">
      <button type="button" onClick={() => login()}>
        Sign In
      </button>
      <button type="button" onClick={() => login("Google")}>
        Sign In with Google
      </button>
    </div>
  );
}
