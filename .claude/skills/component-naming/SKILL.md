---
name: component-naming
description: "ui-kit's component folder/export naming convention: folders under packages/ui/src/components (and their apps/docs/stories mirror) use kebab-case, while the exported component/Props identifier stays PascalCase. Covers subcomponents, the tier index re-export pattern, and package.json's exports map (public subpath keys stay PascalCase, only internal path values are kebab-case). Use when creating a new component, auditing existing ones for naming compliance, or when the user asks '컴포넌트 네이밍 규칙', '폴더명 컨벤션 맞는지', 'check component naming convention'."
---

# Component Naming

`packages/ui/src/components/**`와 그걸 미러링하는 `apps/docs/stories/**`의 네이밍 규칙. 2026-07-18에 전체 컴포넌트 트리를 PascalCase 폴더에서 kebab-case로 일괄 전환했다 (관련 절차는 전역 스킬 `coding-style`의 "B. 네이밍 컨벤션 일괄 변경" 섹션 참고).

## 규칙

자세한 규칙(폴더명 kebab-case, export 식별자 PascalCase, `package.json` exports 키 유지 등)은 `CLAUDE.md`의 "packages/ui 컴포넌트 구조" / "익스포트 관리" 섹션이 최신 소스다 — 여기서 중복 서술하지 않는다. 이 파일은 규칙을 실제로 적용/점검할 때 쓰는 절차(아래)에 집중한다.

## 새 컴포넌트 추가 시

`new-component` 커맨드(`.claude/commands/new-component.md`)가 이 규칙을 이미 반영해서 스캐폴딩한다 — `$ARGUMENTS`의 PascalCase 이름을 폴더용 kebab-case로 변환하고, 컴포넌트/export 이름은 PascalCase로 유지한다. 직접 파일을 만들 때도 이 패턴을 따른다.

## 기존 컴포넌트 네이밍 감사 체크리스트

이 규칙을 따르는지 확인할 때:

1. `packages/ui/src/components/{tier}/` 하위 디렉토리명이 전부 kebab-case인지 (`find packages/ui/src/components -mindepth 2 -type d`로 확인, PascalCase 잔존 여부 체크)
2. `apps/docs/stories/{tier}/` 하위 디렉토리명이 packages/ui와 1:1로 대응하는지
3. 각 컴포넌트 파일의 `export default`/`export type { Props }` 식별자가 PascalCase인지 (폴더명과 별개로 유지돼야 함)
4. 계층 `index.ts`의 재export 문에서 alias는 PascalCase, `from '...'` 경로는 kebab-case인지
5. `package.json`의 `exports` 필드 값(경로)이 실제 디렉토리 구조와 일치하는지, 키는 PascalCase가 유지됐는지
6. `tsdown.config.ts`의 entry 경로도 같은 기준으로 최신 상태인지

불일치를 발견하면 임의로 대량 수정하지 말고, 범위(단일 컴포넌트 수정 vs 전체 재정렬)를 사용자에게 확인한 뒤 전역 스킬 `coding-style`의 "B. 네이밍 컨벤션 일괄 변경" 절차를 따른다.
