abstract class AppError extends Error {
  public abstract readonly name: string;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  public readonly name = "NotFoundError" as const;
  public readonly resourceName: string;
  constructor(error: unknown, resourceName: string) {
    super("Resource not found");
    this.message = error instanceof Error ? error.message : String(error);
    this.resourceName = resourceName;
  }
  static fromPrismaNotFoundError(
    error: unknown,
    resourceName?: string,
  ): NotFoundError {
    // Check if error is Prisma P2025 error (Record not found)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      // Try to extract model name from meta, fallback to provided resourceName or default
      let name = resourceName || "Resource";

      if (
        "meta" in error &&
        typeof error.meta === "object" &&
        error.meta !== null &&
        "modelName" in error.meta &&
        typeof error.meta.modelName === "string"
      ) {
        name = error.meta.modelName;
      } else if (
        "meta" in error &&
        typeof error.meta === "object" &&
        error.meta !== null &&
        "cause" in error.meta &&
        typeof error.meta.cause === "string"
      ) {
        // Extract model name from cause message if available
        const causeMatch = error.meta.cause.match(/model (\w+)/i);
        if (causeMatch?.[1]) {
          name = causeMatch[1];
        }
      }

      return new NotFoundError(error, name);
    }

    // If not P2025 error, re-throw
    throw error;
  }
}

export class ForbiddenError extends AppError {
  public readonly name = "ForbiddenError" as const;
  public readonly resourceName: string;
  constructor(error: unknown, resourceName: string) {
    super(error instanceof Error ? error.message : String(error));
    this.resourceName = resourceName;
  }
}

export class UnauthorizedError extends AppError {
  public readonly name = "UnauthorizedError" as const;
  public readonly resourceName: string;
  constructor(error: unknown, resourceName: string) {
    super(error instanceof Error ? error.message : String(error));
    this.resourceName = resourceName;
  }
}

export class ConflictError extends AppError {
  public readonly name = "ConflictError" as const;
  public readonly resourceName: string;
  constructor(error: unknown, resourceName: string) {
    super(error instanceof Error ? error.message : String(error));
    this.resourceName = resourceName;
  }
}

export class DomainError extends AppError {
  public readonly name = "DomainError" as const;
  public readonly domain: string;
  constructor(error: unknown, domain: string) {
    super(error instanceof Error ? error.message : String(error));
    this.domain = domain;
  }
}

export class ValidationError extends AppError {
  public readonly name = "ValidationError" as const;
  public readonly code: string;
  public readonly field?: string;
  constructor(error: unknown, code: string, field?: string) {
    super(error instanceof Error ? error.message : String(error));
    this.code = code;
    this.field = field;
  }
}

export class DatabaseError extends AppError {
  public readonly name = "DatabaseError" as const;
  constructor(error: unknown) {
    super(error instanceof Error ? error.message : String(error));
  }
}

export class ApiError extends AppError {
  public readonly name = "ApiError" as const;
  constructor(error: unknown) {
    super(error instanceof Error ? error.message : String(error));
  }
}
