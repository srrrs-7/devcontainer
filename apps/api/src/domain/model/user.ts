/**
 * User domain model and input types
 */

export type User = {
  userId: string;
  clientId: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  clientId: string;
  username: string;
  email: string;
  passwordHash: string;
};

export const createUserInput = (
  clientId: string,
  username: string,
  email: string,
  passwordHash: string,
): CreateUserInput => ({
  clientId,
  username,
  email,
  passwordHash,
});

export type UpdateUserInput = {
  userId: string;
  username?: string;
  email?: string;
  passwordHash?: string;
};

export const updateUserInput = (
  userId: string,
  data: {
    username?: string;
    email?: string;
    passwordHash?: string;
  },
): UpdateUserInput => ({
  userId,
  ...data,
});

export type DeleteUserInput = {
  userId: string;
};

export const deleteUserInput = (userId: string): DeleteUserInput => ({
  userId,
});

export type GetUserInput = {
  userId: string;
};

export const getUserInput = (userId: string): GetUserInput => ({
  userId,
});

export type GetUserByEmailInput = {
  email: string;
};

export const getUserByEmailInput = (email: string): GetUserByEmailInput => ({
  email,
});

export type GetUserByUsernameInput = {
  username: string;
};

export const getUserByUsernameInput = (
  username: string,
): GetUserByUsernameInput => ({
  username,
});

export type ListUsersInput = {
  clientId: string;
  page?: number;
  limit?: number;
};

export const listUsersInput = (
  clientId: string,
  page = 1,
  limit = 20,
): ListUsersInput => ({
  clientId,
  page,
  limit,
});
