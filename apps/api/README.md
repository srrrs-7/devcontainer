# API App

Hono フレームワークによる REST API サーバー。neverthrow による Result ベースのエラーハンドリングと Prisma ORM を採用。

## 技術スタック

- **Hono** - 軽量 Web フレームワーク
- **Node.js** - ランタイム（@hono/node-server）
- **Prisma** - ORM (PostgreSQL)
- **neverthrow** - Result 型によるエラーハンドリング
- **Zod** - スキーマバリデーション
- **AWS Cognito** - JWT 認証

## コマンド

```bash
# 開発サーバー起動 (ファイル変更監視)
bun dev

# 本番ビルド
bun build

# 本番モード起動
bun start

# テスト実行
bun test

# テスト (watch mode)
bun test:watch

# 特定のテスト実行
bun test src/routes/v1/tasks/get.test.ts

# 型チェック
bun check:type
```

## ディレクトリ構造

```
src/
├── routes/                 # HTTP ハンドラー層
│   ├── v1/                 # API バージョン 1
│   │   ├── tasks/          # タスク関連エンドポイント
│   │   │   ├── get.ts      # GET /tasks/:id
│   │   │   ├── get.test.ts # テスト (co-located)
│   │   │   ├── list.ts     # GET /tasks
│   │   │   ├── post.ts     # POST /tasks
│   │   │   ├── put.ts      # PUT /tasks/:id
│   │   │   └── delete.ts   # DELETE /tasks/:id
│   │   └── users/          # ユーザー関連エンドポイント
│   ├── validation/         # Zod スキーマ
│   │   ├── schemas.ts      # 共通スキーマ
│   │   ├── tasks.ts        # タスク用スキーマ
│   │   └── users.ts        # ユーザー用スキーマ
│   └── response.ts         # レスポンスヘルパー
│
├── infra/                  # インフラストラクチャ層
│   └── rds/                # データベースアクセス
│       ├── tasks/          # タスク Repository
│       │   ├── repository.ts
│       │   └── repository.test.ts
│       └── users/          # ユーザー Repository
│
├── domain/                 # ドメイン層
│   ├── model/              # ドメインモデル
│   │   ├── task.ts
│   │   └── user.ts
│   └── error.ts            # エラー階層
│
├── middleware/             # Hono ミドルウェア
│   ├── requestId.ts        # リクエストID生成
│   ├── requestLogger.ts    # リクエストロギング
│   ├── bearerAuth.ts       # Bearer 認証
│   └── cognitoAuth.ts      # Cognito JWT 認証
│
└── index.ts                # エントリポイント
```

## アーキテクチャ

### 3層アーキテクチャ

```
HTTP Request
     ↓
┌─────────────────────────────────────┐
│  Routes Layer (routes/v1/)          │
│  - HTTP リクエスト/レスポンス処理      │
│  - Zod バリデーション                 │
│  - エラーハンドリング                 │
└─────────────────────────────────────┘
     ↓
┌─────────────────────────────────────┐
│  Repository Layer (infra/rds/)      │
│  - Prisma によるデータアクセス        │
│  - ResultAsync でエラー返却          │
│  - ドメインモデルへの変換            │
└─────────────────────────────────────┘
     ↓
┌─────────────────────────────────────┐
│  Domain Layer (domain/)             │
│  - ドメインモデル定義                │
│  - エラー型定義                      │
└─────────────────────────────────────┘
```

### データフロー

```
Request → Validation (Zod) → Repository (Prisma + neverthrow) → Response
              ↓                       ↓                            ↓
         400 Error              DatabaseError                  200/201/204
                                     ↓
                              Domain Error
                                     ↓
                            404/409/500 Error
```

## neverthrow によるエラーハンドリング

例外をスローせず、`Result` 型でエラーを表現：

```typescript
// Repository
export const getTask = (input: GetTaskInput): ResultAsync<Task | null, DatabaseError> => {
  return ResultAsync.fromPromise(
    prisma.tasks.findFirst({ where: { id: input.taskId } }),
    (error) => new DatabaseError(error),
  );
};

// Route handler
const result = await getTask({ taskId: id, userId });

if (result.isErr()) {
  return databaseErrorResponse(c, result.error);
}

if (!result.value) {
  return notFoundResponse(c, new NotFoundError("Task not found", "Task"));
}

return okResponse(c, result.value);
```

## エラー階層

```
AppError (base)
├── NotFoundError      → 404
├── ForbiddenError     → 403
├── UnauthorizedError  → 401
├── ConflictError      → 409
├── ValidationError    → 400 (ビジネスロジック)
├── DatabaseError      → 500
├── DomainError        → 500
└── ApiError           → 500
```

## バリデーション

Zod + @hono/zod-validator でリクエストを検証：

```typescript
import { zValidator } from "@hono/zod-validator";

export default new Hono().post(
  "/tasks",
  zValidator("header", userHeaderSchema, (result, c) => {
    if (!result.success) return validationErrorResponse(c, result.error.issues);
  }),
  zValidator("json", createTaskBodySchema, (result, c) => {
    if (!result.success) return validationErrorResponse(c, result.error.issues);
  }),
  async (c) => {
    const { "x-user-id": userId } = c.req.valid("header");
    const body = c.req.valid("json");
    // ...
  },
);
```

## 認証

AWS Cognito JWT 認証：

```typescript
import { cognitoAuthMiddleware } from "./middleware/cognitoAuth";

app.use("/api/*", cognitoAuthMiddleware());

// ユーザー情報取得
app.get("/api/tasks", (c) => {
  const { userId, email, groups } = c.get("user");
  // ...
});
```

## テスト

- **Vitest** でテスト実行
- **@chax-at/transactional-prisma-testing** でテスト分離（自動ロールバック）
- ルートファイルと co-located（同じディレクトリ）

```typescript
import { describe, it, expect } from "vitest";
import app from "./get";

describe("GET /tasks/:id", () => {
  it("should return task when found", async () => {
    const req = new Request("http://localhost/tasks/123", {
      headers: { "x-user-id": "user-123" },
    });
    const res = await app.request(req);
    expect(res.status).toBe(200);
  });
});
```

## 開発ガイドライン

### ルール

1. **例外をスローしない** - Repository は常に `ResultAsync` を返す
2. **レスポンスヘルパーを使用** - 直接 `c.json()` を呼ばない
3. **ユーザースコープでアクセス** - リソースは必ずユーザーに紐づける
4. **updatedAt を更新** - 更新時は必ず timestamp を更新

### 新機能追加フロー

1. Domain Model 定義 (`domain/model/`)
2. Validation Schema 定義 (`routes/validation/`)
3. Repository 実装 (`infra/rds/`)
4. Route Handler 実装 (`routes/v1/`)
5. Tests 実装 (co-located)
6. Route 登録 (`index.ts`)

## 環境変数

```
# サーバー設定
PORT=8080
LOG_LEVEL=info

# Cognito 認証
COGNITO_ISSUER=https://cognito-idp.{region}.amazonaws.com/{userPoolId}
COGNITO_JWKS_URI=https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
COGNITO_CLIENT_ID=xxxx

# データベース (packages/db で設定)
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DBNAME=mydb
```

## 詳細ドキュメント

より詳細な実装パターンとコード例については `CLAUDE.md` を参照。
