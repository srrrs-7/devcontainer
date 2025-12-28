import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { beforeEach, describe, expect, test } from "vitest";
import { createTestApp, setTestUser } from "../../../../__test__/setup";
import routeHandler from "./post";

const app = createTestApp(routeHandler);

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

    // Create test user with explicit ID (simulating Cognito sub)
    testUserId = crypto.randomUUID();
    await prisma.user.create({
      data: {
        id: testUserId,
        clientId: client.id,
        username: `testuser_${timestamp}_${random}`,
        email: `test_${timestamp}_${random}@example.com`,
        createdAt: now,
        updatedAt: now,
      },
    });

    // Set the test user for auth middleware mock
    setTestUser({ userId: testUserId });
  });

  describe("200 OK", () => {
    test.each<{
      name: string;
      content: string;
      expectedContent: string;
      extraBody?: Record<string, unknown>;
      contentType?: string;
    }>([
      {
        name: "creates task with minimal data",
        content: "New task content",
        expectedContent: "New task content",
      },
      {
        name: "creates task with single character",
        content: "A",
        expectedContent: "A",
      },
      {
        name: "creates task with maximum length (1000 chars)",
        content: "a".repeat(1000),
        expectedContent: "a".repeat(1000),
      },
      {
        name: "trims whitespace from content",
        content: "  Task with spaces  ",
        expectedContent: "Task with spaces",
      },
      {
        name: "escapes special characters",
        content: "Task: #1 - Update & Review!",
        expectedContent: "Task: #1 - Update &amp; Review!",
      },
      {
        name: "preserves line breaks",
        content: "Line 1\nLine 2\nLine 3",
        expectedContent: "Line 1\nLine 2\nLine 3",
      },
      {
        name: "preserves Unicode characters",
        content: "タスク内容 🚀 émojis",
        expectedContent: "タスク内容 🚀 émojis",
      },
      {
        name: "ignores status field and creates with PENDING",
        content: "Task with status",
        expectedContent: "Task with status",
        extraBody: { status: "IN_PROGRESS" },
      },
      {
        name: "handles content-type with charset",
        content: "Task content",
        expectedContent: "Task content",
        contentType: "application/json; charset=utf-8",
      },
    ])("$name", async ({
      content,
      expectedContent,
      extraBody,
      contentType,
    }) => {
      const req = new Request("http://localhost/task", {
        method: "POST",
        headers: {
          "content-type": contentType ?? "application/json",
        },
        body: JSON.stringify({ content, ...extraBody }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("taskId");
      expect(data).toHaveProperty("userId", testUserId);
      expect(data).toHaveProperty("content", expectedContent);
      expect(data).toHaveProperty("completedAt", null);

      // Verify task was created in database with PENDING status
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: data.taskId },
      });
      expect(task).not.toBeNull();
      expect(task?.content).toBe(expectedContent);
      expect(task?.status).toBe("PENDING");
    });

    test("creates multiple tasks for same user", async () => {
      const tasks = await Promise.all([
        app.request(
          new Request("http://localhost/task", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ content: "Task 1" }),
          }),
        ),
        app.request(
          new Request("http://localhost/task", {
            method: "POST",
            headers: { "content-type": "application/json" },
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
  });

  describe("400 Bad Request", () => {
    test.each<{
      name: string;
      body: unknown;
      expectedMessage: string;
    }>([
      {
        name: "missing content field",
        body: {},
        expectedMessage: "invalid_type",
      },
      {
        name: "empty content string",
        body: { content: "" },
        expectedMessage: "content cannot be empty",
      },
      {
        name: "content exceeds max length (1001 chars)",
        body: { content: "a".repeat(1001) },
        expectedMessage: "must not exceed 1000 characters",
      },
      {
        name: "content with script tag (XSS)",
        body: { content: "<script>alert('xss')</script>" },
        expectedMessage: "dangerous script patterns",
      },
      {
        name: "content with javascript: protocol",
        body: { content: "Click here: javascript:alert('xss')" },
        expectedMessage: "dangerous script patterns",
      },
      {
        name: "content with onclick event handler",
        body: { content: '<img onclick="alert()" />' },
        expectedMessage: "dangerous script patterns",
      },
      {
        name: "invalid status value",
        body: { content: "Valid content", status: "INVALID_STATUS" },
        expectedMessage: "status must be one of",
      },
      {
        name: "null body",
        body: null,
        expectedMessage: "expected object",
      },
      {
        name: "content is not a string",
        body: { content: 123 },
        expectedMessage: "expected string",
      },
      {
        name: "content is an array",
        body: { content: ["array", "content"] },
        expectedMessage: "expected string",
      },
      {
        name: "malformed JSON",
        body: "{invalid json",
        expectedMessage: "", // Any error is acceptable for malformed JSON
      },
    ])("$name", async ({ body, expectedMessage }) => {
      const isMalformedJson = typeof body === "string";
      const req = new Request("http://localhost/task", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: isMalformedJson ? body : JSON.stringify(body),
      });

      const res = await app.request(req);

      expect(res.status).toBe(400);
      if (expectedMessage) {
        const data = await res.json();
        expect(JSON.stringify(data).toLowerCase()).toContain(expectedMessage);
      }
    });
  });
});
