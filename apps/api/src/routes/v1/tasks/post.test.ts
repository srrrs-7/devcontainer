import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { beforeEach, describe, expect, test } from "vitest";
import app from "./post";

describe("POST /task", () => {
  let testUserId: string;

  beforeEach(async () => {
    const prisma = getPrisma();
    const timestamp = dayjs().valueOf();
    const random = Math.random().toString(36).substring(7);
    const now = dayjs().toDate();

    // Create test organization and client
    const org = await prisma.organization.create({
      data: {
        name: `Test Org ${timestamp}`,
        createdAt: now,
        updatedAt: now,
      },
    });

    const client = await prisma.client.create({
      data: {
        organizationId: org.id,
        name: `Test Client ${timestamp}`,
        createdAt: now,
        updatedAt: now,
      },
    });

    // Create test user
    const user = await prisma.user.create({
      data: {
        clientId: client.id,
        username: `testuser_${timestamp}_${random}`,
        email: `test_${timestamp}_${random}@example.com`,
        passwordHash: "hashed_password",
        createdAt: now,
        updatedAt: now,
      },
    });
    testUserId = user.id;
  });

  describe("Success cases", () => {
    test("should return 200 and create task with minimal data", async () => {
      const req = new Request("http://localhost/task", {
        method: "POST",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "New task content",
        }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("taskId");
      expect(data).toHaveProperty("userId", testUserId);
      expect(data).toHaveProperty("content", "New task content");
      expect(data).toHaveProperty("completedAt", null);

      // Verify task was created in database
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: data.taskId },
      });
      expect(task).not.toBeNull();
      expect(task?.content).toBe("New task content");
      expect(task?.status).toBe("PENDING");
    });

    test("should ignore status field and always create with PENDING", async () => {
      const req = new Request("http://localhost/task", {
        method: "POST",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "Task with status",
          status: "IN_PROGRESS",
        }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("content", "Task with status");

      // Verify status is always PENDING (status field is ignored)
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: data.taskId },
      });
      expect(task?.status).toBe("PENDING");
    });

    test.each([
      {
        description: "single character",
        content: "A",
        expectedContent: "A",
      },
      {
        description: "maximum length (1000 chars)",
        content: "a".repeat(1000),
        expectedContent: "a".repeat(1000),
      },
      {
        description: "content with whitespace that gets trimmed",
        content: "  Task with spaces  ",
        expectedContent: "Task with spaces",
      },
      {
        description: "content with special characters",
        content: "Task: #1 - Update & Review!",
        expectedContent: "Task: #1 - Update &amp; Review!",
      },
      {
        description: "content with line breaks",
        content: "Line 1\nLine 2\nLine 3",
        expectedContent: "Line 1\nLine 2\nLine 3",
      },
    ])(
      "should create task with $description",
      async ({ content, expectedContent }) => {
        const req = new Request("http://localhost/task", {
          method: "POST",
          headers: {
            "x-user-id": testUserId,
            "content-type": "application/json",
          },
          body: JSON.stringify({ content }),
        });

        const res = await app.request(req);

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.content).toBe(expectedContent);
      },
    );
  });

  describe("Validation errors - body", () => {
    test.each<{
      description: string;
      body: object | null;
      expectedStatus: number;
      expectedMessageContains: string;
    }>([
      {
        description: "missing content field",
        body: {},
        expectedStatus: 400,
        expectedMessageContains: "invalid_type",
      },
      {
        description: "empty content string",
        body: { content: "" },
        expectedStatus: 400,
        expectedMessageContains: "Content cannot be empty",
      },
      {
        description: "content exceeds max length (1001 chars)",
        body: { content: "a".repeat(1001) },
        expectedStatus: 400,
        expectedMessageContains: "must not exceed 1000 characters",
      },
      {
        description: "content with script tag (XSS)",
        body: { content: "<script>alert('xss')</script>" },
        expectedStatus: 400,
        expectedMessageContains: "dangerous script patterns",
      },
      {
        description: "content with javascript: protocol",
        body: { content: "Click here: javascript:alert('xss')" },
        expectedStatus: 400,
        expectedMessageContains: "dangerous script patterns",
      },
      {
        description: "content with onclick event handler",
        body: { content: '<img onclick="alert()" />' },
        expectedStatus: 400,
        expectedMessageContains: "dangerous script patterns",
      },
      {
        description: "invalid status value",
        body: { content: "Valid content", status: "INVALID_STATUS" },
        expectedStatus: 400,
        expectedMessageContains: "Status must be one of",
      },
      {
        description: "null body",
        body: null,
        expectedStatus: 400,
        expectedMessageContains: "Expected object",
      },
      {
        description: "content is not a string",
        body: { content: 123 },
        expectedStatus: 400,
        expectedMessageContains: "Expected string",
      },
      {
        description: "content is an array",
        body: { content: ["array", "content"] },
        expectedStatus: 400,
        expectedMessageContains: "Expected string",
      },
    ])(
      "should return 400 when $description",
      async ({ body, expectedStatus, expectedMessageContains }) => {
        const req = new Request("http://localhost/task", {
          method: "POST",
          headers: {
            "x-user-id": testUserId,
            "content-type": "application/json",
          },
          body: body === null ? "null" : JSON.stringify(body),
        });

        const res = await app.request(req);

        expect(res.status).toBe(expectedStatus);
        const data = await res.json();
        const jsonStr = JSON.stringify(data);
        expect(jsonStr.toLowerCase()).toContain(
          expectedMessageContains.toLowerCase(),
        );
      },
    );
  });

  describe("Validation errors - header", () => {
    test.each<{
      description: string;
      headers: Record<string, string>;
      expectedStatus: number;
      expectedMessageContains: string;
    }>([
      {
        description: "missing x-user-id header",
        headers: { "content-type": "application/json" },
        expectedStatus: 400,
        expectedMessageContains: "invalid_type",
      },
      {
        description: "invalid UUID format in x-user-id",
        headers: {
          "x-user-id": "invalid-uuid",
          "content-type": "application/json",
        },
        expectedStatus: 400,
        expectedMessageContains: "Invalid uuid",
      },
      {
        description: "empty x-user-id header",
        headers: {
          "x-user-id": "",
          "content-type": "application/json",
        },
        expectedStatus: 400,
        expectedMessageContains: "Invalid uuid",
      },
    ])(
      "should return 400 when $description",
      async ({ headers, expectedStatus, expectedMessageContains }) => {
        const req = new Request("http://localhost/task", {
          method: "POST",
          headers,
          body: JSON.stringify({ content: "Valid content" }),
        });

        const res = await app.request(req);

        expect(res.status).toBe(expectedStatus);
        const data = await res.json();
        const jsonStr = JSON.stringify(data);
        expect(jsonStr.toLowerCase()).toContain(
          expectedMessageContains.toLowerCase(),
        );
      },
    );
  });

  describe("Edge cases", () => {
    test("should handle content-type without charset", async () => {
      const req = new Request("http://localhost/task", {
        method: "POST",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({ content: "Task content" }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.content).toBe("Task content");
    });

    test("should handle content-type with charset", async () => {
      const req = new Request("http://localhost/task", {
        method: "POST",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ content: "Task content" }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.content).toBe("Task content");
    });

    test("should handle Unicode characters in content", async () => {
      const req = new Request("http://localhost/task", {
        method: "POST",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({ content: "タスク内容 🚀 émojis" }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.content).toBe("タスク内容 🚀 émojis");
    });

    test("should create multiple tasks for same user", async () => {
      const tasks = await Promise.all([
        app.request(
          new Request("http://localhost/task", {
            method: "POST",
            headers: {
              "x-user-id": testUserId,
              "content-type": "application/json",
            },
            body: JSON.stringify({ content: "Task 1" }),
          }),
        ),
        app.request(
          new Request("http://localhost/task", {
            method: "POST",
            headers: {
              "x-user-id": testUserId,
              "content-type": "application/json",
            },
            body: JSON.stringify({ content: "Task 2" }),
          }),
        ),
      ]);

      expect(tasks[0].status).toBe(200);
      expect(tasks[1].status).toBe(200);

      const data1 = await tasks[0].json();
      const data2 = await tasks[1].json();

      expect(data1.taskId).not.toBe(data2.taskId);
      expect(data1.content).toBe("Task 1");
      expect(data2.content).toBe("Task 2");
    });

    test("should handle malformed JSON", async () => {
      const req = new Request("http://localhost/task", {
        method: "POST",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: "{invalid json",
      });

      const res = await app.request(req);

      expect(res.status).toBe(400);
    });
  });
});
