import type { Task, UpdateTaskInput } from "../api";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

import { useCallback, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui";
import { cn } from "../../../lib/utils";

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, input: UpdateTaskInput) => Promise<boolean>;
  onDelete: (taskId: string) => Promise<boolean>;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const getStatusVariant = (
  status: TaskStatus,
): "default" | "secondary" | "outline" => {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    default:
      return "outline";
  }
};

/**
 * Individual task item component with edit and delete functionality
 */
export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentStatus: TaskStatus = task.completedAt ? "COMPLETED" : "PENDING";

  const handleStatusChange = useCallback(
    async (newStatus: TaskStatus) => {
      setIsUpdating(true);
      await onUpdate(task.taskId, {
        status: newStatus,
        version: task.version,
      });
      setIsUpdating(false);
    },
    [task.taskId, task.version, onUpdate],
  );

  const handleSaveEdit = useCallback(async () => {
    if (editContent.trim() === "") return;

    setIsUpdating(true);
    const success = await onUpdate(task.taskId, {
      content: editContent.trim(),
      version: task.version,
    });

    if (success) {
      setIsEditing(false);
    }
    setIsUpdating(false);
  }, [task.taskId, task.version, editContent, onUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditContent(task.content);
    setIsEditing(false);
  }, [task.content]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    await onDelete(task.taskId);
    setIsDeleting(false);
  }, [task.taskId, onDelete]);

  const isCompleted = task.completedAt !== null;

  return (
    <Card className={cn("mb-3", isCompleted && "bg-muted/50")}>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  disabled={isUpdating}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isUpdating || editContent.trim() === ""}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                type="button"
                className={cn(
                  "text-left cursor-pointer hover:text-primary transition-colors w-full",
                  isCompleted && "line-through text-muted-foreground",
                )}
                onClick={() => setIsEditing(true)}
              >
                {task.content}
              </button>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {task.createdAt && (
                <span>
                  Created: {new Date(task.createdAt).toLocaleString()}
                </span>
              )}
              {task.completedAt && (
                <span>
                  Completed: {new Date(task.completedAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 items-center shrink-0">
            <Badge variant={getStatusVariant(currentStatus)}>
              {currentStatus.replace("_", " ")}
            </Badge>

            <Select
              value={currentStatus}
              onValueChange={(value) => handleStatusChange(value as TaskStatus)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  {isDeleting ? "..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this task? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
