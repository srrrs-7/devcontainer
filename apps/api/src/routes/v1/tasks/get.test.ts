import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { beforeEach, describe, expect, test } from "vitest";
import { createTestApp, setTestUser } from "../../../../__test__/setup";
import routeHandler from "./get";

const app = createTestApp(routeHandler);

describe("GET /task/:taskId", () => {
  let testUserId: string;
  let testTaskId: string;
  let completedTaskId: string;

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

    // Create test task (PENDING)
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

    // Create completed task
    const completedTask = await prisma.tasks.create({
      data: {
        content: "Completed task",
        status: "COMPLETED",
        completedAt: dayjs("2025-01-01T00:00:00Z").toDate(),
        createdAt: now,
        updatedAt: now,
        users: {
          connect: { id: testUserId },
        },
      },
    });
    completedTaskId = completedTask.id;
  });

  describe("200 OK", () => {
    test.each<{
      name: string;
      getTaskId: () => string;
      expectedContent: string;
      expectCompletedAt: boolean;
      useCompletedTaskId?: boolean;
    }>([
      {
        name: "returns task data when task exists",
        getTaskId: () => testTaskId,
        expectedContent: "Test task content",
        expectCompletedAt: false,
      },
      {
        name: "returns completed task with completedAt date",
        getTaskId: () => completedTaskId,
        expectedContent: "Completed task",
        expectCompletedAt: true,
        useCompletedTaskId: true,
      },
      {
        name: "handles uppercase UUID",
        getTaskId: () => testTaskId.toUpperCase(),
        expectedContent: "Test task content",
        expectCompletedAt: false,
      },
      {
        name: "handles lowercase UUID",
        getTaskId: () => testTaskId.toLowerCase(),
        expectedContent: "Test task content",
        expectCompletedAt: false,
      },
      {
        name: "handles mixed case UUID",
        getTaskId: () =>
          testTaskId
            .split("")
            .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
            .join(""),
        expectedContent: "Test task content",
        expectCompletedAt: false,
      },
    ])("$name", async ({
      getTaskId,
      expectedContent,
      expectCompletedAt,
      useCompletedTaskId,
    }) => {
      const req = new Request(`http://localhost/task/${getTaskId()}`);

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      const expectedTaskId = useCompletedTaskId ? completedTaskId : testTaskId;
      expect(data).toMatchObject({
        taskId: expectedTaskId,
        userId: testUserId,
        content: expectedContent,
      });
      if (expectCompletedAt) {
        expect(data.completedAt).not.toBeNull();
      } else {
        expect(data.completedAt).toBeNull();
      }
    });
  });

  describe("400 Bad Request", () => {
    test.each<{
      name: string;
      taskId: string;
      expectedMessage: string;
    }>([
      {
        name: "invalid UUID format",
        taskId: "invalid-uuid",
        expectedMessage: "invalid uuid",
      },
      {
        name: "non-UUID string",
        taskId: "not-a-uuid-at-all",
        expectedMessage: "invalid uuid",
      },
      {
        name: "UUID with extra characters",
        taskId: "550e8400-e29b-41d4-a716-446655440000-extra",
        expectedMessage: "invalid uuid",
      },
    ])("$name", async ({ taskId, expectedMessage }) => {
      const req = new Request(`http://localhost/task/${taskId}`);

      const res = await app.request(req);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(JSON.stringify(data).toLowerCase()).toContain(expectedMessage);
    });
  });

  describe("404 Not Found", () => {
    test.each<{
      name: string;
      getTaskId: () => string;
      setupUser?: () => void;
    }>([
      {
        name: "task does not exist",
        getTaskId: () => "123e4567-e89b-42d3-8456-426614174000",
      },
      {
        name: "task belongs to different user",
        getTaskId: () => testTaskId,
        setupUser: () =>
          setTestUser({ userId: "123e4567-e89b-42d3-8456-426614174001" }),
      },
    ])("$name", async ({ getTaskId, setupUser }) => {
      setupUser?.();

      const req = new Request(`http://localhost/task/${getTaskId()}`);

      const res = await app.request(req);

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("name", "NotFoundError");
    });
  });
});
