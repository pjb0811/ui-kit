# @jbpark/ui-kit

[English](./README.md) | [한국어](./README.ko.md)

TypeScript와 Tailwind CSS를 기반으로 구축된 현대적이고 재사용 가능한 React UI 컴포넌트 라이브러리입니다. Atomic Design 패턴을 따라 체계적으로 조직되어 있으며 확장성을 고려하여 설계되었습니다.

## 패키지 정보

- **패키지명**: `@jbpark/ui-kit`
- **라이선스**: MIT
- **패키지 매니저**: pnpm
- **Node.js 요구사항**: >= 20
- **React 요구사항**: ^19.0.0

## 아키텍처

### Atomic Design 패턴

이 라이브러리는 Atomic Design 방법론을 따라 컴포넌트를 계층적으로 구성합니다:

```
src/
├── components/
│   ├── atoms/        # 🧬 원자 - 기본 UI 구성 요소
│   ├── molecules/    # 🔬 분자 - 원자들의 조합
│   ├── organisms/    # 🦠 유기체 - 복잡한 UI 블록
│   └── templates/    # 📄 템플릿 - 페이지 레이아웃
├── core/             # ⚙️ 내부 Base UI 프리미티브 (export 안 됨)
├── lib/
│   ├── utils/        # 🛠 유틸리티 함수
│   ├── colors.ts     # 🎨 색상 토큰 해석
│   └── z-layers.ts   # 🪟 포털 공용 z-index 스케일
├── providers/        # 🧩 Config 프로바이더 및 테마
├── globals.css       # 🎨 전역 스타일
└── index.ts          # 📥 패키지 진입점
```

## Atoms (원자)

기본 UI 구성 요소

| 컴포넌트           | 설명                                               | 하위 컴포넌트                         |
| ------------------ | -------------------------------------------------- | ------------------------------------- |
| **AutoComplete**   | 입력하는 동안 일치하는 옵션을 제안하는 텍스트 입력 | -                                     |
| **Avatar**         | 이니셜·아이콘 대체 표시를 지원하는 프로필 이미지   | -                                     |
| **Badge**          | 다른 요소에 붙는 개수 또는 상태 점                 | -                                     |
| **Button**         | type, variant, size, 로딩 상태를 지원하는 버튼     | -                                     |
| **Cascader**       | 여러 단계로 중첩된 옵션에서 하나를 선택            | -                                     |
| **Checkbox**       | 단일 체크박스 또는 값 하나를 공유하는 그룹         | `Group`                               |
| **CodeEditor**     | CodeMirror 6 편집기 (개별 경로 전용, 아래 참고)    | -                                     |
| **ColorPicker**    | 팝오버에서 hex 색상을 고르는 스와치                | -                                     |
| **DatePicker**     | 단일 날짜를 고르는 캘린더 팝오버 버튼              | -                                     |
| **Divider**        | 가로·세로 구분선, 라벨 선택 가능                   | -                                     |
| **FloatButton**    | 뷰포트 모서리에 고정된 원형 버튼                   | `BackTop`                             |
| **Input**          | 텍스트 입력과 검색·숫자·OTP·여러 줄 변형           | `Search`, `Number`, `OTP`, `TextArea` |
| **Mentions**       | `@` 접두 토큰을 자동 완성하는 텍스트 영역          | -                                     |
| **Popover**        | 트리거에 붙어 뜨는 플로팅 패널                     | -                                     |
| **Progress**       | 퍼센트만큼 채워지는 가로·세로 막대                 | -                                     |
| **Radio**          | 단일 라디오 또는 상호 배타적 옵션 그룹             | `Group`                               |
| **Rate**           | 별점 입력                                          | -                                     |
| **RichTextEditor** | HTML 문자열을 다루는 TipTap 기반 편집기            | -                                     |
| **Segmented**      | 보기 전환용 단일 선택 컨트롤                       | -                                     |
| **Select**         | 하나 이상의 값을 고르는 드롭다운, 검색 지원        | -                                     |
| **Skeleton**       | 로딩 중 콘텐츠 모양을 흉내 내는 자리 표시          | `Button`, `Node`                      |
| **Slider**         | 드래그로 숫자 값이나 범위를 조절                   | -                                     |
| **Spin**           | 단독 또는 오버레이로 쓰는 로딩 표시                | -                                     |
| **Switch**         | 켜기/끄기 토글                                     | -                                     |
| **Tag**            | 콘텐츠 분류용 작은 라벨                            | -                                     |
| **TimePicker**     | 시간을 고르는 팝오버 버튼                          | -                                     |
| **ToggleGroup**    | 각각 독립적으로 눌리는 액션 버튼 그룹              | -                                     |
| **Tooltip**        | 호버·포커스 시 보이는 짧은 텍스트 힌트             | -                                     |
| **Typography**     | 제목, 본문, 문단, 링크                             | `Link`, `Paragraph`, `Text`, `Title`  |

## Molecules (분자)

여러 원자를 조합한 컴포넌트

| 컴포넌트         | 설명                                            | 하위 컴포넌트 |
| ---------------- | ----------------------------------------------- | ------------- |
| **Alert**        | 상태 색상과 선택적 액션이 있는 인라인 메시지    | -             |
| **Anchor**       | 현재 섹션을 강조하는 페이지 내 내비게이션       | -             |
| **Breadcrumb**   | 현재 페이지까지의 경로                          | -             |
| **Card**         | 제목을 선택할 수 있는 콘텐츠 컨테이너           | -             |
| **Collapse**     | 펼칠 수 있는 패널, 아코디언 모드 지원           | -             |
| **ContextMenu**  | 영역을 우클릭해 여는 메뉴                       | -             |
| **Descriptions** | 반응형 그리드로 표시하는 라벨-값 상세 정보      | -             |
| **Dropdown**     | 트리거에서 플로팅 `Menu`를 표시                 | -             |
| **Empty**        | "로드됐지만 비어 있음" 상태의 인라인 자리 표시  | -             |
| **Marquees**     | 계속 반복해 흐르는 콘텐츠 행                    | `Item`        |
| **Menu**         | 중첩 서브메뉴를 지원하는 내비게이션 메뉴        | -             |
| **Pagination**   | 긴 목록의 페이지 이동                           | -             |
| **Popconfirm**   | 동작 전에 확인을 묻는 팝오버                    | -             |
| **Reveals**      | 자식을 순차적으로 나타나게 하는 애니메이션      | `Item`        |
| **ScrollArea**   | 스타일된 스크롤바가 있는 스크롤 컨테이너        | -             |
| **Space**        | 자식을 가로·세로로 간격을 두고 배치             | -             |
| **Splitter**     | 드래그 핸들로 크기를 조절하는 패널              | `Panel`       |
| **Statistic**    | 제목과 단위가 있는 형식화된 지표                | -             |
| **Steps**        | 순서가 있는 작업 흐름의 단계                    | -             |
| **Tabs**         | 관련 콘텐츠 패널 사이를 전환                    | -             |
| **Timeline**     | 타임스탬프가 있는 순서형 이벤트                 | -             |
| **Transfer**     | 두 목록 사이로 항목 이동                        | -             |
| **Upload**       | 클릭·드래그 업로드 영역과 삭제 가능한 파일 목록 | -             |

## Organisms (유기체)

복잡한 UI 섹션

| 컴포넌트       | 설명                                                                  | 하위 컴포넌트                                                                               |
| -------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Calendar**   | 날짜 선택이나 날짜별 콘텐츠 표시용 월간 보기                          | -                                                                                           |
| **Drawer**     | 화면 가장자리에서 밀려 나오는 제어형 패널                             | -                                                                                           |
| **Form**       | 라벨, 설명, 오류 메시지가 있는 필드로 구성된 폼 레이아웃              | `Field`, `Control`                                                                          |
| **List**       | 로딩·빈 상태·무한 스크롤을 지원하는 목록                              | `Item`                                                                                      |
| **Modal**      | 제어형 또는 명령형으로 여는 다이얼로그                                | `confirm`, `info`, `success`, `warning`, `error`, `destroy`, `destroyAll`                   |
| **Swiper**     | Swiper.js 기반의 터치 캐러셀                                          | `Slide`                                                                                     |
| **Table**      | 셀 렌더링, 로딩·빈 상태, 선택적 페이지네이션을 지원하는 데이터 테이블 | -                                                                                           |
| **Toast**      | 자동으로 사라지는 명령형 알림                                         | `open`, `info`, `success`, `warning`, `error`, `loading`, `config`, `destroy`, `destroyAll` |
| **Tour**       | 요소에 붙어 단계별로 안내하는 가이드                                  | -                                                                                           |
| **Tree**       | 펼치기, 선택, 지연 로딩을 지원하는 계층 목록                          | -                                                                                           |
| **TreeSelect** | 옵션이 트리인 셀렉트                                                  | -                                                                                           |

## Templates (템플릿)

페이지 레이아웃 템플릿

| 컴포넌트       | 설명                                           | 하위 컴포넌트                          |
| -------------- | ---------------------------------------------- | -------------------------------------- |
| **Container**  | 최대 폭과 여백으로 페이지 콘텐츠를 가운데 정렬 | -                                      |
| **Grid**       | 24열 반응형 그리드 (`Row`, `Col` export)       | -                                      |
| **Layout**     | 헤더, 사이더, 콘텐츠, 푸터로 된 페이지 골격    | `Header`, `Sider`, `Content`, `Footer` |
| **PageHeader** | 뒤로 가기 버튼과 액션이 있는 페이지 제목 블록  | -                                      |
| **Result**     | 작업 결과를 보여주는 전체 화면                 | -                                      |

## 핵심 기능

### Base UI 기반

컴포넌트는 [Base UI](https://base-ui.com) 프리미티브 위에 만들어져 포커스 관리, 포털, `aria-*` 배선, 팝업 위치 계산을 Base UI에 맡깁니다. 내부 프리미티브 계층(`src/core`)은 공개 API가 아니며 import할 수 없습니다.

### 유틸리티

- **`cn()`** - 클래스명 병합 유틸리티 (clsx + tailwind-merge)
- **`renderConditional()`** - 조건부 렌더 헬퍼

## 설치 및 사용법

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
    <div data-ui-root>
      <Layout>
        <Typography.Title>안녕하세요!</Typography.Title>
        <Button variant="primary">클릭하세요</Button>
      </Layout>
    </div>
  );
}
```

애플리케이션 레이아웃 루트에 `data-ui-root`를 지정하세요. 패키지 스타일시트가
해당 요소에 `isolation: isolate`를 적용해 Base UI 포털이 앱 내부의 z-index와
경쟁하지 않고 페이지 콘텐츠 위에 표시되도록 합니다.

반대 방향으로도 효과가 있습니다. 오버레이(Modal, Drawer, Select, Popover)와
페이지 흐름 안에 고정되는 요소(sticky/fixed `Layout.Header`, `FloatButton`,
Dropdown 메뉴)는 모두 `z-index: 1000`을 씁니다. 루트를 격리하지 않으면 이
요소들이 z-index가 더 낮은 앱 자체의 다이얼로그(예: shadcn의 `z-50`)를 덮습니다.
`data-ui-root`를 지정하면 `body`로 포털되는 앱의 오버레이가 이 요소들을 포함한
앱 전체를 덮습니다.

### 개별 컴포넌트 import

모든 컴포넌트는 export 이름과 같은 개별 경로로도 import할 수 있습니다(`Row`/`Col`과 `CodeEditor`는 아래 참고).

```tsx
import Button from '@jbpark/ui-kit/Button';
import Input from '@jbpark/ui-kit/Input';
import Modal from '@jbpark/ui-kit/Modal';
import Typography from '@jbpark/ui-kit/Typography';
```

> 이 개별 import 경로들은 전부 default export만 있습니다 — `{ ComponentName }`이
> 아니라 컴포넌트 자체를 import하세요. 필요한 컴포넌트만 쓸 거라면 루트
> `@jbpark/ui-kit` 대신 개별 경로를 쓰는 걸 권장합니다. 루트 진입점은 organisms
> 전체(Swiper 포함)를 다시 export하는데, `Swiper`가 `swiper`의 CSS를 사이드
> 이펙트로 불러오기 때문에 Node/SSR 빌드(예: Astro static build)에서 순수
> `.css` import를 처리 못 해 빌드가 깨질 수 있습니다.

- `Row`/`Col`은 named export라 개별 경로가 없습니다. 루트에서 `import { Row, Col } from '@jbpark/ui-kit'`로 가져옵니다.
- `CodeEditor`는 반대로 **개별 경로 전용**입니다(`@jbpark/ui-kit/CodeEditor`). CodeMirror가 선택적 peer 의존성이라 루트 진입점에는 포함되지 않습니다.
- 타입은 루트 진입점에서 가져옵니다: `import type { ButtonProps } from '@jbpark/ui-kit'`.

### 유틸리티 및 프로바이더 import

```tsx
// 유틸리티 함수
import { Config } from '@jbpark/ui-kit/providers';
import { cn, renderConditional } from '@jbpark/ui-kit/utils';
```

### 스타일 import

```tsx
// 전역 스타일 (필수)
import '@jbpark/ui-kit/style.css';
```

## 스타일링

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

## 주요 의존성

### 핵심 라이브러리

- **React 19.2** - UI 라이브러리
- **TypeScript 6.0** - 정적 타입 체크
- **Tailwind CSS 4.3** - 유틸리티 CSS 프레임워크

### UI 라이브러리

- **Base UI 1.8** - 접근성 우선 헤드리스 UI 프리미티브
- **Lucide React 1.45** - 아이콘 라이브러리
- **Motion 13.1** - 애니메이션 라이브러리
- **Swiper 14.1** - 터치 슬라이더
- **TipTap 3.30** - RichTextEditor 엔진
- **react-day-picker 10.0** - DatePicker 캘린더
- **react-resizable-panels 4.12** - Splitter 패널

### 유틸리티

- **class-variance-authority 0.7.1** - 컴포넌트 variants 관리
- **clsx 2.1.1** - 조건부 클래스명
- **tailwind-merge 3.6** - Tailwind 클래스 병합
- **@jbpark/use-hooks 4.0** - React 훅 모음
- **date-fns 4.4** - 날짜 포매팅/파싱
- **react-colorful 5.8** - ColorPicker 입력
- **GSAP 3.15 / @gsap/react 2.1** - GSAP 애니메이션

## 개발

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

## 패키지 Exports

- `@jbpark/ui-kit` - 메인 진입점 (`CodeEditor`를 제외한 모든 컴포넌트와 타입, `Config` 등 `providers` export)
- `@jbpark/ui-kit/<ComponentName>` - 컴포넌트별 개별 경로 (default export만, 위 표의 컴포넌트 이름과 같음)
- `@jbpark/ui-kit/utils` - 유틸리티 함수 (`cn`, `renderConditional`)
- `@jbpark/ui-kit/providers` - Config 프로바이더 및 테마
- `@jbpark/ui-kit/style.css` - 전역 스타일 (필수)

전체 목록은 패키지 `package.json`의 `exports` 필드가 기준입니다.

## 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-component`)
3. 컴포넌트를 Atomic Design 패턴에 따라 적절한 폴더에 배치합니다
4. TypeScript 타입을 정의합니다
5. Storybook 스토리를 작성합니다
6. 변경사항을 커밋합니다 (`git commit -m 'Add amazing component'`)
7. 브랜치에 푸시합니다 (`git push origin feature/amazing-component`)
8. Pull Request를 생성합니다

## 라이선스

MIT 라이선스 하에 있습니다.
