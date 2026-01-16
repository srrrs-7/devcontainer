import { AuthStatus } from "../../features/auth";
import { TaskList } from "../../features/tasks";

/**
 * Home page route component.
 */
export function Home() {
  return (
    <div className="app">
      <AuthStatus />
      <TaskList />
    </div>
  );
}
