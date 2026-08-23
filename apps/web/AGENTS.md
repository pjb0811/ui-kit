# apps/web SKILL

apps/web 프로젝트에서 작업할 때 참고하는 가이드입니다.

## Scope

- Docusaurus 기반 ui-kit 패키지 랜딩 페이지 + 컴포넌트 문서 (포트 3000)
- 컴포넌트별 인터랙티브 플레이그라운드(모든 variant/props 조합)는 계속 `apps/docs`(Storybook)가 담당함 — 여기 `docs/`는 컴포넌트를 하나씩 채워나가는 설명 + 라이브 데모 위주 문서이고, 전수 커버리지를 목표로 하지 않음
- 새 컴포넌트 문서 페이지 추가 패턴: **파일 경로**는 `packages/ui/src/components`와 동일한 계층(atoms/molecules/organisms/templates)으로 `docs/components/{tier}/{kebab-case-name}.mdx` 작성 + 필요하면 `src/demo/{kebab-case-name}-demo.tsx`에 라이브 데모 컴포넌트 작성. **사이드바 그룹핑**은 파일 경로의 계층이 아니라 해당 컴포넌트의 Storybook story `title` 프리픽스(예: `Data Entry/Select`)를 따라 `sidebars.ts`에 항목 추가 — 랜딩 페이지 `CATEGORIES`와 동일한 분류(General/Data Entry/Data Display/Feedback/Navigation/Layout). `docs/components/atoms/tag.mdx` + `src/demo/tag-demo.tsx`가 참고할 템플릿

## Key Paths

- `src/pages/`: 커스텀 페이지 (현재는 홈페이지 하나)
- `docs/`: 컴포넌트 문서 페이지. **파일 경로는 계층별**(`components/{tier}/`)이지만 **사이드바는 기능별**로 그룹핑되어 있어 둘이 일치하지 않을 수 있음 (`sidebars.ts` 참고)
- `src/demo/`: 문서 페이지에 임베드하는 라이브 데모 컴포넌트
- `src/components/`: `DemoTheme` 등 페이지에서 쓰는 컴포넌트
- `src/css/custom.css`: Tailwind + `@repo/ui/style.css` 진입점
- `static/`: 정적 리소스 (favicon 등)
- `docusaurus.config.ts`: 사이트 설정 (navbar/footer, Tailwind postcss 플러그인 연결)
- `sidebars.ts`: 문서 사이드바 (수동 관리 — 새 페이지 추가 시 여기도 같이 갱신)

## Rules

- `@repo/ui/style.css`는 워크스페이스 안에서 소스 CSS(`packages/ui/src/globals.css`)로 resolve되므로, 이 앱이 자체 Tailwind 빌드(`configurePostCss`)를 돌려야 유틸리티 클래스가 생성된다 — 이 설정을 건드릴 때는 `docusaurus.config.ts`의 주석을 참고
- 공용 UI는 가능하면 `@repo/ui`를 우선 재사용
- 다크모드는 `DemoTheme`이 Docusaurus의 `useColorMode`를 읽어서 `<html>`에 직접 `.dark` 클래스를 토글하는 방식 (ui-kit의 `Config` wrapper는 안 씀 — 그 wrapper는 `<body>`의 조상이 되지 못해서 body 배경/텍스트 색이 안 바뀌는 버그가 있었음). 라이브 데모를 넣는 문서 페이지 콘텐츠는 `<DemoTheme>` 안에서 렌더링해야 함
