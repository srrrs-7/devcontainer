import { describe, expect, test } from "vitest";
import {
  contentSchema,
  emailSchema,
  isoDateSchema,
  paginationSchema,
  safeStringSchema,
  urlSchema,
  userHeaderSchema,
  usernameSchema,
  uuidSchema,
} from "./schemas";

describe("uuidSchema", () => {
  test.each([
    { uuid: "123e4567-e89b-12d3-a456-426614174000", description: "UUID v4" },
    { uuid: "550e8400-e29b-11d4-a716-446655440000", description: "UUID v1" },
  ])("validates correct $description", ({ uuid }) => {
    const result = uuidSchema.safeParse(uuid);
    expect(result.success).toBe(true);
  });

  test.each([
    { uuid: "not-a-uuid", description: "invalid UUID format" },
    {
      uuid: "123e4567e89b12d3a456426614174000",
      description: "UUID without hyphens",
    },
    { uuid: "", description: "empty string" },
    { uuid: "'; DROP TABLE users--", description: "SQL injection attempt" },
  ])("rejects $description", ({ uuid }) => {
    const result = uuidSchema.safeParse(uuid);
    expect(result.success).toBe(false);
  });
});

describe("safeStringSchema", () => {
  test("validates clean string within limits", () => {
    const schema = safeStringSchema(1, 100);
    const result = schema.safeParse("Hello World");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Hello World");
    }
  });

  test("trims whitespace", () => {
    const schema = safeStringSchema(1, 100);
    const result = schema.safeParse("  Hello World  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Hello World");
    }
  });

  test("rejects string below minimum length", () => {
    const schema = safeStringSchema(5, 100);
    const result = schema.safeParse("Hi");
    expect(result.success).toBe(false);
  });

  test("rejects string above maximum length", () => {
    const schema = safeStringSchema(1, 10);
    const result = schema.safeParse("This is a very long string");
    expect(result.success).toBe(false);
  });

  describe("SQL Injection Protection", () => {
    const schema = safeStringSchema();

    test.each([
      { input: "SELECT * FROM users", description: "SELECT statement" },
      {
        input: "INSERT INTO users VALUES (1)",
        description: "INSERT statement",
      },
      {
        input: "UPDATE users SET name='hacker'",
        description: "UPDATE statement",
      },
      {
        input: "DELETE FROM users WHERE id=1",
        description: "DELETE statement",
      },
      { input: "DROP TABLE users", description: "DROP statement" },
      { input: "admin'--", description: "SQL comments (--)" },
      { input: "admin' /* comment */", description: "SQL comments (/* */)" },
      {
        input: "1' UNION SELECT password FROM users--",
        description: "SQL union attack",
      },
      {
        input: "admin'; DROP TABLE users;--",
        description: "SQL with semicolon",
      },
      {
        input: "EXEC xp_cmdshell 'dir'",
        description: "stored procedure names",
      },
      {
        input: "I need to select a product from the list",
        description: "normal text with SQL-like words",
      },
    ])("rejects $description", ({ input }) => {
      const result = schema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("XSS Protection", () => {
    const schema = safeStringSchema();

    test.each([
      { input: "<script>alert('XSS')</script>", description: "script tag" },
      {
        input: "<script src='malicious.js'></script>",
        description: "script tag with attributes",
      },
      { input: "javascript:alert('XSS')", description: "javascript: protocol" },
      {
        input: "<div onclick='alert(1)'>Click</div>",
        description: "onclick event handler",
      },
      {
        input: "<img onload='alert(1)' src='x'>",
        description: "onload event handler",
      },
      { input: "<iframe src='evil.com'></iframe>", description: "iframe tag" },
      { input: "<embed src='evil.swf'>", description: "embed tag" },
      { input: "<object data='evil.swf'></object>", description: "object tag" },
    ])("rejects $description", ({ input }) => {
      const result = schema.safeParse(input);
      expect(result.success).toBe(false);
    });

    test("accepts safe HTML-like text", () => {
      const result = schema.safeParse("The <strong> tag is used for bold text");
      expect(result.success).toBe(true);
    });
  });
});

describe("emailSchema", () => {
  test("validates correct email", () => {
    const result = emailSchema.safeParse("user@example.com");
    expect(result.success).toBe(true);
  });

  test("normalizes email to lowercase", () => {
    const result = emailSchema.safeParse("User@Example.COM");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("user@example.com");
    }
  });

  test("trims whitespace after validation", () => {
    const result = emailSchema.safeParse("user@example.com");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("user@example.com");
    }
  });

  test.each([
    { email: "userexample.com", description: "email without @" },
    { email: "user@", description: "email without domain" },
    {
      email: `${"a".repeat(250)}@example.com`,
      description: "email exceeding max length",
    },
  ])("rejects $description", ({ email }) => {
    const result = emailSchema.safeParse(email);
    expect(result.success).toBe(false);
  });

  test.each([
    {
      email: "user@mail.example.com",
      description: "valid email with subdomain",
    },
    {
      email: "user+tag@example.com",
      description: "valid email with plus sign",
    },
  ])("accepts $description", ({ email }) => {
    const result = emailSchema.safeParse(email);
    expect(result.success).toBe(true);
  });
});

describe("usernameSchema", () => {
  test.each([
    { username: "user123", description: "alphanumeric username" },
    { username: "user_name", description: "username with underscore" },
    { username: "user-name", description: "username with hyphen" },
    { username: "username", description: "valid username" },
  ])("validates $description", ({ username }) => {
    const result = usernameSchema.safeParse(username);
    expect(result.success).toBe(true);
  });

  test.each([
    { username: "ab", description: "username below minimum length" },
    { username: "a".repeat(101), description: "username above maximum length" },
    { username: "user name", description: "username with spaces" },
    { username: "user@name", description: "username with special characters" },
    { username: "admin'--", description: "username with SQL injection" },
  ])("rejects $description", ({ username }) => {
    const result = usernameSchema.safeParse(username);
    expect(result.success).toBe(false);
  });
});

describe("contentSchema", () => {
  test("validates clean content", () => {
    const schema = contentSchema(1000);
    const result = schema.safeParse("This is valid content");
    expect(result.success).toBe(true);
  });

  test("trims whitespace", () => {
    const schema = contentSchema(1000);
    const result = schema.safeParse("  Content with spaces  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Content with spaces");
    }
  });

  test("rejects empty content", () => {
    const schema = contentSchema(1000);
    const result = schema.safeParse("");
    expect(result.success).toBe(false);
  });

  test("rejects content exceeding max length", () => {
    const schema = contentSchema(100);
    const result = schema.safeParse("a".repeat(101));
    expect(result.success).toBe(false);
  });

  test("accepts content with newlines", () => {
    const schema = contentSchema(1000);
    const result = schema.safeParse("Line 1\nLine 2\nLine 3");
    expect(result.success).toBe(true);
  });

  test("rejects content with SQL injection", () => {
    const schema = contentSchema(1000);
    const result = schema.safeParse("'; DROP TABLE comments--");
    expect(result.success).toBe(false);
  });

  test("rejects content with XSS", () => {
    const schema = contentSchema(1000);
    const result = schema.safeParse("<script>alert('xss')</script>");
    expect(result.success).toBe(false);
  });
});

describe("urlSchema", () => {
  test.each([
    { url: "http://example.com", description: "HTTP URL" },
    { url: "https://example.com", description: "HTTPS URL" },
    { url: "https://example.com/path/to/page", description: "URL with path" },
    {
      url: "https://example.com?foo=bar&baz=qux",
      description: "URL with query parameters",
    },
  ])("validates $description", ({ url }) => {
    const result = urlSchema.safeParse(url);
    expect(result.success).toBe(true);
  });

  test.each([
    { url: "javascript:alert('XSS')", description: "javascript: protocol" },
    {
      url: "data:text/html,<script>alert('XSS')</script>",
      description: "data: protocol",
    },
    { url: "file:///etc/passwd", description: "file: protocol" },
    { url: "ftp://example.com", description: "ftp: protocol" },
    { url: "not a url", description: "invalid URL format" },
  ])("rejects $description", ({ url }) => {
    const result = urlSchema.safeParse(url);
    expect(result.success).toBe(false);
  });
});

describe("paginationSchema", () => {
  test("validates with default values", () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  test("validates custom page and limit", () => {
    const result = paginationSchema.safeParse({ page: 5, limit: 50 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(5);
      expect(result.data.limit).toBe(50);
    }
  });

  test("coerces string to number", () => {
    const result = paginationSchema.safeParse({ page: "3", limit: "25" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(25);
    }
  });

  test.each([
    { input: { page: 0 }, description: "page below minimum" },
    { input: { page: 10001 }, description: "page above maximum" },
    { input: { limit: 0 }, description: "limit below minimum" },
    { input: { limit: 101 }, description: "limit above maximum" },
    { input: { page: -1 }, description: "negative page" },
    { input: { page: 1.5 }, description: "non-integer page" },
  ])("rejects $description", ({ input }) => {
    const result = paginationSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe("userHeaderSchema", () => {
  test("validates correct user ID", () => {
    const result = userHeaderSchema.safeParse({
      "x-user-id": "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(true);
  });

  test.each([
    { input: { "x-user-id": "invalid-uuid" }, description: "invalid UUID" },
    { input: {}, description: "missing user ID" },
    {
      input: { "x-user-id": "'; DROP TABLE users--" },
      description: "SQL injection in user ID",
    },
  ])("rejects $description", ({ input }) => {
    const result = userHeaderSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe("isoDateSchema", () => {
  test.each([
    { input: "2024-10-21T12:00:00.000Z", description: "ISO 8601 date string" },
    { input: new Date(), description: "Date object" },
    { input: "2024-10-21T12:00:00Z", description: "ISO date with Z timezone" },
  ])("validates $description", ({ input }) => {
    const result = isoDateSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  test.each([
    { input: "2024-10-21", description: "invalid date format" },
    { input: "not a date", description: "non-date string" },
    { input: "'; DROP TABLE tasks--", description: "SQL injection attempt" },
  ])("rejects $description", ({ input }) => {
    const result = isoDateSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
