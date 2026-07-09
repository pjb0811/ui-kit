---
name: describe-changes
description: "Analyze the currently staged git diff and compress it into a ≤500-character hierarchical work description, wrapped in a copy-pasteable code block. This is the counterpart to implement-work: this skill turns real staged code changes into a short spec; implement-work turns that spec back into code (elsewhere, or later). Use when the user says '/describe-changes', '변경사항 설명 만들어줘', '스테이징된 내용 설명해줘', 'describe what I staged so it can be replayed'."
---

# Describe Changes

지금 스테이징된 변경사항을 500자 이내의 압축된 계층 목록으로 요약하는 스킬. `implement-work`의 반대 방향이다 — 그쪽은 설명을 코드로 바꾸고, 이건 코드를 설명으로 바꾼다. 여기서 나온 출력은 그대로 `/implement-work "<설명>"`에 붙여넣을 수 있는 입력 스펙이 되어야 한다.

## 절차

### 1. 스테이징 상태 확인

```bash
git diff --cached --name-only
git status --short
```

스테이징된 파일이 없으면 중단하고 안내한다: "스테이징된 파일이 없습니다."

### 2. 변경 내용 분석

```bash
git diff --cached --stat
git diff --cached
```

- 항상 새로 실행해서 최신 스테이징 상태를 기준으로 분석한다.
- `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock` 등 lock 파일과, 포맷팅만 바뀐 자명한 변경은 요약 대상에서 제외한다.
- 스테이징된 파일이 lock 파일뿐이면 "설명할 실질적 변경이 없습니다"라고 안내하고 종료한다.

### 3. 변경 단위 그룹화

관련된 변경끼리 하나의 상위 항목으로 묶는다 (파일 단위가 아니라 의도 단위). 예: 여러 파일에 걸친 하나의 리팩토링은 항목 하나, 서로 무관한 의존성 추가와 스킬 추가는 각각 다른 항목.

### 4. 계층 목록으로 작성

```
1. <상위 항목 — 명사형>
   - <세부사항 1>
   - <세부사항 2>
2. <상위 항목 — 명사형>
   - ...
```

- **명사형/동사원형만 사용**: "~추가", "~수정", "~제거", "~간소화" 등. "~했습니다", "~됩니다" 같은 서술형 어미·접미사는 쓰지 않는다.
- 각 항목에는 가능한 한 **무엇을(대상 파일/함수/패키지) + 어떻게(구체적 방법) + 왜(필요한 경우만, 배경/원인)** 를 압축해서 담는다. 셋 다 넣을 자리가 없으면 "무엇"과 "어떻게"를 우선하고 "왜"부터 줄인다.
- 대상 파일·패키지·버전처럼 나중에 재구현할 때 필요한 구체적 정보는 생략하지 않는다.

### 5. 500자 제한 검증

작성한 목록 전체(코드 블록 내용 기준) 글자 수를 센다.

- 500자를 넘으면 다음 순서로 압축한다: ① 각 항목의 "왜" 설명부터 생략 ② 세부 불릿을 상위 항목 설명에 병합 ③ 그래도 넘으면 덜 중요한 하위 항목부터 생략하되, 생략했다는 사실과 무엇을 생략했는지는 코드 블록 밖에서 짧게 알린다.
- "무엇을 바꿨는지"는 어떤 경우에도 생략하지 않는다 — 압축 대상은 부연 설명이지 핵심 사실이 아니다.

### 6. 출력

완성된 목록을 백틱 코드 블록(```)으로 감싸서 그대로 복사할 수 있게 보여준다. 코드 블록 앞뒤로 별도 해설을 길게 붙이지 않는다 — 이 스킬의 결과물은 그 자체로 `/implement-work`에 붙여넣을 스펙이다.

## 엣지 케이스

- **스테이징된 변경이 너무 방대해서 500자로 도저히 안 됨**: 상위 항목만 남기고, 그래도 넘으면 사용자에게 범위(예: 특정 파일/영역만)를 좁혀서 다시 요청할지 물어본다.
- **의도가 서로 다른 변경이 섞여 있음**: 하나의 목록 안에서도 상위 항목을 분리해서 각각 독립적으로 이해되게 쓴다 (억지로 하나의 항목으로 합치지 않는다).
- **diff만으로 "왜"를 알 수 없음**: 추측해서 채우지 않는다. "왜" 없이 "무엇"과 "어떻게"만 적는다.
