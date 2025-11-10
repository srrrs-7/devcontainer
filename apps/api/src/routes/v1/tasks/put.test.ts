import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { beforeEach, describe, expect, test } from "vitest";
import app from "./put";

describe("PUT /task/:id", () => {
  let testUserId: string;
  let testTaskId: string;

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

    // Create test task
    const task = await prisma.tasks.create({
      data: {
        content: "Original task content",
        createdAt: now,
        updatedAt: now,
        users: {
          connect: { id: testUserId },
        },
      },
    });
    testTaskId = task.id;
  });

  describe("Success cases", () => {
    test("should return 200 and update task content only", async () => {
      const req = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "Updated task content",
        }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("count", 1);

      // Verify task was updated in database
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task?.content).toBe("Updated task content");
      expect(task?.status).toBe("PENDING");
      expect(task?.completedAt).toBeNull();
    });

    test("should update task status to COMPLETED and set completedAt", async () => {
      const req = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          status: "COMPLETED",
        }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("count", 1);

      // Verify task was updated in database
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task?.content).toBe("Original task content");
      expect(task?.completedAt).not.toBeNull();
      expect(task?.completedAt).toBeInstanceOf(Date);
    });

    test("should update both content and status", async () => {
      const req = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "Updated and completed",
          status: "COMPLETED",
        }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("count", 1);

      // Verify task was updated in database
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task?.content).toBe("Updated and completed");
      expect(task?.completedAt).not.toBeNull();
    });

    test.each([
      {
        description: "status to IN_PROGRESS",
        body: { status: "IN_PROGRESS" },
        expectedCompletedAt: null,
      },
      {
        description: "status to PENDING",
        body: { status: "PENDING" },
        expectedCompletedAt: null,
      },
    ])(
      "should update $description and clear completedAt",
      async ({ body, expectedCompletedAt }) => {
        const req = new Request(`http://localhost/task/${testTaskId}`, {
          method: "PUT",
          headers: {
            "x-user-id": testUserId,
            "content-type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const res = await app.request(req);

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.count).toBe(1);

        // Verify completedAt was cleared
        const prisma = getPrisma();
        const task = await prisma.tasks.findUnique({
          where: { id: testTaskId },
        });
        expect(task?.completedAt).toBe(expectedCompletedAt);
      },
    );

    test("should return count 0 when task does not exist", async () => {
      const req = new Request(
        "http://localhost/task/123e4567-e89b-42d3-8456-426614174000",
        {
          method: "PUT",
          headers: {
            "x-user-id": testUserId,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            content: "Updated content",
          }),
        },
      );

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("count", 0);
    });

    test("should return count 0 when task belongs to different user", async () => {
      const req = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: {
          "x-user-id": "123e4567-e89b-42d3-8456-426614174001",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "Updated content",
        }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("count", 0);
    });
  });

  describe("Validation errors - param", () => {
    test.each([
      {
        description: "invalid UUID format",
        taskId: "invalid-uuid",
        expectedStatus: 400,
        expectedMessageContains: "Invalid uuid",
      },
      {
        description: "non-UUID string",
        taskId: "not-a-uuid-at-all",
        expectedStatus: 400,
        expectedMessageContains: "Invalid uuid",
      },
    ])(
      "should return 400 when taskId is $description",
      async ({ taskId, expectedStatus, expectedMessageContains }) => {
        const req = new Request(`http://localhost/task/${taskId}`, {
          method: "PUT",
          headers: {
            "x-user-id": testUserId,
            "content-type": "application/json",
          },
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

  describe("Validation errors - body", () => {
    test.each<{
      description: string;
      body: object;
      expectedStatus: number;
      expectedMessageContains: string;
    }>([
      {
        description: "empty body (no fields)",
        body: {},
        expectedStatus: 400,
        expectedMessageContains: "At least one field",
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
        description: "invalid status value",
        body: { status: "INVALID_STATUS" },
        expectedStatus: 400,
        expectedMessageContains: "Status must be one of",
      },
      {
        description: "content is not a string",
        body: { content: 123 },
        expectedStatus: 400,
        expectedMessageContains: "Expected string",
      },
    ])(
      "should return 400 when $description",
      async ({ body, expectedStatus, expectedMessageContains }) => {
        const req = new Request(`http://localhost/task/${testTaskId}`, {
          method: "PUT",
          headers: {
            "x-user-id": testUserId,
            "content-type": "application/json",
          },
          body: JSON.stringify(body),
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
        const req = new Request(`http://localhost/task/${testTaskId}`, {
          method: "PUT",
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
    test("should handle content with special characters", async () => {
      const req = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "Task: #1 - Update & Review!",
        }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task?.content).toBe("Task: #1 - Update &amp; Review!");
    });

    test("should handle Unicode characters in content", async () => {
      const req = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "タスク更新 🚀 émojis",
        }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task?.content).toBe("タスク更新 🚀 émojis");
    });

    test("should trim whitespace from content", async () => {
      const req = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: {
          "x-user-id": testUserId,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: "  Content with spaces  ",
        }),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task?.content).toBe("Content with spaces");
    });
  });
});
