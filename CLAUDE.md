# ui-kit CLAUDE.md

## 프로젝트 개요

pnpm + turborepo 기반 모노레포. `packages/ui`가 퍼블리시되는 React 컴포넌트 라이브러리이며, `apps/docs`가 Next.js + Storybook 문서 앱이다.

```
ui-kit/
├── apps/
│   ├── docs/          # Next.js + Storybook (port 3001 / storybook port 6006)
│   └── web/           # Next.js 앱
└── packages/
    ├── ui/            # @repo/ui — 퍼블리시 대상
    ├── eslint-config/
    └── typescript-config/
```

## 주요 커맨드

```bash
pnpm dev              # 전체 워크스페이스 dev 서버 실행
pnpm build            # 전체 빌드
pnpm lint             # 전체 lint
pnpm format           # prettier 포맷

# packages/ui 내부
pnpm generate:component   # turbo gen으로 컴포넌트 스캐폴딩
pnpm check-types          # 타입 체크
pnpm build                # tsdown 빌드

# apps/docs 내부
pnpm storybook            # Storybook dev (port 6006)
```

## packages/ui 컴포넌트 구조

### 계층 (Atomic Design)

```
src/components/
├── atoms/       # 단일 UI 요소 (Button, Input, Checkbox ...)
├── molecules/   # 복합 요소 (Card, Splitter, Menu ...)
├── organisms/   # 페이지 수준 패턴 (Modal, Drawer, List ...)
└── templates/   # 레이아웃
```

각 컴포넌트는 `{계층}/{kebab-case-name}/index.tsx` 한 파일로 구성한다.

**폴더명은 kebab-case, 컴포넌트/Props 이름은 PascalCase**를 유지한다 (예: 폴더 `float-button/`, 컴포넌트 `FloatButton`). 서브컴포넌트도 동일하게 적용한다 (예: `typography/title/index.tsx` → `Typography.Title`).

### 코어 프리미티브

`src/core/`에 shadcn 스타일 Radix UI 래퍼가 있다. 컴포넌트는 이 코어를 직접 임포트해서 확장한다.

```ts
import { button } from '@repo/ui/core';

const Core = button.Button;
```

### 컴포넌트 작성 패턴

```tsx
'use client';

// 상호작용이 있는 컴포넌트만 추가
import { someCore } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

// Props 인터페이스 이름은 항상 'Props'
export interface Props extends Omit<
  React.ComponentProps<typeof someCore>,
  '...'
> {
  variant?: 'outlined' | 'filled';
  classNames?: {
    // 내부 요소별 className 커스터마이징
    header?: string;
    body?: string;
  };
}

const MyComponent = ({
  className,
  classNames,
  variant = 'outlined',
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        'base-classes',
        variant === 'outlined' && 'border border-gray-200',
        className,
        // 마지막에 빈 주석으로 trailing comma 유지
      )}
      {...props}
    />
  );
};

export default MyComponent;
```

**필수 규칙:**

- Props 인터페이스 이름은 반드시 `Props` (컴포넌트명+Props 형태 금지)
- className은 `cn()`으로 병합, 사용자 className이 마지막에 오도록
- `cn()` 마지막 인자 뒤 `//` 빈 주석 (prettier trailing comma 방지용 관용 패턴)
- 하위 요소 커스터마이징은 `classNames` prop 패턴 사용
- 서브컴포넌트는 `Component.Sub = SubComponent` 패턴 (예: `Splitter.Panel`)
- 컴포넌트 폴더명은 kebab-case (예: `atoms/float-button/`), 컴포넌트 파일 내부의 export 이름은 PascalCase 그대로 유지

### 유틸리티

```ts
import { cn } from '@repo/ui/utils';
// clsx + tailwind-merge
import { renderConditional } from '@repo/ui/utils';

// optional ReactNode 렌더링
```

### 테마 / CSS 변수

Tailwind CSS v4 기반. `Config` 프로바이더로 CSS 변수 오버라이드 가능.
색상은 `--primary`, `--background` 등 CSS 변수를 통해 참조.

### 익스포트 관리

1. 컴포넌트 파일: `export default MyComponent` + `export type { Props }` (폴더명은 kebab-case, 예: `my-component/index.tsx`)
2. 계층 index: `src/components/{계층}/index.ts`에 `export { default as MyComponent } from './my-component'` 추가 (export 별칭은 PascalCase, import 경로는 kebab-case)
3. 루트 `src/index.ts`는 계층 index를 re-export하므로 별도 수정 불필요

## apps/docs — Storybook 스토리 작성

파일 위치: `stories/{atoms|molecules|organisms}/{kebab-case-name}/index.stories.tsx` (packages/ui 폴더명과 동일하게 kebab-case)

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MyComponent } from '@repo/ui';

const meta: Meta<typeof MyComponent> = {
  title: 'UI/MyComponent', // 'UI/' 프리픽스 유지
  component: MyComponent,
  argTypes: {
    /* ... */
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    /* ... */
  },
};
```

## 임포트 순서 (prettier 자동 정렬)

```ts
import 'react';

// 1. react
import 'next';

// 2. next
// 3. 서드파티
import '@repo/ui';

// 4. @repo/*
import './local';

// 5. 상대경로
```

## 기술 스택 요약

| 항목          | 기술                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| 런타임        | React 19, Node ≥18                                                                    |
| 언어          | TypeScript 5.9                                                                        |
| 스타일        | Tailwind CSS v4                                                                       |
| UI 프리미티브 | Radix UI                                                                              |
| 아이콘        | lucide-react                                                                          |
| 애니메이션    | motion (framer), GSAP                                                                 |
| 패키지 매니저 | pnpm 10                                                                               |
| 모노레포      | turborepo                                                                             |
| 빌드          | tsdown                                                                                |
| 포맷          | prettier (single quote, 2 spaces, trailing comma)                                     |
| 릴리스        | GitHub Actions 자동화 (changelog-develop.yml 버전 승격 + npm OIDC Trusted Publishing) |

---

## 유용한 스킬 (슬래시 커맨드)

### `/run`

앱을 실제로 실행해서 변경 사항을 브라우저에서 확인할 때 사용.
Storybook이나 Next.js 앱을 띄워 UI를 직접 검증한다.

### `/verify`

코드 변경이 실제로 의도대로 동작하는지 앱을 구동해 확인.
PR 반영 전 수동 검증이나 버그 픽스 후 회귀 확인에 활용.

### `/code-review`

현재 브랜치 diff를 대상으로 코드 리뷰.

- `/code-review` — 기본 리뷰
- `/code-review ultra` — 멀티 에이전트 클라우드 딥리뷰 (로컬 브랜치 전체)
- `/code-review ultra <PR번호>` — GitHub PR 딥리뷰
- `--fix` 옵션으로 지적사항 자동 수정 가능

### `/simplify`

변경된 코드에서 중복·비효율·불필요한 추상화를 찾아 정리.
버그 수정이 아닌 품질 개선 목적. 버그는 `/code-review` 사용.

### `/security-review`

현재 브랜치의 변경 사항을 대상으로 보안 취약점 검토.
외부 입력 처리, XSS, 의존성 이슈 등 확인.

### `/review <PR번호>`

GitHub PR 전체를 검토할 때 사용.

### `/init`

CLAUDE.md가 없는 새 패키지/앱 디렉터리에 진입했을 때 가이드 초기화.
