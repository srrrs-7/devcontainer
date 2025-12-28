# apps/api/CLAUDE.md

API アプリケーション固有の開発ガイドライン。ルート `/CLAUDE.md` の補足として、API レイヤーの詳細を記載。

## Architecture Overview

このアプリケーションは **3層アーキテクチャ** を採用：

```
apps/api/src/
├── routes/         → HTTP handlers (request/response, validation)
├── infra/rds/      → Data access layer (repositories with Prisma)
└── domain/         → Domain models and errors
```

**Service 層は現在存在しません**。ビジネスロジックは Repository 層に統合されています。

### Layer Responsibilities

#### 1. Routes Layer (`routes/v1/`)

**責務**:
- HTTP リクエスト/レスポンス処理
- Zod によるリクエストバリデーション
- Repository 呼び出しとレスポンスマッピング
- エラーハンドリングと適切な HTTP ステータスコード返却

**パターン**:
```typescript
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { okResponse, validationErrorResponse } from "../../response";
import { userHeaderSchema } from "../../validation/schemas";
import { taskIdParamSchema } from "../../validation/tasks";

type Response = {
  taskId: string;
  userId: string;
  content: string;
  completedAt: Date | null;
};

export default new Hono().get(
  "/task/:id",
  zValidator("param", taskIdParamSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  zValidator("header", userHeaderSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  (c) => {
    const { id } = c.req.valid("param");
    const { "x-user-id": userId } = c.req.valid("header");
    // Repository call would go here
    const response: Response = { /* ... */ };
    return okResponse(c, response);
  },
);
```

**重要な規約**:
- 各ルートは独立した Hono インスタンスをエクスポート
- テストファイルと co-located（例: `get.ts` と `get.test.ts`）
- バリデーションは `zValidator` ミドルウェアで実行
- レスポンスは `routes/response.ts` のヘルパー関数を使用

#### 2. Repository Layer (`infra/rds/`)

**責務**:
- Prisma を使用したデータベースアクセス
- データベースエラーをドメインエラーに変換
- `ResultAsync<T, DatabaseError>` 型で結果を返却
- ドメインモデルへのマッピング

**パターン**:
```typescript
import { getPrisma } from "@packages/db";
import { ResultAsync } from "neverthrow";
import { DatabaseError } from "../../../domain/error";
import type { GetTaskInput, Task } from "../../../domain/model/task";

export const getTask = (
  input: GetTaskInput,
): ResultAsync<Task | null, DatabaseError> => {
  const prisma = getPrisma();

  return ResultAsync.fromPromise(
    prisma.tasks.findFirst({
      where: {
        id: input.taskId,
        users: {
          some: {
            id: input.userId,
          },
        },
      },
    }),
    (error) => new DatabaseError(error),
  ).map((task): Task | null => {
    if (!task) return null;
    return {
      userId: input.userId,
      taskId: task.id,
      content: task.content,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  });
};
```

**重要な規約**:
- **NEVER throw exceptions** - 常に `ResultAsync` を返す
- エラーは `DatabaseError` でラップ
- Prisma のレコードをドメインモデルに変換
- `getPrisma()` で Prisma クライアントを取得（直接インポートしない）

#### 3. Domain Layer (`domain/`)

**責務**:
- ドメインモデル定義（`model/`）
- ドメインエラー階層定義（`error.ts`）

**エラー階層**:
```typescript
AppError (abstract base class)
├── NotFoundError
├── ForbiddenError
├── UnauthorizedError
├── ConflictError
├── DomainError
├── ValidationError
├── DatabaseError
└── ApiError
```

**エラークラスの使用**:
- `NotFoundError`: リソースが見つからない場合（404）
- `ForbiddenError`: アクセス権限がない場合（403）
- `UnauthorizedError`: 認証が必要な場合（401）
- `ConflictError`: データ競合が発生した場合（409）
- `ValidationError`: ビジネスロジックレベルのバリデーションエラー
- `DatabaseError`: データベース操作エラー（500）
- `DomainError`: ドメインルール違反（500）
- `ApiError`: その他の予期しないエラー（500）

**Prisma P2025 エラーの処理**:
```typescript
import { NotFoundError } from "../../../domain/error";

try {
  const task = await prisma.tasks.update({ /* ... */ });
} catch (error) {
  // P2025 (Record not found) を NotFoundError に変換
  throw NotFoundError.fromPrismaNotFoundError(error, "Task");
}
```

## Error Handling with neverthrow

**neverthrow** は例外をスローせずに Result 型でエラーを表現するライブラリ。

### 基本的な使い方

```typescript
import { ok, err, Result, ResultAsync } from "neverthrow";

// Sync operation
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return err("Division by zero");
  return ok(a / b);
}

// Async operation
function fetchUser(id: string): ResultAsync<User, DatabaseError> {
  return ResultAsync.fromPromise(
    prisma.user.findUnique({ where: { id } }),
    (error) => new DatabaseError(error),
  );
}
```

### Result チェーンパターン

```typescript
// Route handler example
export default new Hono().get("/task/:id", async (c) => {
  const { id } = c.req.valid("param");
  const { "x-user-id": userId } = c.req.valid("header");

  const result = await getTask({ taskId: id, userId });

  if (result.isErr()) {
    return databaseErrorResponse(c, result.error);
  }

  const task = result.value;
  if (!task) {
    return notFoundResponse(c, new NotFoundError("Task not found", "Task"));
  }

  return okResponse(c, task);
});
```

### Result の組み合わせ

```typescript
// 複数の Result を組み合わせる
const result = await ResultAsync.combine([
  getUserById(userId),
  getTaskById(taskId),
]);

if (result.isErr()) {
  // どれか1つでも失敗した場合
  return databaseErrorResponse(c, result.error);
}

const [user, task] = result.value;
```

### andThen による連鎖

```typescript
const result = await getUser(userId)
  .andThen((user) => validateUser(user))
  .andThen((validUser) => createTask(validUser.id, taskData));

if (result.isErr()) {
  return domainErrorResponse(c, result.error);
}

return createdResponse(c, result.value);
```

**重要なルール**:
- Repository 関数は常に `Result` または `ResultAsync` を返す
- **NEVER use try/catch** in repository layer - use `ResultAsync.fromPromise`
- Route handlers で `isErr()` / `isOk()` をチェック
- エラーは適切なレスポンスヘルパー関数でマップ

## Validation

### Request Validation with Zod

**バリデーションスキーマの定義** (`routes/validation/`):

```typescript
import { z } from "zod";

// Path parameter schema
export const taskIdParamSchema = z.object({
  id: z.string().uuid(),
});

// Header schema
export const userHeaderSchema = z.object({
  "x-user-id": z.string().uuid(),
});

// Body schema
export const createTaskBodySchema = z.object({
  content: z.string().min(1).max(1000),
  dueDate: z.string().datetime().optional(),
});
```

**Route での使用**:

```typescript
import { zValidator } from "@hono/zod-validator";

export default new Hono().post(
  "/task",
  zValidator("header", userHeaderSchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  zValidator("json", createTaskBodySchema, (result, c) => {
    if (!result.success) {
      return validationErrorResponse(c, result.error.issues);
    }
  }),
  async (c) => {
    const userId = c.req.valid("header")["x-user-id"];
    const body = c.req.valid("json");
    // ...
  },
);
```

**バリデーション対象**:
- `"param"`: URL パスパラメータ
- `"query"`: クエリストリング
- `"header"`: HTTP ヘッダー
- `"json"`: JSON リクエストボディ
- `"form"`: フォームデータ

**重要な規約**:
- スキーマは `routes/validation/` に集約
- リソースごとにファイルを分ける（`tasks.ts`, `users.ts` など）
- 共通スキーマは `schemas.ts` に定義
- エラーレスポンスは統一された `validationErrorResponse` を使用

### Business Logic Validation

ビジネスロジックレベルのバリデーションは `ValidationError` を使用:

```typescript
if (task.completedAt && newDueDate < task.completedAt) {
  return err(
    new ValidationError(
      "Due date cannot be earlier than completion date",
      "INVALID_DUE_DATE",
      "dueDate",
    ),
  );
}
```

## Response Helpers

**すべてのレスポンスは `routes/response.ts` のヘルパー関数を使用**:

```typescript
// Success responses
okResponse(c, data);              // 200 OK
createdResponse(c, data);         // 201 Created
noContentResponse(c);             // 204 No Content

// Error responses
validationErrorResponse(c, issues);     // 400 Bad Request
unauthorizedResponse(c, error);         // 401 Unauthorized
forbiddenResponse(c, error);            // 403 Forbidden
notFoundResponse(c, error);             // 404 Not Found
conflictResponse(c, error);             // 409 Conflict
domainErrorResponse(c, error);          // 500 Internal Server Error
databaseErrorResponse(c, error);        // 500 Internal Server Error
unExpectedErrorResponse(c, error);      // 500 Internal Server Error
```

**重要な規約**:
- **NEVER** 直接 `c.json()` や `c.text()` を使用（レスポンスヘルパー経由で統一）
- エラーは自動的にロギングされる（`@packages/logger` 経由）
- HTTP ステータスコードはヘルパー関数が自動設定

## Testing

### Test Setup

- **Test runner**: Vitest（Bun native test runner ではない）
- **Database isolation**: `@chax-at/transactional-prisma-testing`
- **Setup file**: `apps/api/__test__/setup.ts`
- **Pattern**: ルートファイルと co-located（同じディレクトリ）

### Test Configuration

`vitest.config.ts` で設定:
- `LOG_LEVEL=silent` でテスト時のログを抑制
- Setup file で Prisma client をトランザクショナルクライアントでモック

### Writing Tests

**Route test example**:

```typescript
import { describe, it, expect } from "vitest";
import app from "./get";

describe("GET /task/:id", () => {
  it("should return task when found", async () => {
    // Arrange
    const req = new Request("http://localhost/task/123", {
      headers: { "x-user-id": "user-123" },
    });

    // Act
    const res = await app.request(req);

    // Assert
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toMatchObject({
      taskId: "123",
      userId: "user-123",
    });
  });

  it("should return 400 when id is invalid", async () => {
    const req = new Request("http://localhost/task/invalid", {
      headers: { "x-user-id": "user-123" },
    });

    const res = await app.request(req);

    expect(res.status).toBe(400);
  });
});
```

**Repository test example**:

```typescript
import { describe, it, expect } from "vitest";
import { getTask } from "./repository";
import { getPrisma } from "@packages/db";

describe("getTask", () => {
  it("should return task when found", async () => {
    // Arrange
    const prisma = getPrisma();
    const user = await prisma.users.create({
      data: { username: "test", passwordHash: "hash" },
    });
    const task = await prisma.tasks.create({
      data: {
        content: "Test task",
        createdAt: new Date(),
        updatedAt: new Date(),
        users: { connect: { id: user.id } },
      },
    });

    // Act
    const result = await getTask({
      taskId: task.id,
      userId: user.id,
    });

    // Assert
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toMatchObject({
        taskId: task.id,
        userId: user.id,
        content: "Test task",
      });
    }
  });
});
```

**重要な規約**:
- 各テストはトランザクション内で実行され、自動ロールバック
- `getPrisma()` でテスト用の Prisma クライアントを取得
- **NEVER** テストデータを手動でクリーンアップ（自動ロールバック）
- Arrange-Act-Assert パターンを使用

### Running Tests

```bash
# All tests
bun run test:run

# Watch mode
bun run test:watch

# Specific test file
cd apps/api && bun test src/routes/v1/tasks/get.test.ts

# Pattern matching
cd apps/api && bun test -t "should return task"
```

## Middleware

### Available Middleware (`middleware/`)

1. **Request ID Middleware** (`requestId.ts`)
   - 各リクエストに一意の `requestId` を生成
   - `@packages/logger` の AsyncLocalStorage と連携
   - すべてのログに自動的に `requestId` を付与

2. **Request Logger Middleware** (`requestLogger.ts`)
   - リクエスト/レスポンスをロギング
   - メソッド、パス、ステータスコード、レスポンスタイムを記録

3. **Bearer Auth Middleware** (`bearerAuth.ts`)
   - Bearer トークン認証
   - `Authorization: Bearer <token>` ヘッダーを検証

4. **Cognito Auth Middleware** (`cognitoAuth.ts`)
   - AWS Cognito JWT 検証（`jose` ライブラリ使用）
   - JWKS エンドポイントからの公開鍵取得とキャッシュ
   - ユーザーコンテキスト設定: `c.get("user")` で `AuthUser` 取得
   - グループベース認可: `requireGroups()` ミドルウェア

### Middleware Usage

```typescript
import { Hono } from "hono";
import { requestIdMiddleware, requestLoggerMiddleware, cognitoAuthMiddleware } from "./middleware";

const app = new Hono();

// Apply middleware globally
app.use("*", requestIdMiddleware());
app.use("*", requestLoggerMiddleware());
app.use("*", cognitoAuthMiddleware());

// Access authenticated user in route handlers
app.get("/task/:id", (c) => {
  const { userId } = c.get("user"); // Cognito sub
  // ...
});
```

## Authentication

**AWS Cognito** を使用した JWT 認証:

```typescript
// Route handler でユーザー情報を取得
const { userId, email, groups } = c.get("user");

// グループベース認可
import { requireGroups } from "./middleware/cognitoAuth";
app.use("/admin/*", requireGroups("admin"));
```

**必要な環境変数**:
- `COGNITO_ISSUER`: Cognito User Pool の issuer URL
- `COGNITO_JWKS_URI`: JWKS エンドポイント URL
- `COGNITO_CLIENT_ID`: SPA クライアント ID（オプション）

**重要な規約**:
- パスワード管理は Cognito に委譲（アプリケーションでパスワードを保存しない）
- User.id は Cognito sub（VARCHAR(128)、UUID ではない）
- アクセストークンのみ使用（`token_use: "access"`）

## Development Workflow

### Adding New Feature

新しい機能を追加する際の推奨ワークフロー:

1. **Domain Model 定義** (`domain/model/`)
   ```typescript
   export type Task = {
     userId: string;
     taskId: string;
     content: string;
     completedAt: Date | null;
   };
   ```

2. **Validation Schema 定義** (`routes/validation/`)
   ```typescript
   export const createTaskBodySchema = z.object({
     content: z.string().min(1),
   });
   ```

3. **Repository 実装** (`infra/rds/`)
   ```typescript
   export const createTask = (input: CreateTaskInput): ResultAsync<Task, DatabaseError> => {
     // Prisma operations with ResultAsync
   };
   ```

4. **Route Handler 実装** (`routes/v1/`)
   ```typescript
   export default new Hono().post("/task", zValidator(...), async (c) => {
     // Call repository and handle Result
   });
   ```

5. **Tests 実装**
   - Repository test: `infra/rds/tasks/repository.test.ts`
   - Route test: `routes/v1/tasks/post.test.ts`

6. **Route 登録** (`index.ts` または親ルート)
   ```typescript
   import taskPost from "./routes/v1/tasks/post";
   app.route("/api/v1", taskPost);
   ```

### Code Generation Workflow

Prisma スキーマ変更時:

1. `packages/db/prisma/schema.prisma` を編集
2. `bun run db:migrate:dev` でマイグレーション作成 + クライアント再生成
3. Repository layer で新しいフィールドを使用
4. Domain model 型を更新
5. テストを更新

## Common Patterns

### Pattern 1: CRUD Repository Functions

```typescript
// Create
export const createResource = (input: CreateInput): ResultAsync<Resource, DatabaseError>

// Read (single)
export const getResource = (input: GetInput): ResultAsync<Resource | null, DatabaseError>

// Read (list)
export const listResources = (input: ListInput): ResultAsync<Resource[], DatabaseError>

// Update
export const updateResource = (input: UpdateInput): ResultAsync<{ count: number }, DatabaseError>

// Delete
export const deleteResource = (input: DeleteInput): ResultAsync<{ count: number }, DatabaseError>
```

### Pattern 2: User-scoped Resource Access

リソースは必ずユーザーに紐づけてアクセス:

```typescript
prisma.tasks.findFirst({
  where: {
    id: taskId,
    users: {
      some: {
        id: userId,  // 必須: ユーザースコープ
      },
    },
  },
});
```

### Pattern 3: Timestamp Management

```typescript
// Create
prisma.tasks.create({
  data: {
    content: "...",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
});

// Update
prisma.tasks.update({
  data: {
    content: "...",
    updatedAt: new Date(),  // 必須: updatedAt を更新
  },
});
```

### Pattern 4: Null Handling with TypeScript

TypeScript strict mode (`noUncheckedIndexedAccess: true`) により、配列/オブジェクトアクセスには型ガードが必要:

```typescript
const task = tasks[0];  // Type: Task | undefined

// ❌ Bad
task.content;  // Error: Object is possibly 'undefined'

// ✅ Good
if (task) {
  task.content;  // OK
}

// ✅ Good (optional chaining)
task?.content;  // Type: string | undefined
```

## Important Don'ts

### ❌ NEVER

1. **NEVER throw exceptions in repository layer** - 常に `ResultAsync` を返す
2. **NEVER use try/catch in repository** - `ResultAsync.fromPromise` を使用
3. **NEVER store passwords in plain text** - 常に bcrypt でハッシュ化
4. **NEVER directly call `c.json()` in routes** - レスポンスヘルパーを使用
5. **NEVER skip request validation** - すべてのエンドポイントで Zod バリデーション
6. **NEVER access resources without user scope** - セキュリティ重要
7. **NEVER manually clean test data** - トランザクショナルテストが自動ロールバック
8. **NEVER forget to update `updatedAt`** - 更新時は必須

### ✅ ALWAYS

1. **ALWAYS use neverthrow `Result` types** for error handling
2. **ALWAYS validate requests with Zod schemas**
3. **ALWAYS use response helpers** from `routes/response.ts`
4. **ALWAYS scope data access by user**
5. **ALWAYS update `updatedAt` timestamp** on modifications
6. **ALWAYS write tests** for new routes and repositories
7. **ALWAYS use `getPrisma()`** instead of importing Prisma client directly
8. **ALWAYS map Prisma records to domain models** in repository layer

## Additional Resources

- **Hono documentation**: https://hono.dev/
- **neverthrow documentation**: https://github.com/supermacro/neverthrow
- **Zod documentation**: https://zod.dev/
- **Prisma documentation**: https://www.prisma.io/docs/
- **Vitest documentation**: https://vitest.dev/

## Questions?

このガイドに記載されていない内容や不明点があれば、既存のコードパターンを参照するか、ルート `/CLAUDE.md` の関連セクションを確認してください。
