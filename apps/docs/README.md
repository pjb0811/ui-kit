# UI-Kit 문서 사이트

이 프로젝트는 UI-Kit 컴포넌트 라이브러리의 문서화 사이트입니다. Next.js와 Storybook을 기반으로 구축되어 있으며, Atomic Design 패턴을 따라 구성된 React 컴포넌트들의 사용법과 예제를 제공합니다.

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
│   └── main.ts           # Storybook 메인 설정
├── public/               # 정적 자산
└── package.json
```

## 🚀 시작하기

### 필수 요구사항

- **Node.js** >= 18
- **npm** 11.3.0

### 설치

```bash
# 루트 디렉토리에서 모든 의존성 설치
npm install

# 또는 docs 디렉토리에서 직접 설치
cd apps/docs
npm install
```

### 개발 서버 실행

#### Next.js 개발 서버 (문서 사이트)

```bash
# 루트에서 실행 (권장)
npm run dev -- --filter=docs

# 또는 docs 디렉토리에서 직접 실행
cd apps/docs
npm run dev
```

- **포트**: 3001
- **URL**: http://localhost:3001

#### Storybook 개발 서버 (컴포넌트 문서)

```bash
# 루트에서 실행 (권장)
npm run storybook -- --filter=docs

# 또는 docs 디렉토리에서 직접 실행
cd apps/docs
npm run storybook
```

- **포트**: 6006
- **URL**: http://localhost:6006

## 🛠 사용 가능한 스크립트

### 개발

```bash
# Next.js 개발 서버 실행 (Turbopack 사용)
npm run dev

# Storybook 개발 서버 실행
npm run storybook

# Next.js 프로덕션 서버 실행
npm run start
```

### 빌드

```bash
# Next.js 앱 빌드
npm run build

# Storybook 정적 빌드
npm run build-storybook
```

### 코드 품질

```bash
# ESLint 실행 (경고 0개 허용)
npm run lint

# TypeScript 타입 체크
npm run check-types
```

## 📚 컴포넌트 문서화

이 문서 사이트는 Atomic Design 패턴을 따라 구성된 React 컴포넌트들을 체계적으로 문서화합니다. 각 컴포넌트는 Storybook을 통해 인터랙티브한 예제와 사용법을 제공합니다.

### 🧬 Atoms (원자)

기본적인 UI 구성 요소들

| 컴포넌트         | 설명                           | 하위 컴포넌트                        |
| ---------------- | ------------------------------ | ------------------------------------ |
| **Breakpointer** | 반응형 브레이크포인트 컴포넌트 | -                                    |
| **Button**       | 다양한 스타일의 버튼           | -                                    |
| **Checkbox**     | 체크박스 및 그룹 체크박스      | `Group`                              |
| **FloatButton**  | 플로팅 버튼                    | `BackTop`                            |
| **Progress**     | 진행률 표시 컴포넌트           | -                                    |
| **Skeleton**     | 로딩 스켈레톤                  | `Button`, `Node`                     |
| **Spin**         | 로딩 스피너                    | -                                    |
| **Switch**       | 토글 스위치                    | -                                    |
| **Typography**   | 텍스트 컴포넌트                | `Link`, `Paragraph`, `Text`, `Title` |

### 🔬 Molecules (분자)

여러 원자들이 결합된 복합 컴포넌트들

| 컴포넌트     | 설명                     | 하위 컴포넌트 |
| ------------ | ------------------------ | ------------- |
| **Collapse** | 접을 수 있는 컨텐츠 영역 | -             |
| **Dropdown** | 드롭다운 메뉴            | -             |
| **Marquees** | 무한 스크롤 마키         | `Item`        |
| **Menu**     | 네비게이션 메뉴          | -             |
| **Reveals**  | 애니메이션 리빌          | `Item`        |
| **Space**    | 간격 조정 컴포넌트       | -             |

### 🦠 Organisms (유기체)

복잡한 UI 섹션들

| 컴포넌트   | 설명                    | 하위 컴포넌트 |
| ---------- | ----------------------- | ------------- |
| **Drawer** | 사이드 드로어           | -             |
| **List**   | 리스트 및 리스트 아이템 | `Item`        |
| **Modal**  | 모달 다이얼로그         | -             |
| **Swiper** | 슬라이더 컴포넌트       | `Slide`       |

### 📄 Templates (템플릿)

페이지 레이아웃 템플릿

| 컴포넌트   | 설명                 | 하위 컴포넌트                          |
| ---------- | -------------------- | -------------------------------------- |
| **Layout** | 전체 페이지 레이아웃 | `Header`, `Sider`, `Content`, `Footer` |

## 🎨 스타일링

이 프로젝트는 최신 Tailwind CSS 4를 사용하여 스타일링됩니다:

- **Tailwind CSS 4.1.12** - 유틸리티 CSS 프레임워크

## 🛠 기술 스택

### 핵심 기술

- **Next.js 15.5.0** - React 프레임워크 (Turbopack 지원)
- **React 19.1.0** - UI 라이브러리
- **TypeScript 5.9.2** - 정적 타입 체크

### 문서화 도구

- **Storybook 9.1.4** - 컴포넌트 문서화 및 테스트
- **@storybook/nextjs 9.1.4** - Next.js 통합

### 개발 도구

- **ESLint 9.34.0** - 코드 린팅
- **eslint-plugin-storybook 9.1.4** - Storybook ESLint 플러그인

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

---
