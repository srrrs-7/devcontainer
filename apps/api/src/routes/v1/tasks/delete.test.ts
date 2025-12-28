import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { beforeEach, describe, expect, test } from "vitest";
import { createTestApp, setTestUser } from "../../../../__test__/setup";
import routeHandler from "./delete";

const app = createTestApp(routeHandler);

describe("DELETE /task/:taskId", () => {
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

  describe("204 No Content", () => {
    test.each<{
      name: string;
      getTaskId: () => string;
    }>([
      {
        name: "deletes existing task",
        getTaskId: () => testTaskId,
      },
      {
        name: "deletes task with uppercase UUID",
        getTaskId: () => testTaskId.toUpperCase(),
      },
      {
        name: "deletes task with lowercase UUID",
        getTaskId: () => testTaskId.toLowerCase(),
      },
    ])("$name", async ({ getTaskId }) => {
      const req = new Request(`http://localhost/task/${getTaskId()}`, {
        method: "DELETE",
      });

      const res = await app.request(req);

      expect(res.status).toBe(204);

      // Verify task was deleted from database
      const prisma = getPrisma();
      const task = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task).toBeNull();
    });

    test("deletes completed task", async () => {
      const prisma = getPrisma();
      const now = dayjs().toDate();

      // Create completed task
      const completedTask = await prisma.tasks.create({
        data: {
          content: "Completed task",
          status: "COMPLETED",
          completedAt: now,
          createdAt: now,
          updatedAt: now,
          users: {
            connect: { id: testUserId },
          },
        },
      });

      const req = new Request(`http://localhost/task/${completedTask.id}`, {
        method: "DELETE",
      });

      const res = await app.request(req);

      expect(res.status).toBe(204);

      // Verify task was deleted
      const task = await prisma.tasks.findUnique({
        where: { id: completedTask.id },
      });
      expect(task).toBeNull();
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
      const req = new Request(`http://localhost/task/${taskId}`, {
        method: "DELETE",
      });

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

      const req = new Request(`http://localhost/task/${getTaskId()}`, {
        method: "DELETE",
      });

      const res = await app.request(req);

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("name", "NotFoundError");
    });

    test("returns 404 when deleting already deleted task", async () => {
      // First delete
      const req1 = new Request(`http://localhost/task/${testTaskId}`, {
        method: "DELETE",
      });
      const res1 = await app.request(req1);
      expect(res1.status).toBe(204);

      // Second delete should return 404
      const req2 = new Request(`http://localhost/task/${testTaskId}`, {
        method: "DELETE",
      });
      const res2 = await app.request(req2);
      expect(res2.status).toBe(404);
      const data = await res2.json();
      expect(data).toHaveProperty("name", "NotFoundError");
    });
  });
});
