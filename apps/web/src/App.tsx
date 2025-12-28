import { APITester } from "./APITester";
import { AuthCallback, useAuth } from "./features/auth";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

function AuthStatus() {
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

function MainContent() {
  return (
    <div className="app">
      <div className="logo-container">
        <img src={logo} alt="Bun Logo" className="logo bun-logo" />
        <img src={reactLogo} alt="React Logo" className="logo react-logo" />
      </div>

      <h1>Bun + React</h1>
      <AuthStatus />
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
      <APITester />
    </div>
  );
}

export function App() {
  // Simple client-side routing for auth callback
  const path = window.location.pathname;

  if (path === "/auth/callback") {
    return <AuthCallback />;
  }

  return <MainContent />;
}

export default App;
