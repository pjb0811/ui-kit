# 문서 사이트

[English](./README.md) | [한국어](./README.ko.md)

이 프로젝트는 UI-Kit 컴포넌트 라이브러리의 문서 사이트입니다. Next.js와 Storybook을 기반으로 구축되어 있으며, Atomic Design 패턴을 따라 구성된 React 컴포넌트들의 사용법과 예제를 인터랙티브하게 제공합니다.

## 📁 프로젝트 구조

```
apps/docs/
├── app/                    # Next.js 앱 라우터
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈페이지
├── stories/               # Storybook 스토리들
│   ├── atoms/            # 원자 컴포넌트 스토리
│   ├── molecules/        # 분자 컴포넌트 스토리
│   ├── organisms/        # 유기체 컴포넌트 스토리
│   └── templates/        # 템플릿 컴포넌트 스토리
├── .storybook/           # Storybook 설정
│   ├── main.ts           # Storybook 메인 설정
│   └── preview.ts        # Storybook 프리뷰 설정
├── public/               # 정적 자산
└── package.json
```

## 🚀 시작하기

### 필수 요구사항

- **Node.js** >= 20
- **pnpm** >= 10

### 설치

```bash
# 루트 디렉토리에서 모든 의존성 설치
pnpm install

# 또는 docs 디렉토리에서 직접 설치
cd apps/docs
pnpm install
```

### 개발 서버 실행

#### Next.js 개발 서버

```bash
# 루트에서 실행
pnpm dev --filter=docs

# 또는 docs 디렉토리에서 직접 실행
cd apps/docs
pnpm run dev
```

- **포트**: 3001
- **URL**: http://localhost:3001

#### Storybook 개발 서버

```bash
# 루트에서 실행
pnpm storybook --filter=docs

# 또는 docs 디렉토리에서 직접 실행
cd apps/docs
pnpm run storybook
```

- **포트**: 6006
- **URL**: http://localhost:6006

## 🛠 사용 가능한 스크립트

### 개발

```bash
# Next.js 개발 서버 실행 (Turbopack 사용)
pnpm run dev

# Storybook 개발 서버 실행
pnpm run storybook

# Next.js 프로덕션 서버 실행
pnpm run start
```

### 빌드

```bash
# Next.js 앱 빌드
pnpm run build

# Storybook 정적 빌드
pnpm run build-storybook
```

### 코드 품질

```bash
# ESLint 실행
pnpm run lint

# TypeScript 타입 체크
pnpm run check-types
```

## 📚 컴포넌트 문서화

이 문서 사이트는 Atomic Design 패턴을 따라 구성된 React 컴포넌트들을 체계적으로 문서화합니다. 각 컴포넌트는 Storybook을 통해 인터랙티브한 예제와 사용법을 제공합니다.

### 🧬 Atoms (원자)

기본적인 UI 구성 요소들

| 컴포넌트           | 설명                                            | 하위 컴포넌트                        |
| ------------------ | ----------------------------------------------- | ------------------------------------ |
| **Button**         | 타입·variant·크기·로딩 상태를 지원하는 버튼     | -                                    |
| **Checkbox**       | 단일 체크박스 및 값을 공유하는 그룹             | `Group`                              |
| **CodeEditor**     | JS/TS 하이라이팅을 지원하는 CodeMirror 6 편집기 | -                                    |
| **ColorPicker**    | 팝오버로 hex 색상을 고르는 스와치               | -                                    |
| **DatePicker**     | 캘린더 팝오버로 날짜를 고르는 버튼              | -                                    |
| **FloatButton**    | 뷰포트 모서리에 고정되는 원형 버튼              | `BackTop`                            |
| **Input**          | 텍스트 입력 및 검색·여러 줄 변형                | `Search`, `TextArea`                 |
| **Popover**        | 트리거에 앵커링되는 플로팅 패널                 | -                                    |
| **Progress**       | 가로·세로로 채워지는 진행률 바                  | -                                    |
| **Radio**          | 단일 라디오 및 배타 선택 그룹                   | `Group`                              |
| **RichTextEditor** | HTML 문자열을 편집하는 TipTap 기반 에디터       | -                                    |
| **Select**         | 목록에서 값 하나를 고르는 드롭다운              | -                                    |
| **Skeleton**       | 로딩 중 콘텐츠 모양을 대신하는 플레이스홀더     | `Button`, `Node`                     |
| **Slider**         | 드래그로 조작하는 숫자 범위 컨트롤              | -                                    |
| **Spin**           | 단독 또는 오버레이로 쓰는 로딩 인디케이터       | -                                    |
| **Switch**         | 불리언 on/off 토글                              | -                                    |
| **Tag**            | 콘텐츠 분류용 소형 라벨 배지                    | -                                    |
| **Typography**     | 제목·본문·문단·링크 텍스트                      | `Link`, `Paragraph`, `Text`, `Title` |

> `CodeEditor`는 전용 서브패스로 가져옵니다 — `import CodeEditor from '@jbpark/ui-kit/CodeEditor'`.
> CodeMirror를 선택적 peer 의존성으로 유지하기 위해 메인 배럴에서 의도적으로 제외돼 있습니다.

### 🔬 Molecules (분자)

여러 원자들이 결합된 복합 컴포넌트들

| 컴포넌트     | 설명                                            | 하위 컴포넌트 |
| ------------ | ----------------------------------------------- | ------------- |
| **Card**     | 제목을 선택적으로 갖는 콘텐츠 컨테이너          | -             |
| **Collapse** | 아코디언 모드를 지원하는 확장 패널              | -             |
| **Dropdown** | 트리거에서 플로팅 `Menu`를 여는 컴포넌트        | -             |
| **Marquees** | 연속 루프로 스크롤되는 콘텐츠 행                | `Item`        |
| **Menu**     | 중첩 서브메뉴를 지원하는 내비게이션 메뉴        | -             |
| **Reveals**  | 뷰포트 진입 시 순차적으로 나타나는 애니메이션   | `Item`        |
| **Space**    | 행·열로 간격을 두고 자식을 배치                 | -             |
| **Splitter** | 드래그 핸들로 크기를 조절하는 패널              | `Panel`       |
| **Upload**   | 클릭·드래그 업로드 영역과 제거 가능한 파일 목록 | -             |

### 🦠 Organisms (유기체)

복잡한 UI 섹션들

| 컴포넌트   | 설명                                       | 하위 컴포넌트                                    |
| ---------- | ------------------------------------------ | ------------------------------------------------ |
| **Drawer** | 임의의 모서리에서 슬라이드되는 제어형 패널 | -                                                |
| **List**   | 로딩·빈 상태·무한 스크롤을 지원하는 목록   | `Item`                                           |
| **Modal**  | 제어형 또는 명령형으로 여는 다이얼로그     | `confirm`, `info`, `success`, `warning`, `error` |
| **Swiper** | Swiper.js 기반 터치 캐러셀                 | `Slide`                                          |
| **Toast**  | 자동으로 사라지는 명령형 알림              | `info`, `success`, `warning`, `error`            |

### 📄 Templates (템플릿)

페이지 레이아웃 템플릿

| 컴포넌트       | 설명                                             | 하위 컴포넌트                          |
| -------------- | ------------------------------------------------ | -------------------------------------- |
| **Container**  | 최대 너비와 여백을 적용해 콘텐츠를 중앙 정렬     | -                                      |
| **Empty**      | "불러왔지만 비어있음" 상태의 인라인 플레이스홀더 | -                                      |
| **Grid**       | 24컬럼 반응형 그리드                             | `Row`, `Col`                           |
| **Layout**     | 헤더·사이더·콘텐츠·푸터로 구성된 페이지 골격     | `Header`, `Sider`, `Content`, `Footer` |
| **PageHeader** | 뒤로가기·액션을 포함한 페이지 제목 블록          | -                                      |
| **Result**     | 작업 결과를 알리는 전체 화면                     | -                                      |

## 🎨 스타일링

이 프로젝트는 최신 Tailwind CSS 4를 사용하여 스타일링됩니다:

- **Tailwind CSS 4.3.3** - 유틸리티 CSS 프레임워크

## 🛠 기술 스택

### 핵심 기술

- **Next.js 16.3.1** - React 프레임워크 (Turbopack 지원)
- **React 19.2.8** - UI 라이브러리
- **TypeScript 6.0.3** - 정적 타입 체크

### 문서화 도구

- **Storybook 10.5.8** - 컴포넌트 문서화 및 테스트
- **@storybook/nextjs-vite 10.5.8** - Next.js 통합

### 개발 도구

- **ESLint 9.39.5** - 코드 린팅
- **eslint-plugin-storybook 10.5.8** - Storybook ESLint 플러그인

## 📦 의존성

### 내부 패키지

- **@repo/ui** - 메인 UI 컴포넌트 라이브러리
- **@repo/eslint-config** - ESLint 설정
- **@repo/typescript-config** - TypeScript 설정

### 외부 의존성

- **next** - Next.js 프레임워크
- **react** - React 라이브러리
- **react-dom** - React DOM 렌더러
- **tailwindcss** - CSS 프레임워크

## 📖 Storybook 설정

### 스토리 파일 구조

```
stories/
├── atoms/           # 원자 컴포넌트 스토리
├── molecules/       # 분자 컴포넌트 스토리
├── organisms/       # 유기체 컴포넌트 스토리
└── templates/       # 템플릿 컴포넌트 스토리
```

### 스토리 작성 가이드

1. **파일 명명**: `index.stories.tsx` 형식 사용
2. **스토리 구조**: 각 컴포넌트의 모든 variants와 props에 대한 예제 포함
3. **접근성**: ARIA 속성과 키보드 네비게이션 테스트 포함
4. **인터랙션**: Controls와 Actions을 활용한 인터랙티브 예제 제공

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🔗 관련 링크

- [루트 프로젝트 README](../../README.md)
- [UI 컴포넌트 라이브러리](../../packages/ui/README.md)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Storybook 공식 문서](https://storybook.js.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
