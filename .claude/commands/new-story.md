기존 컴포넌트에 Storybook 스토리를 추가하거나, 컴포넌트가 변경된 경우 기존 스토리를 동기화합니다.
인자: `$ARGUMENTS` (예: `atoms/Button` 또는 `molecules/Card`)

## 작업 순서

### 1. 인자 파싱

`$ARGUMENTS`를 `{tier}/{ComponentName}` 형태로 파싱한다. `ComponentName`은 PascalCase(컴포넌트 export 이름)로 받되, 폴더 경로를 만들 때는 kebab-case로 변환한다 (예: `FloatButton` → `float-button`).

### 2. 컴포넌트 현재 상태 파악

먼저 컴포넌트가 서브컴포넌트 없는 단일 파일인지, 조합 컴포넌트(폴더)인지 확인한다.

- **단일 파일**: `packages/ui/src/components/{tier}/{kebab-case-name}.tsx`를 읽는다.
- **조합 컴포넌트**: `packages/ui/src/components/{tier}/{kebab-case-name}/index.ts`(배럴)를 읽어 공개 `Component.Sub` API를 파악하고, `packages/ui/src/components/{tier}/{kebab-case-name}/{kebab-case-name}.tsx`(메인 구현)를 읽어 `Props`를 파악한다.

다음을 파악한다:

- `Props` 인터페이스의 모든 prop과 타입
- variant, size 등 string union 옵션
- 서브컴포넌트 (`Component.Sub` 패턴)
- `'use client'` 여부 (상호작용 컴포넌트인지)
- 기본값(default value)

### 3. 기존 스토리 존재 여부 확인

`apps/docs/stories/{tier}/{kebab-case-name}/index.stories.tsx`를 읽는다.

**스토리가 없으면** → 4단계로 진행해 새로 생성한다.

**스토리가 있으면** → 아래 동기화 체크를 수행한다:

#### 동기화 체크 (컴포넌트 업데이트 시)

| 항목              | 확인 내용                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `argTypes`        | 컴포넌트 Props와 일치하는지. 제거된 prop이 남아 있거나, 추가된 prop이 누락되지 않았는지   |
| `args` 기본값     | 컴포넌트의 실제 default와 맞는지                                                          |
| 서브컴포넌트 사용 | `Component.Sub` API 변경이 반영됐는지                                                     |
| import            | 컴포넌트명 변경이나 named export 변경이 반영됐는지                                        |
| Story render      | 시맨틱 태그 변경(div→header 등)이 있어도 사용하는 쪽에서 주의할 내용 있으면 주석으로 안내 |

변경이 필요한 항목만 수정하고, 기존 스토리 구조와 Story 이름은 유지한다.

### 4. 스토리 작성 규칙

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ComponentName } from '@repo/ui';

const meta: Meta<typeof ComponentName> = {
  title: 'UI/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'padded', // fullscreen은 Layout처럼 뷰포트 전체를 써야 할 때만
  },
  argTypes: {
    // string union → select control
    variant: { control: { type: 'select' }, options: ['outlined', 'filled'] },
    // boolean → boolean control
    disabled: { control: { type: 'boolean' } },
    // 시각적으로 제어하기 어려운 prop은 table에서 숨김
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    classNames: { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default는 반드시 포함
export const Default: Story = {
  args: {
    /* 컴포넌트 기본값과 일치하게 */
  },
};

// 주요 variant마다 Story 추가
export const Outlined: Story = { args: { variant: 'outlined' } };
```

**스토리 추가 기준:**

- `Default` — 반드시 포함
- variant별 Story — string union prop이 있으면 각각 추가
- 서브컴포넌트 사용 예시 — `Component.Sub` 패턴이 있으면 조합 예시 추가
- wrapper가 필요한 경우 `render:` 속성 사용 (h-screen, p-6 등 레이아웃 필요 시)

**데모 컴포넌트 명명:**

- 스토리 내부에서 데모 UI를 별도 컴포넌트로 분리할 때는 `Demo` 접두사 사용
  (예: `DemoHeader`, `DemoContent`) — 컴포넌트 실제 서브컴포넌트와 혼동 방지

### 5. 완료 보고

- 생성/수정된 파일 경로
- 추가되거나 업데이트된 Story 목록
- 동기화 체크에서 변경한 항목 요약 (업데이트인 경우)
