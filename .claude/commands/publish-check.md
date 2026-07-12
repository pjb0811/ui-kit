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

3. **버전 상태 확인**

   ```bash
   node -p "require('./packages/ui/package.json').version"
   npm view @repo/ui version 2>/dev/null || echo "not published yet"
   ```

   - `packages/ui/package.json` 버전이 npm 최신 버전보다 앞서 있으면, `develop`에서 `changelog-develop.yml`이 이미 버전을 승격시킨 상태 — `main`에 머지되는 즉시 `publish.yml`이 자동으로 빌드/퍼블리시/태그한다.
   - 두 버전이 같으면 아직 퍼블리시할 변경사항이 없다는 뜻. `packages/ui/CHANGELOG.md`의 `## [Unreleased]` 바로 아래 섹션이 최신 버전과 일치하는지로도 확인 가능.

4. **exports 필드 확인**
   - `packages/ui/package.json`의 `exports` 필드에 새로 추가된 컴포넌트 진입점이 누락되지 않았는지 확인
   - `src/index.ts` re-export 목록과 대조

5. **최종 요약**
   통과/실패 항목을 표로 정리한다. 별도 수동 퍼블리시 명령은 없다 — `main`에 머지되면 `publish.yml`이 자동으로 빌드/퍼블리시/태그까지 처리한다.
