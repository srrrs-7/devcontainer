# Web App

React 19 フロントエンドアプリケーション。Bun ネイティブサーバーと Bulletproof React アーキテクチャを採用。

## 技術スタック

- **React 19** - UIライブラリ
- **Bun** - ランタイム・バンドラー・開発サーバー
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
│   ├── provider.tsx        # グローバルプロバイダー
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
│       ├── api/
│       └── components/
│
├── frontend.tsx            # Reactエントリポイント
├── index.tsx               # サーバーエントリ (Bun.serve)
├── index.html              # HTMLテンプレート
└── index.css               # グローバルスタイル
```

## アーキテクチャ原則

### Bulletproof React

[Bulletproof React](https://github.com/alan2207/bulletproof-react) アーキテクチャを採用。

#### 1. 機能ベース構造 (Feature-based Structure)

各機能は `features/` 配下で自己完結する：

```
features/
└── auth/                   # 認証機能
    ├── index.ts            # パブリックAPI (外部公開)
    ├── components/         # 機能固有コンポーネント
    │   ├── index.ts
    │   └── auth-status.tsx
    ├── hooks/              # 機能固有フック (必要時)
    ├── api/                # API呼び出し (必要時)
    ├── types/              # 型定義 (必要時)
    └── *.tsx               # ルートレベルの実装
```

#### 2. 単方向インポート (Unidirectional Imports)

```
app/ → features/ → components/
         ↓
       config/
```

**禁止パターン:**
- `features/auth/` から `features/tasks/` への直接インポート
- `components/` から `features/` へのインポート

**解決策:**
- 共通ロジックは `lib/` または `hooks/` に抽出
- 共通コンポーネントは `components/` に配置

#### 3. エクスポート規則

```typescript
// features/auth/index.ts - パブリックAPI
export { AuthProvider, useAuth } from "./AuthContext";
export { AuthStatus } from "./components/auth-status";
export { ProtectedRoute } from "./ProtectedRoute";
export { useApiClient } from "./useApiClient";
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
│   └── get-tasks.ts
└── types/
    └── task.ts
```

## 新機能追加ガイド

### 1. 新しいFeatureを作成

```bash
mkdir -p src/features/[feature-name]/{components,api,hooks,types}
touch src/features/[feature-name]/index.ts
```

### 2. 構造テンプレート

```typescript
// src/features/[feature-name]/index.ts
export { FeatureComponent } from "./components/feature-component";
export { useFeature } from "./hooks/use-feature";
export type { FeatureType } from "./types/feature";
```

### 3. ルートに追加

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
