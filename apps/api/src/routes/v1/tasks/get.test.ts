import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { beforeEach, describe, expect, test } from "vitest";
import { createTestApp, setTestUser } from "../../../../__test__/setup";
import routeHandler from "./get";

const app = createTestApp(routeHandler);

describe("GET /task/:taskId", () => {
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

    // Create test task
    const task = await prisma.tasks.create({
      data: {
        content: "Test task content",
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
    test("should return 200 with task data when task exists", async () => {
      const req = new Request(`http://localhost/task/${testTaskId}`);

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toMatchObject({
        taskId: testTaskId,
        userId: testUserId,
        content: "Test task content",
        completedAt: null,
      });
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
        description: "empty taskId",
        taskId: "",
        expectedStatus: 404, // Hono routes empty param as not found
      },
      {
        description: "non-UUID string",
        taskId: "not-a-uuid-at-all",
        expectedStatus: 400,
        expectedMessageContains: "Invalid uuid",
      },
      {
        description: "UUID with extra characters",
        taskId: "550e8400-e29b-41d4-a716-446655440000-extra",
        expectedStatus: 400,
        expectedMessageContains: "Invalid uuid",
      },
    ])("should return error when taskId is $description", async ({
      taskId,
      expectedStatus,
      expectedMessageContains,
    }) => {
      const req = new Request(`http://localhost/task/${taskId}`);

      const res = await app.request(req);

      expect(res.status).toBe(expectedStatus);
      if (expectedMessageContains) {
        const data = await res.json();
        const jsonStr = JSON.stringify(data);
        expect(jsonStr.toLowerCase()).toContain(
          expectedMessageContains.toLowerCase(),
        );
      }
    });
  });

  describe("Not found cases", () => {
    test("should return 404 when task does not exist", async () => {
      const req = new Request(
        "http://localhost/task/123e4567-e89b-42d3-8456-426614174000",
      );

      const res = await app.request(req);

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("name", "NotFoundError");
    });

    test("should return 404 when task exists but belongs to different user", async () => {
      // Set a different user for this test
      setTestUser({ userId: "123e4567-e89b-42d3-8456-426614174001" });

      const req = new Request(`http://localhost/task/${testTaskId}`);

      const res = await app.request(req);

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("name", "NotFoundError");
    });
  });

  describe("Edge cases", () => {
    test("should return task with completed date when task is completed", async () => {
      const prisma = getPrisma();
      const completedDate = dayjs("2025-01-01T00:00:00Z").toDate();
      const now = dayjs().toDate();

      // Create completed task
      const completedTask = await prisma.tasks.create({
        data: {
          content: "Completed task",
          status: "COMPLETED",
          completedAt: completedDate,
          createdAt: now,
          updatedAt: now,
          users: {
            connect: { id: testUserId },
          },
        },
      });

      const req = new Request(`http://localhost/task/${completedTask.id}`);

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toMatchObject({
        taskId: completedTask.id,
        userId: testUserId,
        content: "Completed task",
        completedAt: completedDate.toISOString(),
      });
    });

    test.each([
      {
        description: "uppercase UUID",
        getTaskId: (original: string) => original.toUpperCase(),
        shouldSucceed: true,
      },
      {
        description: "lowercase UUID",
        getTaskId: (original: string) => original.toLowerCase(),
        shouldSucceed: true,
      },
      {
        description: "mixed case UUID",
        getTaskId: (original: string) =>
          original
            .split("")
            .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
            .join(""),
        shouldSucceed: true,
      },
    ])("should handle $description correctly", async ({
      getTaskId,
      shouldSucceed,
    }) => {
      const modifiedTaskId = getTaskId(testTaskId);
      const req = new Request(`http://localhost/task/${modifiedTaskId}`);

      const res = await app.request(req);

      if (shouldSucceed) {
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.taskId).toBe(testTaskId);
      } else {
        expect(res.status).not.toBe(200);
      }
    });
  });
});
