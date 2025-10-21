import { z } from "zod";

/**
 * Security-focused validation schemas
 * Protects against SQL injection, XSS, and other common attacks
 */

// Dangerous patterns that could indicate SQL injection attempts
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE|CAST|CONVERT)\b)/i,
  /(--|\/\*|\*\/|;|'|"|`)/,
  /(\bOR\b|\bAND\b).*?=.*?=/i,
  /(xp_|sp_|sys\.)/i,
];

// Dangerous patterns for XSS attacks
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // Event handlers like onclick=, onload=, etc.
  /<iframe/gi,
  /<embed/gi,
  /<object/gi,
];

/**
 * UUID validation (strict format)
 * Prevents SQL injection by allowing only valid UUID format
 */
export const uuidSchema = z.uuid("Invalid UUID format").brand("UUID");

/**
 * Safe string validation with SQL injection and XSS protection
 * @param minLength - Minimum string length (default: 1)
 * @param maxLength - Maximum string length (default: 1000)
 */
export const safeStringSchema = (minLength = 1, maxLength = 1000) =>
  z
    .string()
    .min(minLength, `String must be at least ${minLength} characters`)
    .max(maxLength, `String must not exceed ${maxLength} characters`)
    .refine(
      (val) => {
        // Check for SQL injection patterns
        return !SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(val));
      },
      {
        message: "Input contains potentially dangerous SQL patterns",
      },
    )
    .refine(
      (val) => {
        // Check for XSS patterns
        return !XSS_PATTERNS.some((pattern) => pattern.test(val));
      },
      {
        message: "Input contains potentially dangerous script patterns",
      },
    )
    .transform((val) => {
      // Trim whitespace and normalize
      return val.trim();
    });

/**
 * Email validation with security checks
 */
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(255, "Email must not exceed 255 characters")
  .transform((val) => val.toLowerCase().trim());

/**
 * Username validation (alphanumeric, underscore, hyphen only)
 * Prevents SQL injection by restricting character set
 */
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(100, "Username must not exceed 100 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, underscores, and hyphens",
  )
  .transform((val) => val.trim());

/**
 * Content validation for user-generated text (with HTML sanitization awareness)
 * Note: This doesn't sanitize HTML, but validates against dangerous patterns
 * For HTML content, use a proper HTML sanitizer library like DOMPurify
 */
export const contentSchema = (maxLength = 5000) =>
  z
    .string()
    .min(1, "Content cannot be empty")
    .max(maxLength, `Content must not exceed ${maxLength} characters`)
    .refine(
      (val) => {
        // Check for SQL injection patterns
        return !SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(val));
      },
      {
        message: "Content contains potentially dangerous SQL patterns",
      },
    )
    .refine(
      (val) => {
        // Allow some HTML but block dangerous XSS patterns
        return !XSS_PATTERNS.some((pattern) => pattern.test(val));
      },
      {
        message: "Content contains potentially dangerous script patterns",
      },
    )
    .transform((val) => val.trim());

/**
 * URL validation with protocol restrictions
 */
export const urlSchema = z.url("Invalid URL format").refine(
  (val) => {
    try {
      const url = new URL(val);
      // Only allow http and https protocols
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
  {
    message: "Only HTTP and HTTPS protocols are allowed",
  },
);

/**
 * Pagination validation
 */
export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .max(10000, "Page must not exceed 10000")
    .default(1),
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must not exceed 100")
    .default(20),
});

/**
 * Common header schema for user identification
 */
export const userHeaderSchema = z.object({
  "x-user-id": uuidSchema.describe("User ID must be a valid UUID"),
});

/**
 * Date validation (ISO 8601 format)
 */
export const isoDateSchema = z.iso
  .datetime("Date must be in ISO 8601 format")
  .or(z.date());
