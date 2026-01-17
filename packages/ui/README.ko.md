# @jbpark/ui-kit

[English](./README.md) | **한글**

TypeScript와 Tailwind CSS를 기반으로 구축된 현대적이고 재사용 가능한 React UI 컴포넌트 라이브러리입니다. Atomic Design 패턴을 따라 체계적으로 조직되어 있으며 확장성을 고려하여 설계되었습니다.

## 📦 패키지 정보

- **패키지명**: `@jbpark/ui-kit`
- **라이선스**: MIT
- **패키지 매니저**: pnpm
- **Node.js 요구사항**: >= 18
- **React 요구사항**: ^18.0.0 || ^19.0.0

## 🏗 아키텍처

### Atomic Design 패턴

이 라이브러리는 Atomic Design 방법론을 따라 컴포넌트를 계층적으로 구성합니다:

```
src/
├── components/
│   ├── atoms/        # 🧬 원자 - 기본 UI 구성 요소
│   ├── molecules/    # 🔬 분자 - 원자들의 조합
│   ├── organisms/    # 🦠 유기체 - 복잡한 UI 블록
│   └── templates/    # 📄 템플릿 - 페이지 레이아웃
├── core/             # ⚙️ 핵심 UI 로직 (Radix UI 기반)
├── lib/
│   ├── enums/        # 📋 열거형 타입
│   ├── hooks/        # 🎣 커스텀 훅
│   └── utils/        # 🛠 유틸리티 함수
├── globals.css       # 🎨 전역 스타일
└── index.ts          # 📥 패키지 진입점
```

## 🧬 Atoms (원자)

기본적인 UI 구성 요소들

| 컴포넌트        | 설명                      | 하위 컴포넌트                        |
| --------------- | ------------------------- | ------------------------------------ |
| **Button**      | 다양한 스타일의 버튼      | -                                    |
| **Checkbox**    | 체크박스 및 그룹 체크박스 | `Group`                              |
| **FloatButton** | 플로팅 버튼               | `BackTop`                            |
| **Input**       | 입력 필드 컴포넌트        | `Search`, `TextArea`                 |
| **Progress**    | 진행률 표시 컴포넌트      | -                                    |
| **Skeleton**    | 로딩 스켈레톤             | `Button`, `Node`                     |
| **Spin**        | 로딩 스피너               | -                                    |
| **Switch**      | 토글 스위치               | -                                    |
| **Typography**  | 텍스트 컴포넌트           | `Link`, `Paragraph`, `Text`, `Title` |

## 🔬 Molecules (분자)

여러 원자들이 결합된 복합 컴포넌트들

| 컴포넌트     | 설명                     | 하위 컴포넌트 |
| ------------ | ------------------------ | ------------- |
| **Collapse** | 접을 수 있는 컨텐츠 영역 | -             |
| **Dropdown** | 드롭다운 메뉴            | -             |
| **Marquees** | 무한 스크롤 마키         | `Item`        |
| **Menu**     | 네비게이션 메뉴          | -             |
| **Reveals**  | 애니메이션 리빌          | `Item`        |
| **Space**    | 간격 조정 컴포넌트       | -             |

## 🦠 Organisms (유기체)

복잡한 UI 섹션들

| 컴포넌트   | 설명                     | 하위 컴포넌트 |
| ---------- | ------------------------ | ------------- |
| **Drawer** | 사이드 드로어            | -             |
| **List**   | 리스트 및 리스트 아이템  | `Item`        |
| **Modal**  | 모달 다이얼로그          | -             |
| **Swiper** | 슬라이더/캐러셀 컴포넌트 | `Slide`       |

## 📄 Templates (템플릿)

페이지 레이아웃 템플릿

| 컴포넌트   | 설명                 | 하위 컴포넌트                          |
| ---------- | -------------------- | -------------------------------------- |
| **Layout** | 전체 페이지 레이아웃 | `Header`, `Sider`, `Content`, `Footer` |

## 🛠 핵심 기능

### Core 모듈

Radix UI 기반의 접근성 우선 핵심 컴포넌트들:

- `accordion.tsx` - 아코디언 컴포넌트 (Radix UI 기반)
- `button.tsx` - 버튼 컴포넌트 (class-variance-authority로 variants 관리)
- `dialog.tsx` - 다이얼로그 컴포넌트 (Radix UI 기반)
- `drawer.tsx` - 드로어 컴포넌트 (Vaul 기반)
- `progress.tsx` - 진행률 컴포넌트 (Radix UI 기반)
- `skeleton.tsx` - 스켈레톤 컴포넌트
- `switch.tsx` - 스위치 컴포넌트 (Radix UI 기반)

### 유틸리티

- **`cn()`** - 클래스명 병합 유틸리티 (clsx + tailwind-merge)
- **`TEXT_LEVELS`** - 타이포그래피 레벨 상수

## 🚀 설치 및 사용법

### 설치

```bash
# npm
npm install @jbpark/ui-kit

# yarn
yarn add @jbpark/ui-kit

# pnpm
pnpm add @jbpark/ui-kit
```

### 기본 사용법

```tsx
import { Button, Layout, Typography } from '@jbpark/ui-kit';

import '@jbpark/ui-kit/style.css';

function App() {
  return (
    <Layout>
      <Typography.Title>안녕하세요!</Typography.Title>
      <Button variant="primary">클릭하세요</Button>
    </Layout>
  );
}
```

### 개별 컴포넌트 import

```tsx
// Typography 컴포넌트
// Menu 컴포넌트
import { Menu } from '@jbpark/ui-kit/Menu';
// Reveals 컴포넌트
import { Reveals } from '@jbpark/ui-kit/Reveals';
import { Typography } from '@jbpark/ui-kit/Typography';
```

### 유틸리티 및 열거형 import

```tsx
// 유틸리티 함수
// 열거형 상수
import { TEXT_LEVELS } from '@jbpark/ui-kit/enums';
import { cn } from '@jbpark/ui-kit/utils';
```

### 스타일 import

```tsx
// 전역 스타일 (필수)
import '@jbpark/ui-kit/style.css';
```

## 🎨 스타일링

### Tailwind CSS

- **Tailwind CSS 4** 기반
- **PostCSS** 처리
- **class-variance-authority**로 컴포넌트 variants 관리
- **tailwind-merge**로 클래스 충돌 해결

### 커스터마이징

```tsx
// 전역 스타일 import (필수)
import '@jbpark/ui-kit/style.css';

// tailwind.config.js에서 테마 커스터마이징
// Tailwind CSS 4를 사용하는 경우 PostCSS 설정 필요
```

## 📚 주요 의존성

### 핵심 라이브러리

- **React 19.1.0** - UI 라이브러리
- **TypeScript 5.9.2** - 정적 타입 체크
- **Tailwind CSS 4.1.12** - 유틸리티 CSS 프레임워크

### UI 라이브러리

- **Radix UI** - 접근성 우선 헤드리스 UI 컴포넌트
  - `@radix-ui/react-accordion` (1.2.12)
  - `@radix-ui/react-dialog` (1.1.15)
  - `@radix-ui/react-progress` (1.1.7)
  - `@radix-ui/react-slot` (1.2.3)
  - `@radix-ui/react-switch` (1.2.6)
- **Lucide React 0.542.0** - 아이콘 라이브러리
- **Motion 12.23.12** - 애니메이션 라이브러리
- **Swiper 11.2.10** - 터치 슬라이더
- **Vaul 1.1.2** - 드로어 컴포넌트

### 유틸리티

- **class-variance-authority 0.7.1** - 컴포넌트 variants 관리
- **clsx 2.1.1** - 조건부 클래스명
- **tailwind-merge 3.3.1** - Tailwind 클래스 병합
- **react-use 17.6.0** - React 훅 모음
- **@uidotdev/usehooks 2.4.1** - 추가 React 훅
- **uuid 11.1.0** - 고유 ID 생성
- **@gsap/react 2.1.2** - GSAP 애니메이션
- **tw-animate-css 1.3.7** - Tailwind 애니메이션

## 🔧 개발

이 패키지는 모노레포(pnpm 워크스페이스) 환경에서 개발됩니다.

### 타입 체크

```bash
pnpm run check-types
```

### 린팅

```bash
pnpm run lint
```

### 빌드

```bash
pnpm run build
```

### 컴포넌트 생성

```bash
pnpm run generate:component
```

## 📦 패키지 Exports

이 패키지는 다음과 같은 모듈들을 export합니다:

- `@jbpark/ui-kit` - 메인 패키지 (모든 컴포넌트)
- `@jbpark/ui-kit/Typography` - Typography 컴포넌트
- `@jbpark/ui-kit/Menu` - Menu 컴포넌트
- `@jbpark/ui-kit/Reveals` - Reveals 컴포넌트
- `@jbpark/ui-kit/utils` - 유틸리티 함수 (`cn` 등)
- `@jbpark/ui-kit/enums` - 열거형 상수 (`TEXT_LEVELS` 등)
- `@jbpark/ui-kit/style.css` - 전역 스타일 (필수)

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-component`)
3. 컴포넌트를 Atomic Design 패턴에 따라 적절한 폴더에 배치합니다
4. TypeScript 타입을 정의합니다
5. Storybook 스토리를 작성합니다
6. 변경사항을 커밋합니다 (`git commit -m 'Add amazing component'`)
7. 브랜치에 푸시합니다 (`git push origin feature/amazing-component`)
8. Pull Request를 생성합니다

## 📄 라이선스

MIT 라이선스 하에 있습니다.
