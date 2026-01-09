import { getPrisma } from "@packages/db";
import dayjs from "dayjs";
import { ResultAsync } from "neverthrow";
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
} from "../../../domain/error/error";
import type {
  CreateUserInput,
  DeleteUserInput,
  GetUserByEmailInput,
  GetUserByUsernameInput,
  GetUserInput,
  ListUsersInput,
  UpdateUserInput,
  User,
} from "../../../domain/user/user";

/**
 * Create a new user (for Cognito-authenticated users)
 * The userId should be the Cognito sub claim
 */
export const createUser = (
  input: CreateUserInput,
): ResultAsync<User, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.user.create({
      data: {
        id: input.userId, // Cognito sub
        clientId: input.clientId,
        username: input.username,
        email: input.email,
        name: input.name ?? null,
        picture: input.picture ?? null,
        createdAt: dayjs().toDate(),
        updatedAt: dayjs().toDate(),
      },
    }),
    (error) => new DatabaseError(error),
  ).map(
    (user): User => ({
      userId: user.id,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }),
  );
};

/**
 * Update an existing user
 * Only updates fields that are provided (partial update)
 */
export const updateUser = (
  input: UpdateUserInput,
): ResultAsync<User | null, NotFoundError | ConflictError | DatabaseError> => {
  const prisma = getPrisma();

  // Build update data object with only provided fields
  const updateData: {
    username?: string;
    email?: string;
    name?: string | null;
    picture?: string | null;
    updatedAt: Date;
  } = {
    updatedAt: dayjs().toDate(),
  };

  if (input.username !== undefined) {
    updateData.username = input.username;
  }
  if (input.email !== undefined) {
    updateData.email = input.email;
  }
  if (input.name !== undefined) {
    updateData.name = input.name;
  }
  if (input.picture !== undefined) {
    updateData.picture = input.picture;
  }

  return ResultAsync.fromPromise(
    prisma.user.update({
      where: {
        id: input.userId,
      },
      data: updateData,
    }),
    (error) => {
      // Type guard for Prisma errors
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "string"
      ) {
        // P2025: Record not found
        if (error.code === "P2025") {
          return NotFoundError.fromPrismaNotFoundError(error, "User");
        }

        // P2002: Unique constraint violation (duplicate email/username)
        if (error.code === "P2002") {
          return new ConflictError(error, "User");
        }
      }

      // Other database errors
      return new DatabaseError(error);
    },
  ).map(
    (user): User => ({
      userId: user.id,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }),
  );
};

/**
 * Delete a user by userId
 */
export const deleteUser = (
  input: DeleteUserInput,
): ResultAsync<
  { count: number },
  NotFoundError | ConflictError | DatabaseError
> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.user.delete({
      where: {
        id: input.userId,
      },
    }),
    (error) => {
      // Type guard for Prisma errors
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "string"
      ) {
        // P2025: Record not found
        if (error.code === "P2025") {
          return NotFoundError.fromPrismaNotFoundError(error, "User");
        }

        // P2003, P2014, P2002: Constraint violations
        if (["P2003", "P2014", "P2002"].includes(error.code)) {
          return new ConflictError(error, "User");
        }
      }

      // Other database errors
      return new DatabaseError(error);
    },
  ).map(() => ({ count: 1 }));
};

/**
 * Get a user by userId
 */
export const getUser = (
  input: GetUserInput,
): ResultAsync<User | null, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.user.findUnique({
      where: {
        id: input.userId,
      },
    }),
    (error) => new DatabaseError(error),
  ).map((user): User | null => {
    if (!user) return null;
    return {
      userId: user.id,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
};

/**
 * Get a user by email (unique)
 */
export const getUserByEmail = (
  input: GetUserByEmailInput,
): ResultAsync<User | null, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.user.findUnique({
      where: {
        email: input.email,
      },
    }),
    (error) => new DatabaseError(error),
  ).map((user): User | null => {
    if (!user) return null;
    return {
      userId: user.id,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
};

/**
 * Get a user by username (unique)
 */
export const getUserByUsername = (
  input: GetUserByUsernameInput,
): ResultAsync<User | null, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.user.findUnique({
      where: {
        username: input.username,
      },
    }),
    (error) => new DatabaseError(error),
  ).map((user): User | null => {
    if (!user) return null;
    return {
      userId: user.id,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
};

/**
 * List users by clientId with pagination
 */
export const listUsers = (
  input: ListUsersInput,
): ResultAsync<User[], DatabaseError> => {
  const prisma = getPrisma();

  const page = input.page ?? 1;
  const limit = input.limit ?? 20;
  const skip = (page - 1) * limit;

  return ResultAsync.fromPromise(
    prisma.user.findMany({
      where: {
        clientId: input.clientId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    (error) => new DatabaseError(error),
  ).map((users): User[] =>
    users.map((user) => ({
      userId: user.id,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
  );
};
