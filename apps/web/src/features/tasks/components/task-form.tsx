import type { Task } from "../api";

type CreateTaskInput = { content: string };

import { type FormEvent, useCallback, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "../../../components/ui";
import { cn } from "../../../lib/utils";

interface TaskFormProps {
  onSubmit: (input: CreateTaskInput) => Promise<Task | null>;
  isSubmitting?: boolean;
}

/**
 * Form component for creating new tasks
 */
export function TaskForm({ onSubmit, isSubmitting = false }: TaskFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const trimmedContent = content.trim();
      if (!trimmedContent) {
        setError("Task content is required");
        return;
      }

      if (trimmedContent.length > 1000) {
        setError("Task content must be 1000 characters or less");
        return;
      }

      setError(null);

      const result = await onSubmit({ content: trimmedContent });

      if (result) {
        setContent("");
      } else {
        setError("Failed to create task");
      }
    },
    [content, onSubmit],
  );

  const isOverLimit = content.length > 1000;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="task-content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter task content..."
              disabled={isSubmitting}
              className={cn(isOverLimit && "border-destructive")}
            />
            <div
              className={cn(
                "text-xs text-right",
                isOverLimit ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {content.length}/1000
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || content.trim() === ""}
          >
            {isSubmitting ? "Creating..." : "Add Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
