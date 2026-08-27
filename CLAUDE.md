# ui-kit CLAUDE.md

## 프로젝트 개요

pnpm + turborepo 기반 모노레포. `packages/ui`가 퍼블리시되는 React 컴포넌트 라이브러리이며, `apps/docs`가 Next.js + Storybook 문서 앱이다.

**이 저장소는 재사용 가능한 UI 컴포넌트의 정본(canonical home)이다.** `live-editor` 같은 앱 저장소에서 새 컴포넌트를 만들 때, 그게 다른 프로젝트에서도 쓸 만한 범용 UI 프리미티브/합성 컴포넌트라면 그 앱 저장소에 바로 구현하지 말고 여기(`packages/ui`)에 먼저 구현하고 배포한 뒤 의존성으로 가져다 쓰게 한다. 자세한 판단 기준과 절차는 `.claude/skills/coding-style/SKILL.md`의 "D. 재사용 가능한 UI/훅은 공유 라이브러리에 먼저 구현" 참고.

```
ui-kit/
├── apps/
│   ├── docs/          # Next.js + Storybook (port 3001 / storybook port 6006)
│   └── web/           # Docusaurus 랜딩 페이지 (port 3000)
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

컴포넌트는 서브컴포넌트 유무에 따라 두 가지 형태로 구성한다.

- **서브컴포넌트가 없는 컴포넌트**: `{계층}/{kebab-case-name}.tsx` 파일 하나로 구성한다 (폴더 없음). 예: `atoms/button.tsx`.
- **서브컴포넌트가 있는 컴포넌트(조합 컴포넌트)**: `{계층}/{kebab-case-name}/` 폴더를 유지하고 아래처럼 분리한다.
  - `{kebab-case-name}.tsx` — 메인 구현. `Component.Sub = Sub` 부착은 여기서 하지 않는다.
  - 서브컴포넌트마다 파일 하나 (`{sub}.tsx`. 그 서브컴포넌트에 또 서브컴포넌트가 있으면 동일 규칙을 재귀 적용해 폴더로, 예: `menu/item/`)
  - `index.ts` — 순수 배럴. 메인 컴포넌트와 서브컴포넌트(들)를 import해 `Component.Sub = Sub`를 부착하고, `export default Component`와 `export type { Props }`(및 기존에 내보내던 다른 named export)를 재노출한다.

**폴더명/파일명은 kebab-case, 컴포넌트/Props 이름은 PascalCase**를 유지한다 (예: 파일 `float-button/float-button.tsx`, 컴포넌트 `FloatButton`). 서브컴포넌트도 동일하게 적용한다 (예: `typography/title.tsx` → `Typography.Title`).

### 코어 프리미티브

`src/core/`에 shadcn 스타일 Radix UI 래퍼가 있다. 컴포넌트는 이 코어를 직접 임포트해서 확장한다.

```ts
import { button } from '@repo/ui/core';

const Core = button.Button;
```

`@repo/ui/core`는 **내부 전용**이다 — 패키지의 public export(`exports` 맵)에서 제거됐으므로(#278 ④) 외부 소비자는 `@jbpark/ui-kit/core`로 import할 수 없다. 위 임포트는 라이브러리 내부 소스에서만 tsconfig 별칭으로 해석된다.

Radix가 이미 담당하는 영역(focus trap/management, 포털 마운트, `aria-*` 배선, 팝오버·드롭다운 위치 계산)은 직접 재구현하지 않는다 — 새 훅/컴포넌트를 만들 때 이 영역은 기본적으로 제외 대상으로 삼는다.

단, 이건 "Radix가 커버 못 하는 영역은 아예 다루지 않는다"는 뜻이 아니다. Radix에 대응 프리미티브가 없는 컴포넌트(예: 커스텀 인터랙션, 이 라이브러리만의 UX 패턴)는 필요하면 그대로 개발한다. 기준은 "Radix가 이미 잘 하는 걸 다시 만들지 말자"이지 "Radix 밖은 다루지 말자"가 아니다.

#### 무엇이 `src/core`에 속하는가 (멤버십 기준)

`src/core`에는 성격이 다른 두 종류의 모듈이 섞여 들어오기 쉽다. 하나만 남긴다:

> **`src/core`에는 (a) 둘 이상의 파트를 조합·배선하는 모듈, 또는 (b) 무거운 서드파티 의존성(`react-day-picker`, `vaul`, `react-resizable-panels`)을 감싸는 래퍼만 둔다. DOM 요소 하나 + 클래스 문자열짜리는 그걸 소유한 atom에 둔다.**

오늘 기준으로 적용하면:

- **속함 (조합형)** — `select`, `dialog`, `drawer`, `resizable`, `accordion`, `popover`, `radio-group`, `checkbox`, `switch`, `progress`, `calendar`, `field`. 실제 Radix 파트 트리·포털·애니메이션 배선을 담당하므로 소비 atom이 override할 이유가 없다.
- **속하지 않음 (단일 요소)** — `button`, `badge`, `input`, `textarea`, `skeleton`. DOM 요소 하나 + 클래스뿐이라 스타일 자체가 정체성이고, 소비 atom이 결국 그걸 덮어쓴다.
- **경계선** — `label`, `separator` (Radix 파트 1개씩, 실질 기여는 `htmlFor` 배선 / `role="separator"`). 기본값으로 흘려보내지 말고 그때그때 명시적으로 판단한다.

**왜**: 단일 요소 프리미티브는 스타일을 `core`에 위임할 수 없다 — 그런 컴포넌트는 스타일이 곧 정체성이라, 소비자가 반드시 override하게 되고 프리미티브는 간접 참조만 남긴다. 반면 다중 파트 프리미티브는 **구조·배선**을 위임하므로 소비자가 덮어쓸 이유가 없다 (그래서 `dialog`/`select`엔 이 문제가 없다). 이 기준이 없으면 새 컴포넌트가 죄다 "core 프리미티브를 감싼다"로 기본 수렴한다.

#### smell 체크

> **atom이 `core` 프리미티브의 `variant`를 하드코딩하고 있으면, 그 프리미티브는 잘못된 레이어에 있는 것이다.**

기계적으로 감지 가능하다:

```bash
grep -rn 'variant="' packages/ui/src/components/ | grep -v 'resolvedVariant\|{variant}'
```

`core`로 직접 향하는 히트가 나오면 그 프리미티브를 소비 atom으로 흡수할 후보다. (`float-button`/`modal` 등이 **우리 자신의 `Button`**에 넘기는 `variant=`는 정상 — `core` 프리미티브로 곧장 가는 것만 문제다.)

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
- 서브컴포넌트는 `Component.Sub = SubComponent` 패턴으로 연결하되, 이 연결은 조합 컴포넌트의 `index.ts` 배럴에서 수행한다 (예: `splitter/index.ts`가 `Splitter.Panel = Panel`을 부착; 메인 구현 파일 `splitter.tsx`는 부착 로직을 갖지 않는다)
- 컴포넌트 폴더/파일명은 kebab-case (예: `atoms/float-button/float-button.tsx`), 컴포넌트 파일 내부의 export 이름은 PascalCase 그대로 유지
- **배럴에서 부착할 때는 반드시 명시적 교차 타입으로 캐스팅한다.** import된 함수 값에 직접 `Main.Sub = Sub`를 대입하면 TS2339 에러가 난다 (TypeScript의 "expando property" 지원은 같은 파일에서 로컬 선언된 함수에만 적용되고, import된 바인딩에는 적용되지 않는다):

  ```ts
  import MainImpl, { type Props } from './main';
  import Sub from './sub';
  
  type MainComponent = typeof MainImpl & { Sub: typeof Sub };
  
  const Main = MainImpl as MainComponent;
  
  Main.Sub = Sub;
  
  export default Main;
  export type { Props };
  ```

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

1. 컴포넌트 파일:
   - 서브컴포넌트 없음: `{tier}/my-component.tsx`에서 `export default MyComponent` + `export type { Props }`
   - 서브컴포넌트 있음(조합 컴포넌트): `{tier}/my-component/my-component.tsx`가 구현을 담당하고, `{tier}/my-component/index.ts` 배럴이 `export default MyComponent` + `export type { Props }`(및 서브컴포넌트 부착)를 담당
2. 계층 index: `src/components/{계층}/index.ts`에 `export { default as MyComponent } from './my-component'` 추가 (export 별칭은 PascalCase, import 경로는 kebab-case — 조합 컴포넌트든 아니든 동일하게 `./my-component`로 참조하면 되고, 폴더/파일 어느 쪽이든 자동으로 resolve된다)
3. 루트 `src/index.ts`는 계층 index를 re-export하므로 별도 수정 불필요

## apps/docs — Storybook 스토리 작성

파일 위치: `stories/{atoms|molecules|organisms}/{kebab-case-name}/index.stories.tsx` (packages/ui 폴더명과 동일하게 kebab-case)

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MyComponent } from '@repo/ui';

const meta: Meta<typeof MyComponent> = {
  title: 'UI/MyComponent', // 'UI/' 프리픽스 유지
  component: MyComponent,
  argTypes: {/* ... */},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {/* ... */},
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

| 항목          | 기술                                                                            |
| ------------- | ------------------------------------------------------------------------------- |
| 런타임        | React 19, Node ≥18                                                              |
| 언어          | TypeScript 5.9                                                                  |
| 스타일        | Tailwind CSS v4                                                                 |
| UI 프리미티브 | Radix UI                                                                        |
| 아이콘        | lucide-react                                                                    |
| 애니메이션    | motion (framer), GSAP                                                           |
| 패키지 매니저 | pnpm 10                                                                         |
| 모노레포      | turborepo                                                                       |
| 빌드          | tsdown                                                                          |
| 포맷          | prettier (single quote, 2 spaces, trailing comma)                               |
| 릴리스        | changesets (main의 Version Packages PR 버전 승격) + npm OIDC Trusted Publishing |

---

## 유용한 스킬 (슬래시 커맨드)

### `/run`

앱을 실제로 실행해서 변경 사항을 브라우저에서 확인할 때 사용.
Storybook이나 apps/web(Docusaurus)을 띄워 UI를 직접 검증한다.

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
