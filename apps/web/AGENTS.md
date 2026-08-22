# apps/web SKILL

apps/web 프로젝트에서 작업할 때 참고하는 가이드입니다.

## Scope

- Docusaurus 기반 ui-kit 패키지 랜딩 페이지 (포트 3000)
- 컴포넌트 문서/플레이그라운드는 `apps/docs`(Storybook)가 담당하므로, 여기는 마케팅 랜딩 콘텐츠 위주

## Key Paths

- `src/pages/`: 커스텀 페이지 (현재는 홈페이지 하나)
- `src/components/`: `DemoTheme` 등 페이지에서 쓰는 컴포넌트
- `src/css/custom.css`: Tailwind + `@repo/ui/style.css` 진입점
- `static/`: 정적 리소스 (favicon 등)
- `docusaurus.config.ts`: 사이트 설정 (navbar/footer, Tailwind postcss 플러그인 연결)

## Rules

- `@repo/ui/style.css`는 워크스페이스 안에서 소스 CSS(`packages/ui/src/globals.css`)로 resolve되므로, 이 앱이 자체 Tailwind 빌드(`configurePostCss`)를 돌려야 유틸리티 클래스가 생성된다 — 이 설정을 건드릴 때는 `docusaurus.config.ts`의 주석을 참고
- 공용 UI는 가능하면 `@repo/ui`를 우선 재사용
- 다크모드는 Docusaurus의 `useColorMode`를 `DemoTheme`을 통해 ui-kit의 `Config`에 연결해서 따라가게 되어 있음 — 페이지 콘텐츠는 `<DemoTheme>` 안에서 렌더링해야 함
