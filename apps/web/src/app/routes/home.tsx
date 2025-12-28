import bunLogo from "../../assets/logo.svg";
import reactLogo from "../../assets/react.svg";
import { AuthStatus } from "../../features/auth";
import { APITester } from "../../features/misc";

/**
 * Home page route component.
 */
export function Home() {
  return (
    <div className="app">
      <div className="logo-container">
        <img src={bunLogo} alt="Bun Logo" className="logo bun-logo" />
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
