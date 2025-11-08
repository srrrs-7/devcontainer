import * as bcrypt from "bcrypt";
import { ResultAsync } from "neverthrow";
import { DomainError } from "../error";

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

export type UpdateUserInput = {
  userId: string;
  username?: string;
  email?: string;
  passwordHash?: string;
};

export type DeleteUserInput = {
  userId: string;
};

export type GetUserInput = {
  userId: string;
};

export type GetUserByEmailInput = {
  email: string;
};

export type GetUserByUsernameInput = {
  username: string;
};

export type ListUsersInput = {
  clientId: string;
  page?: number;
  limit?: number;
};

const SALT_ROUNDS = 10;

/**
 * パスワードをハッシュ化する
 * @param password - プレーンテキストのパスワード
 * @returns ハッシュ化されたパスワードのResultAsync
 */
export const hashPassword = (
  password: string,
): ResultAsync<string, DomainError> => {
  return ResultAsync.fromPromise(
    bcrypt.hash(password, SALT_ROUNDS),
    (error) => new DomainError(error, "PasswordHashing"),
  );
};

/**
 * パスワードを検証する
 * @param password - プレーンテキストのパスワード
 * @param hash - ハッシュ化されたパスワード
 * @returns 検証結果のResultAsync
 */
export const verifyPassword = (
  password: string,
  hash: string,
): ResultAsync<boolean, DomainError> => {
  return ResultAsync.fromPromise(
    bcrypt.compare(password, hash),
    (error) => new DomainError(error, "PasswordVerification"),
  );
};
