# packages/eslint-config SKILL

packages/eslint-config 프로젝트에서 작업할 때 참고하는 가이드입니다.

## Scope

- 공용 ESLint Flat Config 프리셋 관리
- `base`, `next`, `react-internal` 설정 유지

## Key Paths

- `base.js`
- `next.js`
- `react-internal.js`

## Rules

- ESLint v9 Flat Config 형식을 유지
- 규칙 추가/수정 시 기존 프리셋 구조와 일관성 유지
- 특정 프로젝트 전용 규칙은 공용 프리셋에 과도하게 섞지 않음
