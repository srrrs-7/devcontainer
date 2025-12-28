import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { beforeEach, describe, expect, test } from "vitest";
import { createTestApp, setTestUser } from "../../../../__test__/setup";
import routeHandler from "./list";

const app = createTestApp(routeHandler);

describe("GET /tasks", () => {
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

    // Create multiple test tasks
    await Promise.all([
      prisma.tasks.create({
        data: {
          content: "Task 1",
          createdAt: dayjs().subtract(3, "day").toDate(),
          updatedAt: now,
          users: { connect: { id: testUserId } },
        },
      }),
      prisma.tasks.create({
        data: {
          content: "Task 2",
          createdAt: dayjs().subtract(2, "day").toDate(),
          updatedAt: now,
          users: { connect: { id: testUserId } },
        },
      }),
      prisma.tasks.create({
        data: {
          content: "Task 3",
          createdAt: dayjs().subtract(1, "day").toDate(),
          updatedAt: now,
          users: { connect: { id: testUserId } },
        },
      }),
      prisma.tasks.create({
        data: {
          content: "Task 4",
          status: "COMPLETED",
          completedAt: now,
          createdAt: now,
          updatedAt: now,
          users: { connect: { id: testUserId } },
        },
      }),
    ]);
  });

  describe("200 OK", () => {
    test.each<{
      name: string;
      query: string;
      expectedPage: number;
      expectedLimit: number;
      expectedCount: number;
      expectedFirstContent: string | null;
      setupUser?: () => void;
    }>([
      {
        name: "returns tasks with default pagination",
        query: "",
        expectedPage: 1,
        expectedLimit: 20,
        expectedCount: 4,
        expectedFirstContent: "Task 4",
      },
      {
        name: "returns first page with limit 2",
        query: "?page=1&limit=2",
        expectedPage: 1,
        expectedLimit: 2,
        expectedCount: 2,
        expectedFirstContent: "Task 4",
      },
      {
        name: "returns second page with limit 2",
        query: "?page=2&limit=2",
        expectedPage: 2,
        expectedLimit: 2,
        expectedCount: 2,
        expectedFirstContent: "Task 2",
      },
      {
        name: "returns empty array for page beyond data",
        query: "?page=3&limit=2",
        expectedPage: 3,
        expectedLimit: 2,
        expectedCount: 0,
        expectedFirstContent: null,
      },
      {
        name: "returns all tasks with large limit",
        query: "?page=1&limit=10",
        expectedPage: 1,
        expectedLimit: 10,
        expectedCount: 4,
        expectedFirstContent: "Task 4",
      },
      {
        name: "returns single task with limit 1",
        query: "?page=1&limit=1",
        expectedPage: 1,
        expectedLimit: 1,
        expectedCount: 1,
        expectedFirstContent: "Task 4",
      },
      {
        name: "uses default limit when only page provided",
        query: "?page=2",
        expectedPage: 2,
        expectedLimit: 20,
        expectedCount: 0,
        expectedFirstContent: null,
      },
      {
        name: "uses default page when only limit provided",
        query: "?limit=5",
        expectedPage: 1,
        expectedLimit: 5,
        expectedCount: 4,
        expectedFirstContent: "Task 4",
      },
      {
        name: "returns empty array for large page number",
        query: "?page=999&limit=10",
        expectedPage: 999,
        expectedLimit: 10,
        expectedCount: 0,
        expectedFirstContent: null,
      },
      {
        name: "returns empty array for user with no tasks",
        query: "",
        expectedPage: 1,
        expectedLimit: 20,
        expectedCount: 0,
        expectedFirstContent: null,
        setupUser: () =>
          setTestUser({ userId: "123e4567-e89b-42d3-8456-426614174999" }),
      },
    ])("$name", async ({
      query,
      expectedPage,
      expectedLimit,
      expectedCount,
      expectedFirstContent,
      setupUser,
    }) => {
      setupUser?.();

      const req = new Request(`http://localhost/tasks${query}`);

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("page", expectedPage);
      expect(data).toHaveProperty("limit", expectedLimit);
      expect(data).toHaveProperty("tasks");
      expect(Array.isArray(data.tasks)).toBe(true);
      expect(data.tasks).toHaveLength(expectedCount);
      if (expectedFirstContent) {
        expect(data.tasks[0].content).toBe(expectedFirstContent);
      }
    });

    test("returns tasks ordered by createdAt desc (newest first)", async () => {
      const req = new Request("http://localhost/tasks");

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.tasks[0].content).toBe("Task 4");
      expect(data.tasks[3].content).toBe("Task 1");
    });

    test("includes completedAt for completed tasks", async () => {
      const req = new Request("http://localhost/tasks?limit=1");

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.tasks).toHaveLength(1);
      expect(data.tasks[0]).toHaveProperty("completedAt");
      expect(data.tasks[0].completedAt).not.toBeNull();
    });
  });

  describe("400 Bad Request", () => {
    test.each<{
      name: string;
      query: string;
      expectedMessage: string;
    }>([
      {
        name: "page is 0",
        query: "?page=0",
        expectedMessage: "page must be at least 1",
      },
      {
        name: "page is negative",
        query: "?page=-1",
        expectedMessage: "page must be at least 1",
      },
      {
        name: "page exceeds max",
        query: "?page=10001",
        expectedMessage: "page must not exceed 10000",
      },
      {
        name: "page is not a number",
        query: "?page=invalid",
        expectedMessage: "expected number",
      },
      {
        name: "page is decimal",
        query: "?page=1.5",
        expectedMessage: "integer",
      },
      {
        name: "limit is 0",
        query: "?limit=0",
        expectedMessage: "limit must be at least 1",
      },
      {
        name: "limit is negative",
        query: "?limit=-1",
        expectedMessage: "limit must be at least 1",
      },
      {
        name: "limit exceeds max",
        query: "?limit=101",
        expectedMessage: "limit must not exceed 100",
      },
      {
        name: "limit is not a number",
        query: "?limit=invalid",
        expectedMessage: "expected number",
      },
      {
        name: "limit is decimal",
        query: "?limit=20.5",
        expectedMessage: "integer",
      },
    ])("$name", async ({ query, expectedMessage }) => {
      const req = new Request(`http://localhost/tasks${query}`);

      const res = await app.request(req);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(JSON.stringify(data).toLowerCase()).toContain(expectedMessage);
    });
  });
});
