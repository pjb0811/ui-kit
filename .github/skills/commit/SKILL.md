---
name: commit
description: COMMIT_CONVENTION.md 기반 커밋 메시지 생성
---

# 커밋 메시지 생성

.github/COMMIT_CONVENTION.md 에 정의된 커밋 컨벤션을 따라 커밋 메시지를 생성합니다.

## 절차

1. **`git status --short`로 현재 상태만 확인** (이전 커밋 이력 참조 금지)
   - Staged (M) 파일이 없으면 중단 후 "스테이징된 변경이 없습니다" 반환
   - 현재 상태만 보고 이전 커밋 내용은 재확인하지 않음
2. `git diff --cached`로 staged 변경 내용만 분석 (현재 상태만)
3. `git rev-parse --abbrev-ref HEAD`로 현재 브랜치명 확인 (스코프에 사용)
4. lock 파일 변경은 분석에서 제외
5. 컨벤션에 맞는 커밋 메시지 생성

## 형식

```
<emoji> <type>(<scope>): <영어 요약>

- 변경사항 1
- 변경사항 2
```

- scope: 브랜치명 우선 사용
- gitmoji: https://gitmoji.dev/ 에서 변경 내용에 가장 적절한 것 하나만 선택
- 본문: 변경사항을 `-` 목록으로 나열
- 작성 언어: 영어
- 최종 응답은 커밋 메시지 전체를 복사하기 쉽도록 하나의 코드 블록(백틱 3개)으로 감싸서 출력
