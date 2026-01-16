// Re-export API functions

// Re-export shared types from lib
export { type ApiClient, ApiError } from "../../../lib/api-client";
export {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  type Task,
  type UpdateTaskInput,
  updateTask,
} from "./tasks-api";
