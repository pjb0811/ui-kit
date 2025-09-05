# @repo/ui

공통 React UI 컴포넌트 라이브러리입니다. 다양한 계층의 컴포넌트와 핵심 로직, 유틸리티, 훅을 제공합니다.

## 폴더 구조

```
src/
  components/
    atoms/        # 최소 단위 컴포넌트 (Button, Checkbox 등)
    molecules/    # 여러 atom을 조합한 컴포넌트 (Collapse, Dropdown 등)
    organisms/    # 복잡한 UI 블록 (Drawer, Modal 등)
    templates/    # 페이지 레이아웃 구성 요소
  core/           # 핵심 UI 로직 (button, dialog 등)
  deprecated/     # 이전 버전 컴포넌트
  lib/
    enums/        # 열거형 타입
    hooks/        # 커스텀 훅
    utils/        # 유틸리티 함수
  globals.css     # 전체 스타일
  index.ts        # 패키지 진입점
```

## 주요 라이브러리

- **React** / **React DOM**
- **TypeScript**
- **Tailwind CSS** / **PostCSS**
- **Radix UI** (Accordion, Dialog, Progress, Slot, Switch)
- **GSAP React**
- **Lucide React**
- **Swiper**
- **vaul**
- **class-variance-authority**, **clsx**, **tailwind-merge**
- **react-use**, **@uidotdev/usehooks**
- **uuid**
- 기타 유틸리티 및 애니메이션 관련 라이브러리

## 설치 및 사용법

```sh
pnpm add @repo/ui
# 또는
yarn add @repo/ui
```

컴포넌트 사용 예시:

```tsx
import { Button } from '@repo/ui';

export default function Example() {
  return <Button>버튼</Button>;
}
```

## 스타일 커스터마이징

- `globals.css`에서 전체 스타일을 관리합니다.
- Tailwind 설정은 `tailwind.config.js`에서 커스터마이즈 가능합니다.

---
