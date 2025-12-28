import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { beforeEach, describe, expect, test } from "vitest";
import app from "./list";

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

  describe("Success cases", () => {
    test("should return 200 with tasks list when no pagination params", async () => {
      const req = new Request("http://localhost/tasks", {
        headers: { "x-user-id": testUserId },
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("tasks");
      expect(data).toHaveProperty("page", 1);
      expect(data).toHaveProperty("limit", 20);
      expect(Array.isArray(data.tasks)).toBe(true);
      expect(data.tasks).toHaveLength(4);
      // Check tasks are ordered by createdAt desc (newest first)
      expect(data.tasks[0].content).toBe("Task 4");
      expect(data.tasks[3].content).toBe("Task 1");
    });

    test.each([
      {
        description: "first page with limit 2",
        page: 1,
        limit: 2,
        expectedCount: 2,
        expectedFirstContent: "Task 4",
      },
      {
        description: "second page with limit 2",
        page: 2,
        limit: 2,
        expectedCount: 2,
        expectedFirstContent: "Task 2",
      },
      {
        description: "third page with limit 2 (partial)",
        page: 3,
        limit: 2,
        expectedCount: 0,
        expectedFirstContent: null,
      },
      {
        description: "page 1 with limit 10 (all tasks)",
        page: 1,
        limit: 10,
        expectedCount: 4,
        expectedFirstContent: "Task 4",
      },
      {
        description: "page 1 with limit 1 (single task)",
        page: 1,
        limit: 1,
        expectedCount: 1,
        expectedFirstContent: "Task 4",
      },
    ])("should return correct pagination for $description", async ({
      page,
      limit,
      expectedCount,
      expectedFirstContent,
    }) => {
      const req = new Request(
        `http://localhost/tasks?page=${page}&limit=${limit}`,
        {
          headers: { "x-user-id": testUserId },
        },
      );

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.page).toBe(page);
      expect(data.limit).toBe(limit);
      expect(data.tasks).toHaveLength(expectedCount);
      if (expectedFirstContent) {
        expect(data.tasks[0].content).toBe(expectedFirstContent);
      }
    });

    test("should return empty array when user has no tasks", async () => {
      const req = new Request("http://localhost/tasks", {
        headers: { "x-user-id": "123e4567-e89b-42d3-8456-426614174999" },
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.tasks).toHaveLength(0);
      expect(data.page).toBe(1);
      expect(data.limit).toBe(20);
    });
  });

  describe("Validation errors - query params", () => {
    test.each<{
      description: string;
      page?: string;
      limit?: string;
      expectedStatus: number;
      expectedMessageContains: string;
    }>([
      {
        description: "page is 0",
        page: "0",
        expectedStatus: 400,
        expectedMessageContains: "Page must be at least 1",
      },
      {
        description: "page is negative",
        page: "-1",
        expectedStatus: 400,
        expectedMessageContains: "Page must be at least 1",
      },
      {
        description: "page exceeds max",
        page: "10001",
        expectedStatus: 400,
        expectedMessageContains: "Page must not exceed 10000",
      },
      {
        description: "page is not a number",
        page: "invalid",
        expectedStatus: 400,
        expectedMessageContains: "Expected number",
      },
      {
        description: "page is decimal",
        page: "1.5",
        expectedStatus: 400,
        expectedMessageContains: "integer",
      },
      {
        description: "limit is 0",
        limit: "0",
        expectedStatus: 400,
        expectedMessageContains: "Limit must be at least 1",
      },
      {
        description: "limit is negative",
        limit: "-1",
        expectedStatus: 400,
        expectedMessageContains: "Limit must be at least 1",
      },
      {
        description: "limit exceeds max",
        limit: "101",
        expectedStatus: 400,
        expectedMessageContains: "Limit must not exceed 100",
      },
      {
        description: "limit is not a number",
        limit: "invalid",
        expectedStatus: 400,
        expectedMessageContains: "Expected number",
      },
      {
        description: "limit is decimal",
        limit: "20.5",
        expectedStatus: 400,
        expectedMessageContains: "integer",
      },
    ])("should return 400 when $description", async ({
      page,
      limit,
      expectedStatus,
      expectedMessageContains,
    }) => {
      const queryParams = new URLSearchParams();
      if (page) queryParams.set("page", page);
      if (limit) queryParams.set("limit", limit);

      const req = new Request(
        `http://localhost/tasks?${queryParams.toString()}`,
        {
          headers: { "x-user-id": testUserId },
        },
      );

      const res = await app.request(req);

      expect(res.status).toBe(expectedStatus);
      const data = await res.json();
      const jsonStr = JSON.stringify(data);
      expect(jsonStr.toLowerCase()).toContain(
        expectedMessageContains.toLowerCase(),
      );
    });
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
        headers: {},
        expectedStatus: 400,
        expectedMessageContains: "invalid_type",
      },
      {
        description: "invalid UUID format in x-user-id",
        headers: { "x-user-id": "invalid-uuid" },
        expectedStatus: 400,
        expectedMessageContains: "Invalid uuid",
      },
      {
        description: "empty x-user-id header",
        headers: { "x-user-id": "" },
        expectedStatus: 400,
        expectedMessageContains: "Invalid uuid",
      },
      {
        description: "non-UUID string in x-user-id",
        headers: { "x-user-id": "not-a-uuid" },
        expectedStatus: 400,
        expectedMessageContains: "Invalid uuid",
      },
    ])("should return 400 when $description", async ({
      headers,
      expectedStatus,
      expectedMessageContains,
    }) => {
      const req = new Request("http://localhost/tasks", {
        headers,
      });

      const res = await app.request(req);

      expect(res.status).toBe(expectedStatus);
      const data = await res.json();
      const jsonStr = JSON.stringify(data);
      expect(jsonStr.toLowerCase()).toContain(
        expectedMessageContains.toLowerCase(),
      );
    });
  });

  describe("Edge cases", () => {
    test("should return tasks with completed status", async () => {
      const req = new Request("http://localhost/tasks?limit=1", {
        headers: { "x-user-id": testUserId },
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.tasks).toHaveLength(1);
      expect(data.tasks[0]).toHaveProperty("completedAt");
      expect(data.tasks[0].completedAt).not.toBeNull();
    });

    test("should handle large page number with no results", async () => {
      const req = new Request("http://localhost/tasks?page=999&limit=10", {
        headers: { "x-user-id": testUserId },
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.tasks).toHaveLength(0);
      expect(data.page).toBe(999);
      expect(data.limit).toBe(10);
    });

    test.each([
      {
        description: "page as string number",
        query: "?page=2&limit=2",
        expectedPage: 2,
        expectedLimit: 2,
      },
      {
        description: "only page parameter",
        query: "?page=2",
        expectedPage: 2,
        expectedLimit: 20, // default
      },
      {
        description: "only limit parameter",
        query: "?limit=5",
        expectedPage: 1, // default
        expectedLimit: 5,
      },
    ])("should handle $description correctly", async ({
      query,
      expectedPage,
      expectedLimit,
    }) => {
      const req = new Request(`http://localhost/tasks${query}`, {
        headers: { "x-user-id": testUserId },
      });

      const res = await app.request(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.page).toBe(expectedPage);
      expect(data.limit).toBe(expectedLimit);
    });
  });
});
