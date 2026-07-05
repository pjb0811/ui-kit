@repo/ui 패키지 퍼블리시 전 상태를 점검합니다.

## 체크리스트 (순서대로 실행)

1. **타입 체크**

   ```bash
   cd packages/ui && pnpm check-types
   ```

   오류가 있으면 내용을 보고하고 중단한다.

2. **빌드**

   ```bash
   cd packages/ui && pnpm build
   ```

   빌드 실패 시 오류 내용을 보고하고 중단한다.

3. **Changeset 상태 확인**

   ```bash
   pnpm changeset status
   ```

   - 변경사항이 없으면 경고: 퍼블리시할 버전 변경이 없을 수 있음
   - pending changeset이 있으면 버전과 내용을 요약해서 보고

4. **package.json 버전 확인**
   - `packages/ui/package.json`의 `version` 필드 출력
   - npm 최신 버전과 비교: `npm view @repo/ui version 2>/dev/null || echo "not published yet"`

5. **exports 필드 확인**
   - `packages/ui/package.json`의 `exports` 필드에 새로 추가된 컴포넌트 진입점이 누락되지 않았는지 확인
   - `src/index.ts` re-export 목록과 대조

6. **최종 요약**
   통과/실패 항목을 표로 정리하고, 문제가 없으면 퍼블리시 커맨드를 안내한다:
   ```bash
   pnpm changeset version   # 버전 범프
   pnpm publish-ui          # 퍼블리시
   ```
