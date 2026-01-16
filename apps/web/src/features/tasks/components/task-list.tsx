import { Button, Card, CardContent } from "../../../components/ui";
import { useTasks } from "../hooks";
import { TaskForm } from "./task-form";
import { TaskItem } from "./task-item";

/**
 * Main task list component that displays all tasks with CRUD operations
 * Uses TanStack Query for data fetching and caching
 */
export function TaskList() {
  const {
    tasks,
    isLoading,
    isFetching,
    error,
    page,
    limit,
    refetch,
    createTask,
    updateTask,
    deleteTask,
    setPage,
    isCreating,
  } = useTasks();

  const isRefreshing = isFetching && !isLoading;

  return (
    <div className="max-w-3xl mx-auto p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">
          Tasks
          {isRefreshing && (
            <span className="ml-2 text-sm text-muted-foreground font-normal">
              (Syncing...)
            </span>
          )}
        </h2>
        <Button variant="outline" onClick={refetch} disabled={isFetching}>
          {isFetching ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <TaskForm onSubmit={createTask} isSubmitting={isCreating} />

      {error && (
        <Card className="mb-4 border-destructive">
          <CardContent className="pt-4 text-destructive">{error}</CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Loading tasks...
          </CardContent>
        </Card>
      ) : tasks.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="py-10 text-center text-muted-foreground">
            No tasks yet. Create your first task above!
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.taskId}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-5 pt-4 border-t">
            <Button
              variant={page <= 1 ? "outline" : "default"}
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1 || isFetching}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page} (showing {tasks.length} of max {limit})
            </span>

            <Button
              variant={tasks.length < limit ? "outline" : "default"}
              onClick={() => setPage(page + 1)}
              disabled={tasks.length < limit || isFetching}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
