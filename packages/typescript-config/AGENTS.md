# packages/typescript-config SKILL

packages/typescript-config 프로젝트에서 작업할 때 참고하는 가이드입니다.

## Scope

- 공용 TypeScript 설정(base/nextjs/react-library) 관리

## Key Paths

- `base.json`
- `nextjs.json`
- `react-library.json`

## Rules

- 하위 프로젝트 호환성을 우선 고려해 점진적으로 변경
- 불필요하게 엄격한 옵션 추가는 지양
- 설정 변경 시 영향을 받는 패키지/앱에서 빌드 검증 권장
