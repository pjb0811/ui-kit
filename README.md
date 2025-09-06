# UI-Kit Monorepo

이 프로젝트는 Turborepo 기반의 현대적인 UI 컴포넌트 라이브러리와 웹/문서 앱을 포함한 모노레포입니다. Atomic Design 패턴을 따라 체계적으로 구성된 React 컴포넌트들을 제공합니다.

## 📁 프로젝트 구조

```
ui-kit/
├── apps/                    # 애플리케이션들
│   ├── docs/               # Storybook 기반 문서 사이트 (포트: 3001)
│   └── web/                # Next.js 웹 데모/서비스 (포트: 3000)
├── packages/               # 공유 패키지들
│   ├── ui/                 # 메인 UI 컴포넌트 라이브러리
│   ├── eslint-config/      # ESLint 설정
│   └── typescript-config/  # TypeScript 설정
└── README.md
```

## 🎨 UI 컴포넌트 라이브러리 (@repo/ui)

Atomic Design 패턴을 따라 구성된 React 컴포넌트 라이브러리입니다.

### Atoms (원자)

기본적인 UI 구성 요소들

- **Breakpointer**: 반응형 브레이크포인트 컴포넌트
- **Button**: 다양한 스타일의 버튼 컴포넌트
- **Checkbox**: 체크박스 및 그룹 체크박스
- **FloatButton**: 플로팅 버튼 (BackTop 포함)
- **Progress**: 진행률 표시 컴포넌트
- **Skeleton**: 로딩 스켈레톤 (Button, Node 포함)
- **Spin**: 로딩 스피너
- **Switch**: 토글 스위치
- **Typography**: 텍스트 컴포넌트 (Link, Paragraph, Text, Title 포함)

### Molecules (분자)

여러 원자들이 결합된 복합 컴포넌트들

- **Collapse**: 접을 수 있는 컨텐츠 영역
- **Dropdown**: 드롭다운 메뉴
- **Marquees**: 무한 스크롤 마키 컴포넌트
- **Menu**: 네비게이션 메뉴
- **Reveals**: 애니메이션 리빌 컴포넌트
- **Space**: 간격 조정 컴포넌트

### Organisms (유기체)

복잡한 UI 섹션들

- **Drawer**: 사이드 드로어
- **List**: 리스트 및 리스트 아이템
- **Modal**: 모달 다이얼로그
- **Swiper**: 슬라이더 컴포넌트

### Templates (템플릿)

페이지 레이아웃 템플릿

- **Layout**: 전체 페이지 레이아웃 (Header, Sider, Content, Footer 포함)

## 🛠 기술 스택

### 핵심 기술

- **[React 19](https://react.dev/)** - UI 라이브러리
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - 정적 타입 체크
- **[Next.js 15](https://nextjs.org/)** - React 프레임워크
- **[Tailwind CSS 4](https://tailwindcss.com/)** - 유틸리티 CSS 프레임워크

### UI 라이브러리

- **[Radix UI](https://www.radix-ui.com/)** - 접근성 우선 헤드리스 UI 컴포넌트
- **[Lucide React](https://lucide.dev/)** - 아이콘 라이브러리
- **[Motion](https://motion.dev/)** - 애니메이션 라이브러리
- **[Swiper](https://swiperjs.com/)** - 터치 슬라이더
- **[Vaul](https://vaul.dev/)** - 드로어 컴포넌트

### 개발 도구

- **[Turborepo](https://turborepo.com/)** - 모노레포 빌드 시스템
- **[ESLint](https://eslint.org/)** - 코드 린팅
- **[Prettier](https://prettier.io/)** - 코드 포매팅
- **[Storybook](https://storybook.js.org/)** - 컴포넌트 문서화
- **[Husky](https://typicode.github.io/husky/)** - Git 훅 관리

## 🚀 시작하기

### 필수 요구사항

- Node.js >= 18
- npm 11.3.0

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 모든 앱/패키지 개발 모드 실행
npm run dev

# 특정 앱만 실행
npm run dev -- --filter=apps/web      # 웹 앱 (포트: 3000)
npm run dev -- --filter=apps/docs     # 문서 사이트 (포트: 3001)
```

### 빌드

```bash
# 모든 앱/패키지 빌드
npm run build

# 특정 앱만 빌드
npm run build -- --filter=apps/web
```

### 코드 품질 관리

```bash
# 린팅
npm run lint

# 타입 체크
npm run check-types

# 코드 포매팅
npm run format
```

## 📚 문서화

### Storybook

컴포넌트 문서화 및 테스트를 위해 Storybook을 사용합니다.

```bash
# Storybook 개발 서버 실행 (포트: 6006)
npm run storybook -- --filter=apps/docs

# Storybook 빌드
npm run build-storybook -- --filter=apps/docs
```

## 📦 패키지 정보

### Apps

- **`apps/web`**: Next.js 기반 웹 데모/서비스
- **`apps/docs`**: Storybook 기반 컴포넌트 문서 사이트

### Packages

- **`@repo/ui`**: 메인 UI 컴포넌트 라이브러리
- **`@repo/eslint-config`**: ESLint 설정 (base, next-js, react-internal)
- **`@repo/typescript-config`**: TypeScript 설정 (base, nextjs, react-library)

## 🔧 사용법

### UI 컴포넌트 사용

```tsx
import { Button, Layout, Typography } from '@repo/ui';

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
import { Button } from '@repo/ui/Button';
import { Typography } from '@repo/ui/Typography';
```

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🔗 참고 링크

- [Turborepo 공식 문서](https://turborepo.com/docs)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Radix UI 문서](https://www.radix-ui.com/docs)
- [Storybook 문서](https://storybook.js.org/docs)

---
