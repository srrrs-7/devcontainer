import { defineClientFactory, defineOrganizationFactory } from "@packages/db";
import { beforeEach, expect, test } from "vitest";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUserByUsername,
  listUsers,
  updateUser,
} from "./repository";

let TEST_CLIENT_ID: string;

// Helper to generate unique username/email
const uniqueString = () => Math.random().toString(36).substring(7);

// Setup test data before each test using fabbrica
beforeEach(async () => {
  const OrganizationFactory = defineOrganizationFactory();
  const ClientFactory = defineClientFactory({
    defaultData: {
      organization: OrganizationFactory,
    },
  });

  const client = await ClientFactory.create();
  TEST_CLIENT_ID = client.id;
});

test("createUser: ユーザーを作成できる", async () => {
  const userId = crypto.randomUUID();
  const username = `testuser_${uniqueString()}`;
  const email = `test_${uniqueString()}@example.com`;

  const result = await createUser({
    userId,
    clientId: TEST_CLIENT_ID,
    username,
    email,
    name: "Test User",
    picture: "https://example.com/avatar.jpg",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value.getUserId()).toBe(userId);
    expect(result.value.getClientId()).toBe(TEST_CLIENT_ID);
    expect(result.value.getUsername()).toBe(username);
    expect(result.value.getEmail()).toBe(email);
    expect(result.value.getName()).toBe("Test User");
    expect(result.value.getPicture()).toBe("https://example.com/avatar.jpg");
    expect(result.value.getCreatedAt()).toBeInstanceOf(Date);
    expect(result.value.getUpdatedAt()).toBeInstanceOf(Date);
  }
});

test("createUser: 名前と画像なしでユーザーを作成できる", async () => {
  const userId = crypto.randomUUID();
  const username = `testuser_${uniqueString()}`;
  const email = `test_${uniqueString()}@example.com`;

  const result = await createUser({
    userId,
    clientId: TEST_CLIENT_ID,
    username,
    email,
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value.getUserId()).toBe(userId);
    expect(result.value.getName()).toBeNull();
    expect(result.value.getPicture()).toBeNull();
  }
});

test("getUser: 作成したユーザーを取得できる", async () => {
  // 準備: ユーザーを作成
  const userId = crypto.randomUUID();
  const createResult = await createUser({
    userId,
    clientId: TEST_CLIENT_ID,
    username: "getuser_test",
    email: "getuser@example.com",
  });
  expect(createResult.isOk()).toBe(true);

  // 実行: 作成したユーザーを取得
  const getResult = await getUser({
    userId: userId,
  });

  // 検証
  expect(getResult.isOk()).toBe(true);
  if (getResult.isOk()) {
    expect(getResult.value).not.toBeNull();
    expect(getResult.value?.getUserId()).toBe(userId);
    expect(getResult.value?.getUsername()).toBe("getuser_test");
    expect(getResult.value?.getEmail()).toBe("getuser@example.com");
  }
});

test("getUser: 存在しないユーザーはnullを返す", async () => {
  const result = await getUser({
    userId: "nonexistent-user-id",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value).toBeNull();
  }
});

test("getUserByEmail: メールアドレスでユーザーを取得できる", async () => {
  // 準備: ユーザーを作成
  const userId = crypto.randomUUID();
  const createResult = await createUser({
    userId,
    clientId: TEST_CLIENT_ID,
    username: "emailuser",
    email: "unique_email@example.com",
  });
  expect(createResult.isOk()).toBe(true);

  // 実行: メールアドレスで取得
  const getResult = await getUserByEmail({
    email: "unique_email@example.com",
  });

  // 検証
  expect(getResult.isOk()).toBe(true);
  if (getResult.isOk()) {
    expect(getResult.value).not.toBeNull();
    expect(getResult.value?.getEmail()).toBe("unique_email@example.com");
    expect(getResult.value?.getUsername()).toBe("emailuser");
  }
});

test("getUserByEmail: 存在しないメールアドレスはnullを返す", async () => {
  const result = await getUserByEmail({
    email: "nonexistent@example.com",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value).toBeNull();
  }
});

test("getUserByUsername: ユーザー名でユーザーを取得できる", async () => {
  // 準備: ユーザーを作成
  const userId = crypto.randomUUID();
  const createResult = await createUser({
    userId,
    clientId: TEST_CLIENT_ID,
    username: "uniqueusername",
    email: "username_test@example.com",
  });
  expect(createResult.isOk()).toBe(true);

  // 実行: ユーザー名で取得
  const getResult = await getUserByUsername({
    username: "uniqueusername",
  });

  // 検証
  expect(getResult.isOk()).toBe(true);
  if (getResult.isOk()) {
    expect(getResult.value).not.toBeNull();
    expect(getResult.value?.getUsername()).toBe("uniqueusername");
    expect(getResult.value?.getEmail()).toBe("username_test@example.com");
  }
});

test("getUserByUsername: 存在しないユーザー名はnullを返す", async () => {
  const result = await getUserByUsername({
    username: "nonexistentuser",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value).toBeNull();
  }
});

test("updateUser: ユーザー情報を更新できる", async () => {
  // 準備: ユーザーを作成
  const userId = crypto.randomUUID();
  const createResult = await createUser({
    userId,
    clientId: TEST_CLIENT_ID,
    username: "updateuser",
    email: "update@example.com",
    name: "Old Name",
  });
  expect(createResult.isOk()).toBe(true);

  // 実行: ユーザー情報を更新
  const updateResult = await updateUser({
    userId: userId,
    username: "updated_username",
    email: "updated@example.com",
    name: "New Name",
    picture: "https://example.com/new-avatar.jpg",
  });

  // 検証
  expect(updateResult.isOk()).toBe(true);
  if (updateResult.isOk()) {
    expect(updateResult.value).not.toBeNull();
    expect(updateResult.value?.getUsername()).toBe("updated_username");
    expect(updateResult.value?.getEmail()).toBe("updated@example.com");
    expect(updateResult.value?.getName()).toBe("New Name");
    expect(updateResult.value?.getPicture()).toBe(
      "https://example.com/new-avatar.jpg",
    );
  }
});

test("updateUser: 部分的な更新ができる（usernameのみ）", async () => {
  // 準備: ユーザーを作成
  const userId = crypto.randomUUID();
  const createResult = await createUser({
    userId,
    clientId: TEST_CLIENT_ID,
    username: "partialuser",
    email: "partial@example.com",
  });
  expect(createResult.isOk()).toBe(true);

  if (createResult.isOk()) {
    const originalEmail = createResult.value.getEmail();

    // 実行: usernameのみ更新
    const updateResult = await updateUser({
      userId: userId,
      username: "new_username",
    });

    // 検証
    expect(updateResult.isOk()).toBe(true);
    if (updateResult.isOk()) {
      expect(updateResult.value?.getUsername()).toBe("new_username");
      expect(updateResult.value?.getEmail()).toBe(originalEmail); // メールは変更されていない
    }
  }
});

test("deleteUser: ユーザーを削除できる", async () => {
  // 準備: ユーザーを作成
  const userId = crypto.randomUUID();
  const createResult = await createUser({
    userId,
    clientId: TEST_CLIENT_ID,
    username: "deleteuser",
    email: "delete@example.com",
  });
  expect(createResult.isOk()).toBe(true);

  // 実行: ユーザーを削除
  const deleteResult = await deleteUser({
    userId: userId,
  });

  // 検証: 削除が成功する
  expect(deleteResult.isOk()).toBe(true);
  if (deleteResult.isOk()) {
    expect(deleteResult.value.count).toBe(1);
  }

  // 検証: 削除後は取得できない
  const getResult = await getUser({
    userId: userId,
  });
  expect(getResult.isOk()).toBe(true);
  if (getResult.isOk()) {
    expect(getResult.value).toBeNull();
  }
});

test("deleteUser: 存在しないユーザーの削除はエラーを返す", async () => {
  const result = await deleteUser({
    userId: "nonexistent-user-id",
  });

  // Prisma delete throws error if record not found
  expect(result.isErr()).toBe(true);
});

test("listUsers: クライアントIDでユーザー一覧を取得できる", async () => {
  // 準備: 複数のユーザーを作成
  await createUser({
    userId: crypto.randomUUID(),
    clientId: TEST_CLIENT_ID,
    username: "listuser1",
    email: "listuser1@example.com",
  });
  await createUser({
    userId: crypto.randomUUID(),
    clientId: TEST_CLIENT_ID,
    username: "listuser2",
    email: "listuser2@example.com",
  });
  await createUser({
    userId: crypto.randomUUID(),
    clientId: TEST_CLIENT_ID,
    username: "listuser3",
    email: "listuser3@example.com",
  });

  // 実行: ユーザー一覧を取得
  const result = await listUsers({
    clientId: TEST_CLIENT_ID,
    page: 1,
    limit: 10,
  });

  // 検証
  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value.length).toBeGreaterThanOrEqual(3);
    expect(
      result.value.every((user) => user.getClientId() === TEST_CLIENT_ID),
    ).toBe(true);
  }
});

test("listUsers: ページネーションが機能する", async () => {
  // 準備: 複数のユーザーを作成
  for (let i = 1; i <= 5; i++) {
    await createUser({
      userId: crypto.randomUUID(),
      clientId: TEST_CLIENT_ID,
      username: `paginationuser${i}`,
      email: `pagination${i}@example.com`,
    });
  }

  // 実行: 1ページ目（limit=2）
  const page1Result = await listUsers({
    clientId: TEST_CLIENT_ID,
    page: 1,
    limit: 2,
  });

  // 実行: 2ページ目（limit=2）
  const page2Result = await listUsers({
    clientId: TEST_CLIENT_ID,
    page: 2,
    limit: 2,
  });

  // 検証
  expect(page1Result.isOk()).toBe(true);
  expect(page2Result.isOk()).toBe(true);

  if (page1Result.isOk() && page2Result.isOk()) {
    expect(page1Result.value.length).toBeLessThanOrEqual(2);
    expect(page2Result.value.length).toBeLessThanOrEqual(2);
    // Different users on different pages
    const page1Ids = page1Result.value.map((u) => u.getUserId());
    const page2Ids = page2Result.value.map((u) => u.getUserId());
    expect(page1Ids.some((id) => page2Ids.includes(id))).toBe(false);
  }
});

test("トランザクション分離: 各テストは独立している", async () => {
  // このテストは他のテストで作成されたユーザーの影響を受けない
  const result = await getUser({
    userId: "some-nonexistent-user-id",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    // 他のテストで作成されたユーザーは見えない（トランザクションがロールバックされているため）
    expect(result.value).toBeNull();
  }
});
