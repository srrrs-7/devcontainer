import { describe, expect, test } from "vitest";
import {
  createTaskBodySchema,
  taskIdParamSchema,
  taskStatusSchema,
  updateTaskBodySchema,
} from "./tasks";

describe("taskIdParamSchema", () => {
  test("validates correct task ID", () => {
    const result = taskIdParamSchema.safeParse({
      id: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(true);
  });

  test("rejects invalid UUID", () => {
    const result = taskIdParamSchema.safeParse({ id: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  test("rejects empty ID", () => {
    const result = taskIdParamSchema.safeParse({ id: "" });
    expect(result.success).toBe(false);
  });

  test("rejects SQL injection", () => {
    const result = taskIdParamSchema.safeParse({
      id: "'; DROP TABLE tasks--",
    });
    expect(result.success).toBe(false);
  });
});

describe("taskStatusSchema", () => {
  test("validates PENDING status", () => {
    const result = taskStatusSchema.safeParse("PENDING");
    expect(result.success).toBe(true);
  });

  test("validates IN_PROGRESS status", () => {
    const result = taskStatusSchema.safeParse("IN_PROGRESS");
    expect(result.success).toBe(true);
  });

  test("validates COMPLETED status", () => {
    const result = taskStatusSchema.safeParse("COMPLETED");
    expect(result.success).toBe(true);
  });

  test("rejects invalid status", () => {
    const result = taskStatusSchema.safeParse("INVALID_STATUS");
    expect(result.success).toBe(false);
  });

  test("rejects lowercase status", () => {
    const result = taskStatusSchema.safeParse("pending");
    expect(result.success).toBe(false);
  });

  test("rejects empty status", () => {
    const result = taskStatusSchema.safeParse("");
    expect(result.success).toBe(false);
  });
});

describe("createTaskBodySchema", () => {
  test("validates complete task creation", () => {
    const result = createTaskBodySchema.safeParse({
      content: "New task content",
      status: "IN_PROGRESS",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe("New task content");
      expect(result.data.status).toBe("IN_PROGRESS");
    }
  });

  test("uses default PENDING status", () => {
    const result = createTaskBodySchema.safeParse({
      content: "New task content",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("PENDING");
    }
  });

  test("trims content whitespace", () => {
    const result = createTaskBodySchema.safeParse({
      content: "  Task with spaces  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe("Task with spaces");
    }
  });

  test("rejects empty content", () => {
    const result = createTaskBodySchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });

  test("rejects content exceeding max length", () => {
    const result = createTaskBodySchema.safeParse({
      content: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  test("rejects invalid status", () => {
    const result = createTaskBodySchema.safeParse({
      content: "Task content",
      status: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  test("rejects content with SQL injection", () => {
    const result = createTaskBodySchema.safeParse({
      content: "'; DROP TABLE tasks--",
    });
    expect(result.success).toBe(false);
  });

  test("rejects content with XSS", () => {
    const result = createTaskBodySchema.safeParse({
      content: "<script>alert('xss')</script>",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskBodySchema", () => {
  test("validates content update only", () => {
    const result = updateTaskBodySchema.safeParse({
      content: "Updated content",
    });
    expect(result.success).toBe(true);
  });

  test("validates status update only", () => {
    const result = updateTaskBodySchema.safeParse({ status: "COMPLETED" });
    expect(result.success).toBe(true);
  });

  test("validates both content and status update", () => {
    const result = updateTaskBodySchema.safeParse({
      content: "Updated content",
      status: "IN_PROGRESS",
    });
    expect(result.success).toBe(true);
  });

  test("rejects empty update (no fields)", () => {
    const result = updateTaskBodySchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("At least one field");
    }
  });

  test("rejects update with only undefined fields", () => {
    const result = updateTaskBodySchema.safeParse({
      content: undefined,
      status: undefined,
    });
    expect(result.success).toBe(false);
  });

  test("trims content whitespace", () => {
    const result = updateTaskBodySchema.safeParse({
      content: "  Updated content  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe("Updated content");
    }
  });

  test("rejects invalid status", () => {
    const result = updateTaskBodySchema.safeParse({ status: "INVALID" });
    expect(result.success).toBe(false);
  });

  test("rejects content with SQL injection", () => {
    const result = updateTaskBodySchema.safeParse({
      content: "'; UPDATE tasks SET status='COMPLETED'--",
    });
    expect(result.success).toBe(false);
  });
});
