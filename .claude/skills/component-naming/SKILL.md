---
name: component-naming
description: "ui-kit's component folder/export naming convention: folders under packages/ui/src/components (and their apps/docs/stories mirror) use kebab-case, while the exported component/Props identifier stays PascalCase. Covers subcomponents (sibling-file layout, index as pure barrel with explicit intersection-type cast), the tier index re-export pattern, and package.json's exports map (public subpath keys stay PascalCase, only internal path values are kebab-case). Use when creating a new component, auditing existing ones for naming compliance, or when the user asks '컴포넌트 네이밍 규칙', '폴더명 컨벤션 맞는지', 'check component naming convention', '서브컴포넌트 파일 구조'."
---

# Component Naming

`packages/ui/src/components/**`와 그걸 미러링하는 `apps/docs/stories/**`의 네이밍 규칙. 2026-07-18에 전체 컴포넌트 트리를 PascalCase 폴더에서 kebab-case로 일괄 전환했고, 같은 날 컴포지션(서브컴포넌트) 컴포넌트를 폴더+형제 파일+순수 배럴 구조로 재정리했다 (관련 절차는 전역 스킬 `coding-style`의 "B. 네이밍 컨벤션 일괄 변경" 섹션 참고).

## 규칙

자세한 규칙(폴더/파일명 kebab-case, export 식별자 PascalCase, `package.json` exports 키 유지 등)은 `CLAUDE.md`의 "packages/ui 컴포넌트 구조" / "익스포트 관리" 섹션이 최신 소스다 — 여기서 중복 서술하지 않는다. 이 파일은 규칙을 실제로 적용/점검할 때 쓰는 절차(아래)에 집중한다.

## 새 컴포넌트 추가 시

`new-component` 커맨드(`.claude/commands/new-component.md`)가 이 규칙을 이미 반영해서 스캐폴딩한다 — `$ARGUMENTS`의 PascalCase 이름을 폴더/파일용 kebab-case로 변환하고, 컴포넌트/export 이름은 PascalCase로 유지한다. 서브컴포넌트 유무에 따라 flat 파일 또는 폴더+메인+서브+배럴 구조로 분기한다. 직접 파일을 만들 때도 이 패턴을 따른다.

## 컴포지션(서브컴포넌트) 컴포넌트 파일 구성

`Component.Sub = SubComponent` 패턴(예: `Checkbox.Group`)처럼 서브컴포넌트를 갖는 컴포넌트는 중첩 폴더가 아니라 **같은 depth의 형제 파일**로 구성하고, `index.ts`는 로직 없이 **재export 전용 배럴**로 둔다:

```
checkbox/
├── checkbox.tsx  # 메인 구현 (서브컴포넌트 부착 로직 없음)
├── group.tsx     # 서브컴포넌트 구현 — 원래 export 이름 그대로 (Group)
└── index.ts      # 순수 배럴, 구현 없음
```

파일명은 원래 컴포넌트가 export하던 짧은 이름을 그대로 쓴다 (`group.tsx`, `item.tsx`, `back-top.tsx` 등). 같은 이름이 여러 부모 폴더에 반복되어도(`checkbox/group.tsx`와 `radio/group.tsx`) 폴더 경로 자체가 구분자 역할을 하므로 접두어를 붙이지 않는다 — 이 방향은 2026-07-18에 확정했다 (`{부모}-{서브}.tsx` 접두어 방식은 검토 후 기각).

**배럴은 반드시 명시적 교차 타입 캐스팅으로 부착한다.** import된 컴포넌트에 직접 `Main.Sub = Sub`를 대입하면 `TS2339: Property 'Sub' does not exist` 에러가 난다 — TypeScript의 "expando property" 지원(함수 값에 나중에 프로퍼티를 얹는 것)은 **같은 파일에서 로컬 선언된 함수에만** 적용되고, 다른 모듈에서 import한 바인딩에는 적용되지 않기 때문이다:

```ts
// index.ts
import CheckboxImpl, { type Props } from './checkbox';
import Group from './group';

type CheckboxComponent = typeof CheckboxImpl & { Group: typeof Group };

const Checkbox = CheckboxImpl as CheckboxComponent;

Checkbox.Group = Group;

export default Checkbox;
export type { Props };
```

이유:

- 서브컴포넌트를 `group/index.tsx`처럼 중첩 폴더에 두면 그 파일이 부모를 `import Checkbox from '..'`로 상대경로 역참조하게 되는데, 이 패턴은 폴더 이동/리네임에 취약하고 순환참조처럼 보인다. 형제 파일 + 상대경로 `./checkbox`로 참조하면 이 문제가 없다.
- `index.tsx`가 구현까지 겸하면 IDE 탭/스택트레이스에 `index.tsx`만 여러 개 떠서 구분이 안 된다. 구현을 이름 있는 파일로 분리하고 `index`는 재export만 하면 이 문제가 해결되고, 외부에서 보는 import 경로(`@repo/ui`)는 그대로 유지된다.
- 서브컴포넌트에 또 서브컴포넌트가 있으면(예: `menu/item`이 `label`을 가짐) 동일 규칙을 재귀 적용해 그 서브컴포넌트도 폴더로 만든다 (`menu/item/item.tsx` + `menu/item/label.tsx` + `menu/item/index.ts`).
- 서브컴포넌트가 메인 구현에서 어태치 목적 외에 **런타임에도 실제로 쓰이는 경우**(예: `Layout`이 `child.type === Sider`로 런타임 타입 체크를 하거나, `Marquees`/`Reveals`가 자신의 `Item`을 JSX에서 직접 렌더링하는 경우) 메인 구현 파일에서 그 import를 지우면 안 된다 — 부착용 import와 런타임 필수 import를 혼동하지 않는다.

적용 범위: **서브컴포넌트가 없는 단순 컴포넌트는 폴더 없이** `{tier}/{kebab-name}.tsx` 파일 하나로 구성한다. 이 절은 서브컴포넌트가 있는 경우에만 적용한다. 2026-07-18 기준으로 `packages/ui/src/components/**`의 모든 컴포넌트가 이 구조로 전환 완료됐다.

## 기존 컴포넌트 네이밍 감사 체크리스트

이 규칙을 따르는지 확인할 때:

1. `packages/ui/src/components/{tier}/` 하위 컴포넌트명이 전부 kebab-case인지. 서브컴포넌트가 없는 컴포넌트는 폴더 없이 `{tier}/{kebab-case-name}.tsx` 파일로만 존재하므로 디렉토리와 파일명을 모두 감사해야 한다:
   - 디렉토리(조합 컴포넌트/서브컴포넌트): `find packages/ui/src/components -mindepth 2 -type d`로 PascalCase 잔존 여부 체크
   - 파일(flat 컴포넌트): `find packages/ui/src/components -mindepth 2 -maxdepth 2 -name '*.tsx' ! -name 'index.tsx'`로 flat 컴포넌트 파일명이 kebab-case인지 체크
2. `apps/docs/stories/{tier}/` 하위 디렉토리명이 packages/ui의 컴포넌트명(파일이든 폴더든)과 kebab-case 기준으로 1:1 대응하는지 — stories는 컴포넌트 구조와 무관하게 항상 폴더 + `index.stories.tsx` 형태를 유지하므로, packages/ui 쪽이 flat 파일이어도 stories 쪽엔 여전히 폴더가 있다
3. 각 컴포넌트 파일의 `export default`/`export type { Props }` 식별자가 PascalCase인지 (폴더/파일명과 별개로 유지돼야 함)
4. 계층 `index.ts`의 재export 문에서 alias는 PascalCase, `from '...'` 경로는 kebab-case인지
5. `package.json`의 `exports` 필드 값(경로)이 실제 디렉토리 구조와 일치하는지, 키는 PascalCase가 유지됐는지 (조합 컴포넌트의 배럴을 직접 가리키는 경우 `index.ts` 확장자인지도 확인)
6. `tsdown.config.ts`의 entry 경로도 같은 기준으로 최신 상태인지
7. 서브컴포넌트가 있는 컴포넌트는 위 "컴포지션 컴포넌트 파일 구성" 구조(형제 파일 + 명시적 캐스팅 배럴)를 따르는지, 메인 구현 파일에 서브컴포넌트 부착 로직이 남아있지 않은지

불일치를 발견하면 임의로 대량 수정하지 말고, 범위(단일 컴포넌트 수정 vs 전체 재정렬)를 사용자에게 확인한 뒤 전역 스킬 `coding-style`의 "B. 네이밍 컨벤션 일괄 변경" 절차를 따른다.
