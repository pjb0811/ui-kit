---
name: version-management
description: "ui-kit specifics for releases: the published package is `packages/ui`, which is `@repo/ui` in the workspace but goes to npm as `@jbpark/ui-kit` (name, exports and type come from package.publish.json at publish time), so merging the 'Version Packages' PR publishes it; what publish.yml does here, the required checks, the manual release backfill, and the inputs `publish-check` needs in this monorepo. The common changesets flow, the `action_required` approval and branch naming are in the shared `changesets-release` skill. Use with it when adding a changeset, merging a 'Version Packages' PR, running publish-check, or when the user says '버전 올려줘', 'release 진행', 'npm 배포'."
---

# Version Management (ui-kit)

공통 흐름(changeset → Version Packages PR → 머지 시 `publish.yml`), `action_required` 실행 승인, 브랜치 이름 규칙은 공유 `changesets-release` 스킬을, 배포 전 점검은 공유 `publish-check` 스킬을 따른다. 이 문서는 이 저장소에만 있는 내용이다.

## 패키지와 배포 상태

- `pnpm` + `turbo` 모노레포(`apps/*`, `packages/*`)이고, 배포 대상은 `packages/ui` 하나다. `private: false`, `publishConfig.access: "public"`.
- **워크스페이스 이름과 npm 이름이 다르다.** 워크스페이스에서는 `@repo/ui`이고, npm에는 `@jbpark/ui-kit`으로 올라간다. `npm publish` 직전에 `prepublishOnly`(`scripts/prepare-publish.mjs`)가 `package.publish.json`의 `name`, `exports`, `type`으로 `package.json`을 바꾸고, `postpublish`(`scripts/restore-package.mjs`)가 되돌린다.
- **Version Packages PR 머지 = npm 공개 배포**다. 머지 전에 매번 사용자 확인을 받는다.
- 버전 bump와 `CHANGELOG.md`는 루트가 아니라 `packages/ui/` 안에 있다.
- 상태는 문서가 아니라 직접 확인한다. 결과가 이 문서와 다르면 문서를 고친다.

  ```bash
  git show origin/main:packages/ui/package.json | node -p "const p=JSON.parse(require('fs').readFileSync(0));({name:p.name,private:p.private,version:p.version,publishConfig:p.publishConfig})"
  git show origin/main:packages/ui/package.publish.json | node -p "JSON.parse(require('fs').readFileSync(0)).name"
  npm view @jbpark/ui-kit version
  ```

## 이 저장소의 `publish.yml`

`already_tagged`(`packages/ui/package.json` 버전의 `vX.Y.Z` 태그가 이미 있으면 아무것도 하지 않음)를 통과하면 다음 순서로 돈다.

1. install → `pnpm exec turbo run build --filter=@repo/ui`
2. `pnpm run publish-ui`(`cd packages/ui && npm publish`). OIDC Trusted Publishing이라 `NPM_TOKEN`이 필요 없고, pnpm이 아직 지원하지 않아 `npm`으로 실행한다. `is_private` 확인 스텝은 없다.
3. `v<version>` 태그 push
4. `packages/ui/CHANGELOG.md`에서 해당 버전 절을 뽑아 GitHub Release를 만든다. 릴리스 노트는 NVIDIA API(`NVIDIA_API_KEY`)로 다듬고, 실패하면 원본 changelog로 폴백한다. 릴리스를 막지 않는다.

태그는 있는데 Release가 없으면 `release.yml`("Release (manual backfill)")을 `workflow_dispatch`로 실행한다(`tag` 입력값 필요).

다른 패키지(`apps/*`)를 배포 대상에 넣게 되면 `publish.yml`의 버전 조회 경로와 `--filter` 대상을 함께 넓혀야 한다.

## `publish-check`에 넘길 값

- 실행 위치: `packages/ui`. 타입 체크는 `pnpm check-types`, 빌드는 `pnpm build`(`tsdown`).
- npm 버전 비교: `package.json`의 이름(`@repo/ui`)이 아니라 `npm view @jbpark/ui-kit version`.
- 진입점 대조: 배포되는 `exports`는 `package.publish.json`에 있다. 이것을 `tsdown.config.ts`의 entry, `src/index.ts`의 재export와 대조한다. `package.json`의 `exports`는 워크스페이스용이다.

## 필수 상태 체크

브랜치 룰셋은 `lint-and-build`와 `draft`를 요구한다(`gh api repos/pjb0811/ui-kit/rulesets`로 확인).

## 워크플로

- `.github/workflows/changeset-draft.yml`, `version.yml`, `publish.yml`, `release.yml`, `ci.yml`
- 문서(`apps/docs`)와 웹(`apps/web`)은 GitHub Actions가 아니라 Vercel이 배포한다(각 앱의 `vercel.json`). 버전 릴리스와 무관하다.
