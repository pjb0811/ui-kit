---
name: component-naming
description: "ui-kit's component folder/export naming convention: folders under packages/ui/src/components (and their apps/docs/stories mirror) use kebab-case, while the exported component/Props identifier stays PascalCase. Covers subcomponents (sibling-file layout, index as pure barrel with explicit intersection-type cast), the tier index re-export pattern, and package.json's exports map (public subpath keys stay PascalCase, only internal path values are kebab-case). Use when creating a new component, auditing existing ones for naming compliance, or when the user asks '컴포넌트 네이밍 규칙', '폴더명 컨벤션 맞는지', 'check component naming convention', '서브컴포넌트 파일 구조'."
---

# Component Naming

`packages/ui/src/components/**`와 그걸 미러링하는 `apps/docs/stories/**`의 네이밍 규칙. 2026-07-18에 전체 컴포넌트 트리를 PascalCase 폴더에서 kebab-case로 일괄 전환했고, 같은 날 컴포지션(서브컴포넌트) 컴포넌트를 폴더+형제 파일+순수 배럴 구조로 재정리했다 (관련 절차는 공유 `coding-style` 스킬의 "B. 네이밍 컨벤션 일괄 변경" 섹션 참고).

## 규칙

자세한 규칙(폴더/파일명 kebab-case, export 식별자 PascalCase, `package.json` exports 키 유지 등)은 `CLAUDE.md`의 "packages/ui 컴포넌트 구조" / "익스포트 관리" 섹션이 최신 소스다 — 여기서 중복 서술하지 않는다. 이 파일은 규칙을 실제로 적용/점검할 때 쓰는 절차(아래)에 집중한다.

## 새 컴포넌트 추가 시

`new-component` 커맨드(`.claude/commands/new-component.md`)가 이 규칙을 이미 반영해서 스캐폴딩한다 — `$ARGUMENTS`의 PascalCase 이름을 폴더/파일용 kebab-case로 변환하고, 컴포넌트/export 이름은 PascalCase로 유지한다. 서브컴포넌트 유무에 따라 flat 파일 또는 폴더+메인+서브+배럴 구조로 분기한다. 직접 파일을 만들 때도 이 패턴을 따른다.

## 컴포지션(서브컴포넌트) 컴포넌트 파일 구성

서브컴포넌트가 있는 컴포넌트는 형제 파일 + 순수 `index.ts` 배럴로 구성한다. 구조, 배럴의 명시적 교차 타입 캐스팅(`TS2339` 회피), 서브컴포넌트 파일 이름, 재귀 적용, 런타임에 쓰는 import를 지우지 않는 규칙은 공유 `coding-style` 스킬의 "F. 서브컴포넌트가 있는 컴포넌트의 파일 구조"를 따른다. 이 저장소의 경로와 계층 규칙은 `CLAUDE.md`의 "packages/ui 컴포넌트 구조"에 있다.

## 기존 컴포넌트 네이밍 감사 체크리스트

이 규칙을 따르는지 확인할 때:

1. `packages/ui/src/components/{tier}/` 하위 컴포넌트명이 전부 kebab-case인지. 서브컴포넌트가 없는 컴포넌트는 폴더 없이 `{tier}/{kebab-case-name}.tsx` 파일로만 존재하므로 디렉토리와 파일명을 모두 감사해야 한다:
   - 디렉토리(조합 컴포넌트/서브컴포넌트): `find packages/ui/src/components -mindepth 2 -type d`로 PascalCase 잔존 여부 체크
   - 파일(flat 컴포넌트): `find packages/ui/src/components -mindepth 2 -maxdepth 2 -name '*.tsx' ! -name 'index.tsx'`로 flat 컴포넌트 파일명이 kebab-case인지 체크
   - `src/providers/**`도 같은 기준으로 감사 대상이다 — 컴포넌트가 아니라는 이유로 범위에서 빠지기 쉽지만(2026-08-09에 `providers/Config/` → `providers/config/` 로 뒤늦게 전환한 사례 참고), 동일한 kebab-case 폴더/PascalCase export 규칙이 적용된다: `find src -mindepth 1 -type d | grep -E '/[A-Z]'`로 `src` 트리 전체에서 PascalCase 디렉토리가 남아있지 않은지 체크
2. `apps/docs/stories/{tier}/` 하위 디렉토리명이 packages/ui의 컴포넌트명(파일이든 폴더든)과 kebab-case 기준으로 1:1 대응하는지 — stories는 컴포넌트 구조와 무관하게 항상 폴더 + `index.stories.tsx` 형태를 유지하므로, packages/ui 쪽이 flat 파일이어도 stories 쪽엔 여전히 폴더가 있다
3. 각 컴포넌트 파일의 `export default`/`export type { Props }` 식별자가 PascalCase인지 (폴더/파일명과 별개로 유지돼야 함)
4. 계층 `index.ts`의 재export 문에서 alias는 PascalCase, `from '...'` 경로는 kebab-case인지
5. `package.json`의 `exports` 필드 값(경로)이 실제 디렉토리 구조와 일치하는지, 키는 PascalCase가 유지됐는지 (조합 컴포넌트의 배럴을 직접 가리키는 경우 `index.ts` 확장자인지도 확인)
6. `tsdown.config.ts`의 entry 경로도 같은 기준으로 최신 상태인지
7. 서브컴포넌트가 있는 컴포넌트는 공유 `coding-style` F 구조(형제 파일 + 명시적 캐스팅 배럴)를 따르는지, 메인 구현 파일에 서브컴포넌트 부착 로직이 남아있지 않은지

불일치를 발견하면 임의로 대량 수정하지 말고, 범위(단일 컴포넌트 수정 vs 전체 재정렬)를 사용자에게 확인한 뒤 공유 `coding-style` 스킬의 "B. 네이밍 컨벤션 일괄 변경" 절차를 따른다.
