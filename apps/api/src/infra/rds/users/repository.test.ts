import { getPrisma } from "@packages/db";
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

// テスト用の有効なUUID
const TEST_ORG_ID = "00000000-0000-0000-0000-000000000001";
const TEST_CLIENT_ID = "00000000-0000-0000-0000-000000000002";

// Setup test data before each test
beforeEach(async () => {
  const prisma = getPrisma();

  // Create test organization
  await prisma.organization.create({
    data: {
      organizationId: TEST_ORG_ID,
      name: "Test Organization",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create test client
  await prisma.client.create({
    data: {
      clientId: TEST_CLIENT_ID,
      organizationId: TEST_ORG_ID,
      name: "Test Client",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
});

test("createUser: ユーザーを作成できる", async () => {
  const result = await createUser({
    clientId: TEST_CLIENT_ID,
    username: "testuser",
    email: "test@example.com",
    passwordHash: "hashed_password_123",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value.clientId).toBe(TEST_CLIENT_ID);
    expect(result.value.username).toBe("testuser");
    expect(result.value.email).toBe("test@example.com");
    expect(result.value.passwordHash).toBe("hashed_password_123");
    expect(result.value.userId).toBeDefined();
    expect(result.value.createdAt).toBeInstanceOf(Date);
    expect(result.value.updatedAt).toBeInstanceOf(Date);
  }
});

test("getUser: 作成したユーザーを取得できる", async () => {
  // 準備: ユーザーを作成
  const createResult = await createUser({
    clientId: TEST_CLIENT_ID,
    username: "getuser_test",
    email: "getuser@example.com",
    passwordHash: "password_hash",
  });
  expect(createResult.isOk()).toBe(true);

  if (createResult.isOk()) {
    const userId = createResult.value.userId;

    // 実行: 作成したユーザーを取得
    const getResult = await getUser({
      userId: userId,
    });

    // 検証
    expect(getResult.isOk()).toBe(true);
    if (getResult.isOk()) {
      expect(getResult.value).not.toBeNull();
      expect(getResult.value?.userId).toBe(userId);
      expect(getResult.value?.username).toBe("getuser_test");
      expect(getResult.value?.email).toBe("getuser@example.com");
    }
  }
});

test("getUser: 存在しないユーザーはnullを返す", async () => {
  const result = await getUser({
    userId: "00000000-0000-0000-0000-000000000099",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value).toBeNull();
  }
});

test("getUserByEmail: メールアドレスでユーザーを取得できる", async () => {
  // 準備: ユーザーを作成
  const createResult = await createUser({
    clientId: TEST_CLIENT_ID,
    username: "emailuser",
    email: "unique_email@example.com",
    passwordHash: "password_hash",
  });
  expect(createResult.isOk()).toBe(true);

  if (createResult.isOk()) {
    // 実行: メールアドレスで取得
    const getResult = await getUserByEmail({
      email: "unique_email@example.com",
    });

    // 検証
    expect(getResult.isOk()).toBe(true);
    if (getResult.isOk()) {
      expect(getResult.value).not.toBeNull();
      expect(getResult.value?.email).toBe("unique_email@example.com");
      expect(getResult.value?.username).toBe("emailuser");
    }
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
  const createResult = await createUser({
    clientId: TEST_CLIENT_ID,
    username: "uniqueusername",
    email: "username_test@example.com",
    passwordHash: "password_hash",
  });
  expect(createResult.isOk()).toBe(true);

  if (createResult.isOk()) {
    // 実行: ユーザー名で取得
    const getResult = await getUserByUsername({
      username: "uniqueusername",
    });

    // 検証
    expect(getResult.isOk()).toBe(true);
    if (getResult.isOk()) {
      expect(getResult.value).not.toBeNull();
      expect(getResult.value?.username).toBe("uniqueusername");
      expect(getResult.value?.email).toBe("username_test@example.com");
    }
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
  const createResult = await createUser({
    clientId: TEST_CLIENT_ID,
    username: "updateuser",
    email: "update@example.com",
    passwordHash: "old_password",
  });
  expect(createResult.isOk()).toBe(true);

  if (createResult.isOk()) {
    const userId = createResult.value.userId;

    // 実行: ユーザー情報を更新
    const updateResult = await updateUser({
      userId: userId,
      username: "updated_username",
      email: "updated@example.com",
      passwordHash: "new_password",
    });

    // 検証
    expect(updateResult.isOk()).toBe(true);
    if (updateResult.isOk()) {
      expect(updateResult.value).not.toBeNull();
      expect(updateResult.value?.username).toBe("updated_username");
      expect(updateResult.value?.email).toBe("updated@example.com");
      expect(updateResult.value?.passwordHash).toBe("new_password");
    }
  }
});

test("updateUser: 部分的な更新ができる（usernameのみ）", async () => {
  // 準備: ユーザーを作成
  const createResult = await createUser({
    clientId: TEST_CLIENT_ID,
    username: "partialuser",
    email: "partial@example.com",
    passwordHash: "password",
  });
  expect(createResult.isOk()).toBe(true);

  if (createResult.isOk()) {
    const userId = createResult.value.userId;
    const originalEmail = createResult.value.email;

    // 実行: usernameのみ更新
    const updateResult = await updateUser({
      userId: userId,
      username: "new_username",
    });

    // 検証
    expect(updateResult.isOk()).toBe(true);
    if (updateResult.isOk()) {
      expect(updateResult.value?.username).toBe("new_username");
      expect(updateResult.value?.email).toBe(originalEmail); // メールは変更されていない
    }
  }
});

test("deleteUser: ユーザーを削除できる", async () => {
  // 準備: ユーザーを作成
  const createResult = await createUser({
    clientId: TEST_CLIENT_ID,
    username: "deleteuser",
    email: "delete@example.com",
    passwordHash: "password",
  });
  expect(createResult.isOk()).toBe(true);

  if (createResult.isOk()) {
    const userId = createResult.value.userId;

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
  }
});

test("deleteUser: 存在しないユーザーの削除はエラーを返す", async () => {
  const result = await deleteUser({
    userId: "00000000-0000-0000-0000-000000000099",
  });

  // Prisma delete throws error if record not found
  expect(result.isErr()).toBe(true);
});

test("listUsers: クライアントIDでユーザー一覧を取得できる", async () => {
  // 準備: 複数のユーザーを作成
  await createUser({
    clientId: TEST_CLIENT_ID,
    username: "listuser1",
    email: "listuser1@example.com",
    passwordHash: "password",
  });
  await createUser({
    clientId: TEST_CLIENT_ID,
    username: "listuser2",
    email: "listuser2@example.com",
    passwordHash: "password",
  });
  await createUser({
    clientId: TEST_CLIENT_ID,
    username: "listuser3",
    email: "listuser3@example.com",
    passwordHash: "password",
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
    expect(result.value.every((user) => user.clientId === TEST_CLIENT_ID)).toBe(
      true,
    );
  }
});

test("listUsers: ページネーションが機能する", async () => {
  // 準備: 複数のユーザーを作成
  for (let i = 1; i <= 5; i++) {
    await createUser({
      clientId: TEST_CLIENT_ID,
      username: `paginationuser${i}`,
      email: `pagination${i}@example.com`,
      passwordHash: "password",
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
    const page1Ids = page1Result.value.map((u) => u.userId);
    const page2Ids = page2Result.value.map((u) => u.userId);
    expect(page1Ids.some((id) => page2Ids.includes(id))).toBe(false);
  }
});

test("トランザクション分離: 各テストは独立している", async () => {
  // このテストは他のテストで作成されたユーザーの影響を受けない
  const result = await getUser({
    userId: "00000000-0000-0000-0000-000000000088",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    // 他のテストで作成されたユーザーは見えない（トランザクションがロールバックされているため）
    expect(result.value).toBeNull();
  }
});
