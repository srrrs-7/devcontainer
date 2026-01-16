# Storybook

UIコンポーネントのドキュメント・開発環境。shadcn/uiコンポーネントをStorybookで管理。

## 技術スタック

- **Storybook 8** - UIコンポーネントカタログ
- **React 19** - UIライブラリ
- **Vite** - ビルドツール
- **Tailwind CSS v4** - スタイリング
- **shadcn/ui** - コンポーネントライブラリ

## コマンド

```bash
# ルートから実行
bun storybook          # 開発サーバー起動 (port 6006)
bun storybook:build    # 静的ビルド

# または packages/storybook から直接実行
cd packages/storybook
bun dev                # 開発サーバー起動
bun build              # 静的ビルド
bun check:type         # 型チェック
```

## ディレクトリ構造

```
packages/storybook/
├── .storybook/
│   ├── main.ts          # Storybook設定
│   └── preview.ts       # グローバルプレビュー設定
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui コンポーネント
│   │       ├── alert-dialog.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       └── index.ts
│   ├── lib/
│   │   └── utils.ts     # cn() ユーティリティ
│   ├── stories/         # ストーリーファイル
│   │   ├── AlertDialog.stories.tsx
│   │   ├── Badge.stories.tsx
│   │   ├── Button.stories.tsx
│   │   ├── Card.stories.tsx
│   │   ├── Input.stories.tsx
│   │   └── Select.stories.tsx
│   └── styles.css       # Tailwind + shadcn/ui変数
├── package.json
├── tsconfig.json
└── README.md
```

## 登録済みコンポーネント

### Button
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon

### Card
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

### Input
- Types: text, email, password, number, etc.
- States: default, disabled, with label

### Badge
- Variants: default, secondary, destructive, outline

### Select
- Single select with groups
- States: default, disabled, with default value

### AlertDialog
- Confirmation dialogs
- Delete confirmation pattern

## 新しいStoryの追加

### 1. コンポーネントファイルを追加

```typescript
// src/components/ui/my-component.tsx
export function MyComponent({ ... }) {
  // ...
}
```

### 2. index.tsにエクスポートを追加

```typescript
// src/components/ui/index.ts
export { MyComponent } from "./my-component";
```

### 3. ストーリーファイルを作成

```typescript
// src/stories/MyComponent.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "../components/ui";

const meta = {
  title: "UI/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // コントロール定義
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // デフォルト引数
  },
};
```

## テーマ切り替え

Storybookツールバーからライト/ダークテーマを切り替え可能。

- Light: 白背景
- Dark: ダーク背景 (shadcn/ui dark mode)

## apps/web との同期

`packages/storybook/src/components/ui/` のコンポーネントは `apps/web/src/components/ui/` からコピーしています。

コンポーネントを更新した場合は、両方のディレクトリを同期してください：

```bash
# apps/web のコンポーネントを storybook にコピー
cp apps/web/src/components/ui/*.tsx packages/storybook/src/components/ui/
cp apps/web/src/lib/utils.ts packages/storybook/src/lib/

# パスの修正 (必要に応じて)
cd packages/storybook
sed -i 's|"../../../lib/utils"|"../../lib/utils"|g' src/components/ui/*.tsx
```

将来的には、共有UIパッケージ (`@packages/ui`) として切り出すことを検討してください。
