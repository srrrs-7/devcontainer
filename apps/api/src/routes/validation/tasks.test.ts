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

  test.each([
    { id: "not-a-uuid", description: "invalid UUID" },
    { id: "", description: "empty ID" },
    { id: "'; DROP TABLE tasks--", description: "SQL injection" },
  ])("rejects $description", ({ id }) => {
    const result = taskIdParamSchema.safeParse({ id });
    expect(result.success).toBe(false);
  });
});

describe("taskStatusSchema", () => {
  test.each([
    { status: "PENDING", description: "PENDING status" },
    { status: "IN_PROGRESS", description: "IN_PROGRESS status" },
    { status: "COMPLETED", description: "COMPLETED status" },
  ])("validates $description", ({ status }) => {
    const result = taskStatusSchema.safeParse(status);
    expect(result.success).toBe(true);
  });

  test.each([
    { status: "INVALID_STATUS", description: "invalid status" },
    { status: "pending", description: "lowercase status" },
    { status: "", description: "empty status" },
  ])("rejects $description", ({ status }) => {
    const result = taskStatusSchema.safeParse(status);
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

  test.each([
    { input: { content: "" }, description: "empty content" },
    {
      input: { content: "a".repeat(1001) },
      description: "content exceeding max length",
    },
    {
      input: { content: "Task content", status: "INVALID" },
      description: "invalid status",
    },
    {
      input: { content: "<script>alert('xss')</script>" },
      description: "content with XSS",
    },
  ])("rejects $description", ({ input }) => {
    const result = createTaskBodySchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe("updateTaskBodySchema", () => {
  test.each([
    {
      input: { content: "Updated content" },
      description: "content update only",
    },
    { input: { status: "COMPLETED" }, description: "status update only" },
    {
      input: { content: "Updated content", status: "IN_PROGRESS" },
      description: "both content and status update",
    },
  ])("validates $description", ({ input }) => {
    const result = updateTaskBodySchema.safeParse(input);
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

  test.each([{ input: { status: "INVALID" }, description: "invalid status" }])(
    "rejects $description",
    ({ input }) => {
      const result = updateTaskBodySchema.safeParse(input);
      expect(result.success).toBe(false);
    },
  );
});
