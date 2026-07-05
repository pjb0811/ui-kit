---
name: commit
description: "Generate a commit message from staged changes using this repository's commit convention. Use when the user asks for /commit, commit message generation, gitmoji selection, commit type or scope selection, or creating an actual git commit from staged files."
argument-hint: 'Optional: commit language or special emphasis, for example "ko", "en", or "docs only"'
user-invocable: true
disable-model-invocation: false
---

# Commit Message Generation

이 스킬은 이 저장소의 커밋 컨벤션을 기준으로 스테이징된 변경을 해석해 커밋 메시지를 작성할 때 사용한다.

## When to Use

- 사용자가 `/commit` 을 호출할 때
- 스테이징된 변경을 바탕으로 커밋 메시지를 만들어 달라고 할 때
- gitmoji, type, scope 선택까지 포함한 커밋 메시지 초안이 필요할 때
- 사용자가 명시적으로 요청한 경우 실제 `git commit` 까지 진행해야 할 때

## Source Convention

- 저장소 기준 문서는 `.github/COMMIT_CONVENTION.md`, `.github/COMMIT_CONVENTION.en.md`, `.github/COMMIT_CONVENTION.ko.md` 이다.
- 언어를 명시하지 않으면 기본값은 한국어(`ko`)이다. 영어로 요청하면 영어 메시지를 사용한다.
- 언어와 무관하게 형식은 반드시 아래 형태를 따른다.

```text
<emoji> <type>(<scope>): <short summary>

- detail 1
- detail 2
```

## Required Rules

- 변경 내용에 가장 적절한 gitmoji 하나만 고른다.
- `type` 은 `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build` 중 하나만 사용한다.
- `scope` 는 브랜치명이 있으면 브랜치명을 우선 사용한다.
- 브랜치명을 쓸 수 없으면 변경 영역을 짧게 지정한다. 예: `components`, `styles`, `config`, `build`
- 제목은 명령형 현재 시제로 짧게 쓴다.
- 제목 끝에 마침표를 붙이지 않는다.
- lock file 변경은 해석에서 제외한다. 예: `pnpm-lock.yaml`, `package-lock.json`
- 반드시 스테이징된 파일만 기준으로 판단한다. 워킹 트리 전체를 근거로 추론하지 않는다.

## Procedure

1. 먼저 스테이징된 변경이 있는지 확인한다.
2. 스테이징된 파일 목록에서 lock file 은 제외한다.
3. 스테이징된 변경이 없으면 메시지를 지어내지 말고, 스테이징이 필요하다고 안내한다.
4. 현재 브랜치명을 확인해 `scope` 후보로 사용한다.
5. 스테이징된 diff 와 파일 목록만 보고 가장 대표적인 변경 목적 하나를 고른다.
6. 그 목적에 맞는 `gitmoji` 와 `type` 을 하나씩만 선택한다.
7. 한 줄 제목을 먼저 만들고, 이어서 본문 bullet 을 1개 이상 작성한다.
8. 결과는 바로 사용할 수 있는 최종 커밋 메시지 형태로 제시한다.
9. 사용자가 실제 커밋 실행을 명시적으로 요청한 경우에만 `git commit` 을 수행한다.

## Execution Guidance

- 기본 동작은 커밋 메시지 초안 생성이다.
- 실제 커밋 전에는 생성한 메시지가 스테이징된 변경과 정확히 맞는지 다시 확인한다.
- 실제 커밋을 수행할 때도 unstaged 변경은 무시한다.
- 제목과 본문이 여러 변경 목적을 섞고 있다면 범위를 다시 좁혀 한 커밋의 주제로 정리한다.

## Output Format

- 응답 첫 부분에 완성된 커밋 메시지를 코드 블록으로 제공한다.
- 필요하면 바로 아래에 `type`, `scope`, `gitmoji` 선택 이유를 한두 문장으로 짧게 덧붙인다.
- 사용자가 커밋 실행까지 요청하지 않았다면 실제 `git commit` 명령은 실행하지 않는다.

## Quick Checks

- 제목이 `<emoji> <type>(<scope>): <short summary>` 형식을 만족하는가
- gitmoji 가 정확히 하나인가
- 제목 끝에 마침표가 없는가
- 본문이 `-` bullet 형식인가
- lock file 만으로 메시지를 해석하지 않았는가
- 스테이징되지 않은 변경을 근거로 쓰지 않았는가
