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
  constructor(resourceName: string) {
    super("Resource not found");
    this.resourceName = resourceName;
  }
}

export class ValidationError extends AppError {
  public readonly name = "ValidationError" as const;
  public readonly code: string;
  public readonly field?: string;
  constructor(code: string, field?: string) {
    super("Validation failed");
    this.code = code;
    this.field = field;
  }
}

export class DatabaseError extends AppError {
  public readonly name = "DatabaseError" as const;
  public readonly error: string;
  constructor(error: unknown) {
    super("Database operation failed");
    this.error = String(error);
  }
}

export class ApiError extends AppError {
  public readonly name = "ApiError" as const;
  public readonly error: string;
  constructor(error: unknown) {
    super("API operation failed");
    this.error = String(error);
  }
}
