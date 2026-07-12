# packages/ui SKILL

packages/ui 프로젝트에서 작업할 때 참고하는 가이드입니다.

## Scope

- 재사용 가능한 UI 컴포넌트 라이브러리
- Atomic Design 계층(atoms/molecules/organisms/templates)
- Radix 기반 core 컴포넌트 래퍼

## Key Paths

- `src/components/`: 디자인 계층 컴포넌트
- `src/core/`: headless/core 래퍼 컴포넌트
- `src/index.ts`: 외부 export 진입점

## Rules

- 기존 컴포넌트 패턴(CVA, `cn()`, 타입 정의)을 우선 유지
- 공개 API 변경 시 `src/index.ts` export 동기화
- 변경 범위와 무관한 스타일/포맷팅 수정은 지양
