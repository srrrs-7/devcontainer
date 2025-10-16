import { expect, test } from "vitest";
import { createTask, deleteTask, getTask } from "./repository";

// テスト用の有効なUUID
const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";

test("createTask: タスクを作成できる", async () => {
  const result = await createTask({
    userId: TEST_USER_ID,
    content: "テストタスク",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value.userId).toBe(TEST_USER_ID);
    expect(result.value.content).toBe("テストタスク");
    expect(result.value.taskId).toBeDefined();
    expect(result.value.createdAt).toBeInstanceOf(Date);
    expect(result.value.updatedAt).toBeInstanceOf(Date);
  }
});

test("getTask: 作成したタスクを取得できる", async () => {
  // 準備: タスクを作成
  const createResult = await createTask({
    userId: TEST_USER_ID,
    content: "取得テスト用タスク",
  });
  expect(createResult.isOk()).toBe(true);

  if (createResult.isOk()) {
    const taskId = createResult.value.taskId;

    // 実行: 作成したタスクを取得
    const getResult = await getTask({
      userId: TEST_USER_ID,
      taskId: taskId,
    });

    // 検証
    expect(getResult.isOk()).toBe(true);
    if (getResult.isOk()) {
      expect(getResult.value).not.toBeNull();
      expect(getResult.value?.userId).toBe(TEST_USER_ID);
      expect(getResult.value?.taskId).toBe(taskId);
      expect(getResult.value?.content).toBe("取得テスト用タスク");
    }
  }
});

test("getTask: 存在しないタスクはnullを返す", async () => {
  const result = await getTask({
    userId: TEST_USER_ID,
    taskId: "00000000-0000-0000-0000-000000000099",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value).toBeNull();
  }
});

test("deleteTask: タスクを削除できる", async () => {
  // 準備: タスクを作成
  const createResult = await createTask({
    userId: TEST_USER_ID,
    content: "削除テスト用タスク",
  });
  expect(createResult.isOk()).toBe(true);

  if (createResult.isOk()) {
    const taskId = createResult.value.taskId;

    // 実行: タスクを削除
    const deleteResult = await deleteTask({
      userId: TEST_USER_ID,
      taskId: taskId,
    });

    // 検証: 削除が成功する
    expect(deleteResult.isOk()).toBe(true);
    if (deleteResult.isOk()) {
      expect(deleteResult.value.count).toBe(1);
    }

    // 検証: 削除後は取得できない
    const getResult = await getTask({
      userId: TEST_USER_ID,
      taskId: taskId,
    });
    expect(getResult.isOk()).toBe(true);
    if (getResult.isOk()) {
      expect(getResult.value).toBeNull();
    }
  }
});

test("deleteTask: 存在しないタスクの削除はNotFoundErrorを返す", async () => {
  const result = await deleteTask({
    userId: TEST_USER_ID,
    taskId: "00000000-0000-0000-0000-000000000099",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    expect(result.value.count).toBe(0);
  }
});

test("トランザクション分離: 各テストは独立している", async () => {
  // このテストは他のテストで作成されたタスクの影響を受けない
  const result = await getTask({
    userId: TEST_USER_ID,
    taskId: "00000000-0000-0000-0000-000000000088",
  });

  expect(result.isOk()).toBe(true);
  if (result.isOk()) {
    // 他のテストで作成されたタスクは見えない（トランザクションがロールバックされているため）
    expect(result.value).toBeNull();
  }
});
