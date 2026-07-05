# apps/docs SKILL

apps/docs 프로젝트에서 작업할 때 참고하는 가이드입니다.

## Scope

- Next.js 기반 docs 앱
- Storybook 문서 및 예제 관리

## Key Paths

- `app/`: docs 애플리케이션 라우트
- `stories/`: Storybook 스토리 파일
- `.storybook/`: Storybook 설정

## Rules

- 스토리는 `stories/{계층}/{컴포넌트}/index.stories.tsx` 구조를 우선 사용
- `@storybook/nextjs-vite` 타입(`Meta`, `StoryObj`)을 일관되게 사용
- `@repo/ui` 컴포넌트 API와 실제 동작이 일치하도록 예제를 작성
