# UI-Kit Monorepo

이 프로젝트는 Turborepo 기반의 UI 컴포넌트 및 웹/문서 앱을 포함한 모노레포입니다.

## 폴더 구조 및 구성

### Apps

- `apps/docs`: [Next.js](https://nextjs.org/) 기반 문서 사이트
- `apps/web`: [Next.js](https://nextjs.org/) 기반 웹 데모/서비스

### Packages

- `packages/ui`: 공통 React UI 컴포넌트 라이브러리 (atoms, molecules, organisms, templates 등)
- `packages/eslint-config`: 프로젝트 전반에 적용되는 ESLint 설정 (Next.js, Prettier 포함)
- `packages/typescript-config`: 공통 TypeScript 설정 (tsconfig)

모든 앱과 패키지는 [TypeScript](https://www.typescriptlang.org/)로 작성되어 있습니다.

### 개발 도구

- [TypeScript](https://www.typescriptlang.org/) - 정적 타입 체크
- [ESLint](https://eslint.org/) - 코드 린팅
- [Prettier](https://prettier.io) - 코드 포매팅

### 빌드

모든 앱과 패키지를 빌드하려면 아래 명령어를 사용하세요:

```sh
# 터보 글로벌 설치 시 (권장)
turbo build
# 글로벌 설치 없이
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

특정 앱/패키지만 빌드하려면 filter 옵션을 사용하세요:

```sh
turbo build --filter=apps/web
```

### 개발

모든 앱/패키지를 개발 모드로 실행하려면:

```sh
turbo dev
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

특정 앱/패키지만 개발하려면 filter 옵션을 사용하세요:

```sh
turbo dev --filter=apps/docs
```

## 참고 링크

- [Turborepo 공식 문서](https://turborepo.com/docs)
- [Next.js 공식 문서](https://nextjs.org/docs)

---
