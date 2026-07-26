---
name: version-management
description: "changesets 기반 버전 관리/릴리스 흐름(packages/ui 대상 Version Packages PR → npm publish)과, PR 머지 시 changeset 봇 커밋 때문에 발생하는 GitHub Actions 'action_required' 승인 이슈 대응법. Use when 새 changeset을 추가할 때, 'Version Packages' PR을 머지해야 할 때, PR이 CI는 다 통과한 것 같은데 mergeStateStatus가 BLOCKED로 안 풀릴 때, 또는 '버전 올려줘', 'release 진행', 'npm 배포' 같은 요청이 있을 때."
---

# Version Management (ui-kit)

이 저장소는 `pnpm` + `turbo` 모노레포(`apps/*`, `packages/*`)이고, changesets가 관리하는 배포 대상 패키지는 `packages/ui`(`@repo/ui`, `private: false`)다.

## 릴리스 흐름

1. **changeset 추가**: `packages/ui`에 사용자 대상 변경이 있는 PR에는 `.changeset/*.md`가 필요하다. `pnpm changeset`으로 수동 생성하거나, `changeset-draft.yml`(필수 상태 체크 `draft`)이 PR별로 초안을 자동 생성/갱신해준다.
2. **Version Packages PR**: main에 push될 때마다 `version.yml`이 돌면서, 누적된 changeset들로 `changeset-release/main` 브랜치에 "🔖 chore: version packages" PR을 열고 유지한다. `packages/ui/package.json` 버전 bump + `packages/ui/CHANGELOG.md`(루트가 아니라 패키지 안쪽!) 갱신.
3. **머지 시 자동 배포 (publish.yml)**: 이 PR을 머지하면 그 자체가 main push이므로 `publish.yml`이 실행된다.
   - 버전 조회는 `packages/ui/package.json` 기준 (`require('./packages/ui/package.json').version`).
   - 이미 `vX.Y.Z` 태그가 있는지 확인 → 없으면 `pnpm exec turbo run build --filter=@repo/ui`로 해당 패키지만 빌드.
   - `npm publish`를 직접 부르지 않고 `pnpm run publish-ui` 스크립트를 실행한다 (OIDC Trusted Publishing, 별도 `NPM_TOKEN` 불필요).
   - git 태그 push, GitHub Release 생성(`packages/ui/CHANGELOG.md`에서 해당 버전 섹션을 뽑아 GH Models로 다듬기 시도).

⚠️ **npm publish는 공개적이고 되돌리기 어려운 배포다.** "Version Packages" PR(`changeset-release/main`)을 머지하기 전에는 "이 머지 = `@repo/ui`의 새 버전이 실제로 npm에 배포됨"이라는 걸 사용자에게 명확히 알리고 별도로 확인받는다.

## 필수 상태 체크와 "action_required" 함정

이 저장소의 브랜치 룰셋은 `lint-and-build (Node v24.x)`와 `draft` 두 체크를 필수로 요구한다 (`gh api repos/pjb0811/ui-kit/rulesets`로 확인 가능).

PR을 열면 `changeset-draft.yml` 봇이 그 브랜치에 커밋을 하나 더 push해서(draft changeset 추가/갱신) `synchronize` 이벤트가 발생할 수 있다. 이 새 커밋에 대해 재트리거된 CI/Changeset Draft 실행이 **`conclusion: action_required`, job 0개**로 멈추는 경우가 있는데, 실제로는 문제 없는 정상 재실행이다. 이러면 필수 체크가 "완료"로 안 잡혀 PR의 `mergeStateStatus`가 계속 `BLOCKED`로 남는다.

**해결 절차:**

```bash
gh run list --branch <branch> --json databaseId,name,status,conclusion,headSha,event
gh api -X POST repos/pjb0811/ui-kit/actions/runs/<run_id>/approve
gh run watch <run_id> --exit-status
gh pr view <n> --json mergeable,mergeStateStatus   # CLEAN이면 머지 가능
```

## 브랜치 네이밍

Conventional Commits 접두어를 브랜치명에도 쓴다: `feat/*`, `fix/*`, `refactor/*`, `chore/*`.

⚠️ **함정**: git은 `feat`이라는 이름의 브랜치와 `feat/foo`라는 이름의 브랜치를 동시에 가질 수 없다 (ref 경로 충돌). 새 브랜치를 만들기 전에 `git branch -a`로 겹치는 bare 브랜치가 남아있는지 확인하고, 있으면 대체 이름을 쓰거나 삭제 여부를 사용자에게 먼저 물어본다.

## 참고

- 관련 워크플로우: `.github/workflows/changeset-draft.yml`, `.github/workflows/version.yml`, `.github/workflows/publish.yml`, `.github/workflows/ci.yml`
- `docs-deploy.yml`은 별개 — 문서 사이트 배포용이며 버전 릴리스와 무관하게 동작한다.
- 다른 패키지(`apps/*`)를 추가로 배포 대상에 포함시키게 되면, `publish.yml`의 버전 조회 경로(`packages/ui/package.json`)와 `--filter` 대상을 그 패키지에 맞게 확장해야 한다는 점을 기억한다.
