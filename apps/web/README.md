# Web App

React 19 フロントエンドアプリケーション。Bun ネイティブサーバーと Bulletproof React アーキテクチャを採用。

## 技術スタック

- **React 19** - UIライブラリ
- **Bun** - ランタイム・バンドラー・開発サーバー
- **TanStack Query** - データフェッチング・キャッシュ管理
- **shadcn/ui** - UIコンポーネントライブラリ (Radix UI + Tailwind CSS)
- **Tailwind CSS v4** - ユーティリティファーストCSS
- **AWS Amplify** - Cognito認証 (PKCE flow)
- **TypeScript** - 型安全性

## コマンド

```bash
# 開発サーバー起動 (HMR有効)
bun dev

# 本番ビルド
bun build

# 本番モード起動
bun start

# 型チェック
bun check:type
```

## ディレクトリ構造

```
src/
├── app/                    # アプリケーション層
│   ├── index.ts            # エクスポート
│   ├── provider.tsx        # グローバルプロバイダー (QueryClient, Auth)
│   ├── router.tsx          # ルーティング
│   └── routes/             # ルートコンポーネント
│       ├── index.ts
│       └── home.tsx
│
├── assets/                 # 静的アセット
│   ├── index.ts            # アセットエクスポート
│   ├── logo.svg
│   └── react.svg
│
├── components/             # 共有UIコンポーネント
│   ├── ui/                 # shadcn/ui コンポーネント
│   │   ├── index.ts        # UIコンポーネントエクスポート
│   │   ├── button.tsx      # Button (variants: default, destructive, outline, etc.)
│   │   ├── card.tsx        # Card, CardHeader, CardTitle, CardContent, etc.
│   │   ├── input.tsx       # Input
│   │   ├── select.tsx      # Select (Radix UI)
│   │   ├── badge.tsx       # Badge
│   │   └── alert-dialog.tsx # AlertDialog (確認ダイアログ)
│   ├── layouts/            # レイアウトコンポーネント
│   └── errors/             # エラー表示コンポーネント
│
├── config/                 # 設定
│   ├── amplify.ts          # AWS Amplify設定
│   └── env.ts              # 環境変数
│
├── features/               # 機能モジュール
│   ├── auth/               # 認証機能
│   │   ├── index.ts        # パブリックエクスポート
│   │   ├── components/     # 機能固有コンポーネント
│   │   ├── AuthContext.tsx # 認証状態管理
│   │   ├── AuthCallback.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── useApiClient.ts # 認証済みAPI呼び出し
│   ├── misc/               # 開発ツール
│   │   ├── index.ts
│   │   └── api-tester.tsx
│   └── tasks/              # タスク管理機能
│       ├── api/            # API関数
│       │   └── tasks-api.ts
│       ├── components/     # UIコンポーネント
│       │   ├── task-form.tsx
│       │   ├── task-item.tsx
│       │   └── task-list.tsx
│       ├── hooks/          # カスタムフック
│       │   ├── query-keys.ts # TanStack Query キー
│       │   └── use-tasks.ts  # タスクCRUDフック
│       └── types.ts        # 型定義 (re-export)
│
├── lib/                    # ユーティリティ
│   └── utils.ts            # cn() - Tailwindクラスマージ
│
├── frontend.tsx            # Reactエントリポイント
├── index.tsx               # サーバーエントリ (Bun.serve)
├── index.html              # HTMLテンプレート
└── index.css               # グローバルスタイル (Tailwind + shadcn/ui変数)
```

## アーキテクチャ原則

### Bulletproof React

[Bulletproof React](https://github.com/alan2207/bulletproof-react) アーキテクチャを採用。

#### 1. 機能ベース構造 (Feature-based Structure)

各機能は `features/` 配下で自己完結する：

```
features/
└── tasks/                  # タスク管理機能
    ├── index.ts            # パブリックAPI (外部公開)
    ├── api/                # API呼び出し
    │   └── tasks-api.ts
    ├── components/         # 機能固有コンポーネント
    │   ├── index.ts
    │   ├── task-form.tsx
    │   ├── task-item.tsx
    │   └── task-list.tsx
    ├── hooks/              # カスタムフック
    │   ├── index.ts
    │   ├── query-keys.ts
    │   └── use-tasks.ts
    └── types.ts            # 型定義
```

#### 2. 単方向インポート (Unidirectional Imports)

```
app/ → features/ → components/
         ↓
       config/
         ↓
        lib/
```

**禁止パターン:**
- `features/auth/` から `features/tasks/` への直接インポート
- `components/` から `features/` へのインポート

**解決策:**
- 共通ロジックは `lib/` または `hooks/` に抽出
- 共通コンポーネントは `components/` に配置

#### 3. エクスポート規則

```typescript
// features/tasks/index.ts - パブリックAPI
export { TaskForm, TaskItem, TaskList } from "./components";
export { taskKeys, useTasks } from "./hooks";
export type { Task, TaskListItem, CreateTaskInput } from "./types";
```

- 機能の `index.ts` のみが外部公開
- 内部実装への直接インポートは禁止
- コンポーネントディレクトリ内のバレルファイルは内部用

#### 4. コロケーション (Colocation)

関連ファイルは近くに配置：

```
features/tasks/
├── components/
│   ├── task-list.tsx
│   ├── task-list.test.tsx    # テスト
│   └── task-list.css         # スタイル (必要時)
├── api/
│   └── tasks-api.ts
└── types.ts
```

## UIコンポーネント (shadcn/ui)

[shadcn/ui](https://ui.shadcn.com/) ベースのUIコンポーネント。Radix UIプリミティブ + Tailwind CSSで構築。

### 使用可能なコンポーネント

```typescript
import {
  Button,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Input,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Badge,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogAction, AlertDialogCancel,
} from "../components/ui";
```

### Button

```tsx
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
    <CardDescription>説明文</CardDescription>
  </CardHeader>
  <CardContent>
    コンテンツ
  </CardContent>
  <CardFooter>
    <Button>アクション</Button>
  </CardFooter>
</Card>
```

### Select

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="選択してください" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">オプション1</SelectItem>
    <SelectItem value="option2">オプション2</SelectItem>
  </SelectContent>
</Select>
```

### AlertDialog

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">削除</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
      <AlertDialogDescription>
        この操作は取り消せません。
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>キャンセル</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### ユーティリティ関数

```typescript
import { cn } from "../lib/utils";

// Tailwindクラスの条件付きマージ
<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" ? "primary-class" : "secondary-class"
)}>
```

## データフェッチング (TanStack Query)

[TanStack Query](https://tanstack.com/query) を使用したデータフェッチングとキャッシュ管理。

### キャッシュ戦略

```typescript
// provider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5分間はfresh
      gcTime: 1000 * 60 * 30,      // 30分後にガベージコレクション
      retry: 3,                     // 3回リトライ
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 3,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### Query Keyパターン

```typescript
// features/tasks/hooks/query-keys.ts
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...taskKeys.lists(), { page, limit }] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (taskId: string) => [...taskKeys.details(), taskId] as const,
};
```

### カスタムフック例

```typescript
// features/tasks/hooks/use-tasks.ts
export function useTasks(options: UseTasksOptions = {}): UseTasksResult {
  const api = useApiClient();
  const queryClient = useQueryClient();

  // クエリ
  const { data, isLoading, isFetching } = useQuery({
    queryKey: taskKeys.list(page, limit),
    queryFn: () => listTasksApi(api, page, limit),
  });

  // ミューテーション
  const createMutation = useMutation({
    mutationFn: (input: CreateTaskInput) => createTaskApi(api, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });

  return {
    tasks: data?.tasks ?? [],
    isLoading,
    isFetching,
    createTask: (input) => createMutation.mutateAsync(input),
    // ...
  };
}
```

### 使用方法

```typescript
import { useTasks } from "../features/tasks";

function TaskPage() {
  const {
    tasks,
    isLoading,
    isFetching,
    error,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks({ page: 1, limit: 20 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.taskId}
          task={task}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
}
```

## 新機能追加ガイド

### 1. 新しいFeatureを作成

```bash
mkdir -p src/features/[feature-name]/{components,api,hooks}
touch src/features/[feature-name]/index.ts
touch src/features/[feature-name]/types.ts
```

### 2. 構造テンプレート

```typescript
// src/features/[feature-name]/index.ts
export { FeatureComponent } from "./components";
export { useFeature } from "./hooks";
export type { FeatureType } from "./types";
```

### 3. Query Keysを定義

```typescript
// src/features/[feature-name]/hooks/query-keys.ts
export const featureKeys = {
  all: ["feature"] as const,
  lists: () => [...featureKeys.all, "list"] as const,
  list: (filters: Filters) => [...featureKeys.lists(), filters] as const,
  details: () => [...featureKeys.all, "detail"] as const,
  detail: (id: string) => [...featureKeys.details(), id] as const,
};
```

### 4. ルートに追加

```typescript
// src/app/router.tsx
import { FeaturePage } from "../features/[feature-name]";

export function AppRouter() {
  const path = useMemo(() => window.location.pathname, []);

  switch (path) {
    case "/[feature-name]":
      return <FeaturePage />;
    // ...
  }
}
```

## 認証

AWS Cognito + Amplify を使用。

### 設定

環境変数 (ビルド時に埋め込み):

```
BUN_PUBLIC_COGNITO_USER_POOL_ID=
BUN_PUBLIC_COGNITO_CLIENT_ID=
BUN_PUBLIC_COGNITO_DOMAIN=
BUN_PUBLIC_API_URL=
```

### 使用方法

```typescript
import { useAuth, useApiClient, ProtectedRoute } from "../features/auth";

// 認証状態の取得
function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  // ...
}

// 認証済みAPI呼び出し
function DataComponent() {
  const apiClient = useApiClient();

  const fetchData = async () => {
    const result = await apiClient("/api/data");
    if (result.isOk()) {
      // result.value にデータ
    }
  };
}

// 保護されたルート
<ProtectedRoute>
  <ProtectedContent />
</ProtectedRoute>
```

## スタイリング

### Tailwind CSS v4

CSS-firstな設定。`index.css` でカスタマイズ:

```css
@import "tailwindcss";

@theme {
  /* カスタムカラー等はここに定義 */
}
```

### shadcn/ui CSS変数

`index.css` でテーマ変数を定義:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  /* ... */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

## 開発サーバー

Bun.serve() を使用:

- **HMR**: `--hot` フラグで有効
- **ポート**: 3000
- **API プロキシ**: `index.tsx` の routes でバックエンドAPIへプロキシ

```typescript
// src/index.tsx
Bun.serve({
  routes: {
    "/": index,
    "/api/*": proxy("http://localhost:8080"),
  },
  development: {
    hmr: true,
    console: true,
  },
});
```

## ビルド

```bash
bun build ./src/index.html --outdir=dist --sourcemap --target=browser --minify
```

出力: `dist/` ディレクトリ

環境変数は `BUN_PUBLIC_*` プレフィックスで自動埋め込み。
