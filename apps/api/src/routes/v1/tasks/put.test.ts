import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { beforeEach, describe, expect, test } from "vitest";
import { createTestApp, setTestUser } from "../../../../__test__/setup";
import routeHandler from "./put";

const app = createTestApp(routeHandler);

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

    // Set the test user for auth middleware mock
    setTestUser({ userId: testUserId });
  });

  describe("200 OK", () => {
    test.each<{
      name: string;
      getTaskId: () => string;
      body: Record<string, unknown>;
      expectedCount: number;
      expectedContent?: string;
      expectCompletedAt?: boolean;
      setupUser?: () => void;
    }>([
      {
        name: "updates content only",
        getTaskId: () => testTaskId,
        body: { content: "Updated task content", version: 0 },
        expectedCount: 1,
        expectedContent: "Updated task content",
        expectCompletedAt: false,
      },
      {
        name: "sets completedAt when status is COMPLETED",
        getTaskId: () => testTaskId,
        body: { status: "COMPLETED", version: 0 },
        expectedCount: 1,
        expectedContent: "Original task content",
        expectCompletedAt: true,
      },
      {
        name: "updates content and sets completedAt when status is COMPLETED",
        getTaskId: () => testTaskId,
        body: {
          content: "Updated and completed",
          status: "COMPLETED",
          version: 0,
        },
        expectedCount: 1,
        expectedContent: "Updated and completed",
        expectCompletedAt: true,
      },
      {
        name: "clears completedAt when status is IN_PROGRESS",
        getTaskId: () => testTaskId,
        body: { status: "IN_PROGRESS", version: 0 },
        expectedCount: 1,
        expectCompletedAt: false,
      },
      {
        name: "clears completedAt when status is PENDING",
        getTaskId: () => testTaskId,
        body: { status: "PENDING", version: 0 },
        expectedCount: 1,
        expectCompletedAt: false,
      },
      {
        name: "trims whitespace from content",
        getTaskId: () => testTaskId,
        body: { content: "  Content with spaces  ", version: 0 },
        expectedCount: 1,
        expectedContent: "Content with spaces",
      },
      {
        name: "escapes special characters",
        getTaskId: () => testTaskId,
        body: { content: "Task: #1 - Update & Review!", version: 0 },
        expectedCount: 1,
        expectedContent: "Task: #1 - Update &amp; Review!",
      },
      {
        name: "preserves Unicode characters",
        getTaskId: () => testTaskId,
        body: { content: "タスク更新 🚀 émojis", version: 0 },
        expectedCount: 1,
        expectedContent: "タスク更新 🚀 émojis",
      },
      {
        name: "returns count 0 when task does not exist",
        getTaskId: () => "123e4567-e89b-42d3-8456-426614174000",
        body: { content: "Updated content", version: 0 },
        expectedCount: 0,
      },
      {
        name: "returns count 0 when task belongs to different user",
        getTaskId: () => testTaskId,
        body: { content: "Updated content", version: 0 },
        expectedCount: 0,
        setupUser: () =>
          setTestUser({ userId: "123e4567-e89b-42d3-8456-426614174001" }),
      },
    ])("$name", async ({
      getTaskId,
      body,
      expectedCount,
      expectedContent,
      expectCompletedAt,
      setupUser,
    }) => {
      setupUser?.();

      const req = new Request(`http://localhost/task/${getTaskId()}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("count", expectedCount);

      // Verify database state only for successful updates
      if (expectedCount > 0) {
        const prisma = getPrisma();
        const task = await prisma.tasks.findUnique({
          where: { id: testTaskId },
        });
        if (expectedContent !== undefined) {
          expect(task?.content).toBe(expectedContent);
        }
        if (expectCompletedAt !== undefined) {
          if (expectCompletedAt) {
            expect(task?.completedAt).not.toBeNull();
          } else {
            expect(task?.completedAt).toBeNull();
          }
        }
      }
    });

    test("returns count 0 when version conflicts (optimistic locking)", async () => {
      const prisma = getPrisma();

      // First update: version 0 -> 1
      const req1 = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: "First update", version: 0 }),
      });

      const res1 = await app.request(req1);
      expect(res1.status).toBe(200);
      expect((await res1.json()).count).toBe(1);

      // Verify version was incremented
      const task1 = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task1?.version).toBe(1);
      expect(task1?.content).toBe("First update");

      // Second update with old version (0): should fail
      const req2 = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content: "Second update with old version",
          version: 0,
        }),
      });

      const res2 = await app.request(req2);
      expect(res2.status).toBe(200);
      expect((await res2.json()).count).toBe(0);

      // Verify content was not updated
      const task2 = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task2?.content).toBe("First update");
      expect(task2?.version).toBe(1);

      // Third update with correct version (1): should succeed
      const req3 = new Request(`http://localhost/task/${testTaskId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          content: "Third update with correct version",
          version: 1,
        }),
      });

      const res3 = await app.request(req3);
      expect(res3.status).toBe(200);
      expect((await res3.json()).count).toBe(1);

      // Verify content was updated
      const task3 = await prisma.tasks.findUnique({
        where: { id: testTaskId },
      });
      expect(task3?.content).toBe("Third update with correct version");
      expect(task3?.version).toBe(2);
    });
  });

  describe("400 Bad Request", () => {
    test.each<{
      name: string;
      taskId: string;
      body: Record<string, unknown>;
      expectedMessage: string;
    }>([
      {
        name: "invalid UUID format in param",
        taskId: "invalid-uuid",
        body: { content: "Valid content", version: 0 },
        expectedMessage: "invalid uuid",
      },
      {
        name: "non-UUID string in param",
        taskId: "not-a-uuid-at-all",
        body: { content: "Valid content", version: 0 },
        expectedMessage: "invalid uuid",
      },
      {
        name: "empty body (no fields)",
        taskId: "USE_TEST_TASK_ID",
        body: {},
        expectedMessage: "invalid_type",
      },
      {
        name: "empty content string",
        taskId: "USE_TEST_TASK_ID",
        body: { content: "", version: 0 },
        expectedMessage: "content cannot be empty",
      },
      {
        name: "content exceeds max length (1001 chars)",
        taskId: "USE_TEST_TASK_ID",
        body: { content: "a".repeat(1001), version: 0 },
        expectedMessage: "must not exceed 1000 characters",
      },
      {
        name: "content with script tag (XSS)",
        taskId: "USE_TEST_TASK_ID",
        body: { content: "<script>alert('xss')</script>", version: 0 },
        expectedMessage: "dangerous script patterns",
      },
      {
        name: "invalid status value",
        taskId: "USE_TEST_TASK_ID",
        body: { status: "INVALID_STATUS", version: 0 },
        expectedMessage: "status must be one of",
      },
      {
        name: "content is not a string",
        taskId: "USE_TEST_TASK_ID",
        body: { content: 123, version: 0 },
        expectedMessage: "expected string",
      },
    ])("$name", async ({ taskId, body, expectedMessage }) => {
      const actualTaskId = taskId === "USE_TEST_TASK_ID" ? testTaskId : taskId;

      const req = new Request(`http://localhost/task/${actualTaskId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const res = await app.request(req);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(JSON.stringify(data).toLowerCase()).toContain(expectedMessage);
    });
  });
});
