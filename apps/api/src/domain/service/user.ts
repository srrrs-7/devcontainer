import * as bcrypt from "bcrypt";
import { ResultAsync } from "neverthrow";

const SALT_ROUNDS = 10;

/**
 * パスワードをハッシュ化する
 * @param password - プレーンテキストのパスワード
 * @returns ハッシュ化されたパスワードのResultAsync
 */
export const hashPassword = (password: string): ResultAsync<string, Error> => {
  return ResultAsync.fromPromise(
    bcrypt.hash(password, SALT_ROUNDS),
    (error) => {
      if (error instanceof Error) {
        return error;
      }
      return new Error("Failed to hash password");
    },
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
): ResultAsync<boolean, Error> => {
  return ResultAsync.fromPromise(bcrypt.compare(password, hash), (error) => {
    if (error instanceof Error) {
      return error;
    }
    return new Error("Failed to verify password");
  });
};
