import { getPrisma } from "@packages/db";
import { ResultAsync } from "neverthrow";
import { DatabaseError } from "../../../domain/error";
import type {
  CreateUserInput,
  DeleteUserInput,
  GetUserByEmailInput,
  GetUserByUsernameInput,
  GetUserInput,
  ListUsersInput,
  UpdateUserInput,
  User,
} from "../../../domain/model/user";

/**
 * Create a new user
 */
export const createUser = (
  input: CreateUserInput,
): ResultAsync<User, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.user.create({
      data: {
        clientId: input.clientId,
        username: input.username,
        email: input.email,
        passwordHash: input.passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    (error) => new DatabaseError(error),
  ).map(
    (user): User => ({
      userId: user.userId,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
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
): ResultAsync<User | null, DatabaseError> => {
  const prisma = getPrisma();

  // Build update data object with only provided fields
  const updateData: {
    username?: string;
    email?: string;
    passwordHash?: string;
    updatedAt: Date;
  } = {
    updatedAt: new Date(),
  };

  if (input.username !== undefined) {
    updateData.username = input.username;
  }
  if (input.email !== undefined) {
    updateData.email = input.email;
  }
  if (input.passwordHash !== undefined) {
    updateData.passwordHash = input.passwordHash;
  }

  return ResultAsync.fromPromise(
    prisma.user.update({
      where: {
        userId: input.userId,
      },
      data: updateData,
    }),
    (error) => new DatabaseError(error),
  ).map(
    (user): User => ({
      userId: user.userId,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
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
): ResultAsync<{ count: number }, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.user.delete({
      where: {
        userId: input.userId,
      },
    }),
    (error) => new DatabaseError(error),
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
        userId: input.userId,
      },
    }),
    (error) => new DatabaseError(error),
  ).map((user): User | null => {
    if (!user) return null;
    return {
      userId: user.userId,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
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
      userId: user.userId,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
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
      userId: user.userId,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
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
      userId: user.userId,
      clientId: user.clientId,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
  );
};
