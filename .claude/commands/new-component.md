새 컴포넌트를 생성합니다. 인자: `$ARGUMENTS` (예: `atoms/Badge` 또는 `molecules/Timeline`)

## 작업 순서

1. **인자 파싱** — `$ARGUMENTS`를 `{tier}/{ComponentName}` 형태로 파싱한다.
   - tier는 `atoms` / `molecules` / `organisms` / `templates` 중 하나여야 한다.
   - ComponentName(export 이름)은 PascalCase로 변환한다.
   - 폴더명은 ComponentName을 kebab-case로 변환해서 쓴다 (예: `FloatButton` → `float-button`).

2. **컴포넌트 파일 생성** — `packages/ui/src/components/{tier}/{kebab-case-name}/index.tsx`

   아래 패턴을 따른다:
   - Props 인터페이스 이름은 반드시 `Props`
   - `cn()` import: `import { cn } from '@repo/ui/utils'`
   - 상호작용이 없으면 `'use client'` 제거
   - className 병합 시 사용자 className이 마지막, `cn()` 마지막 인자 뒤 `//` 빈 주석
   - `export default ComponentName` + `export type { Props }` (폴더명은 kebab-case, export 이름은 PascalCase)

3. **계층 index 등록** — `packages/ui/src/components/{tier}/index.ts`에 아래 한 줄 추가

   ```ts
   export { default as ComponentName } from './kebab-case-name';
   ```

   알파벳 순서를 유지한다.

4. **Storybook 스토리 생성** — `apps/docs/stories/{tier}/{kebab-case-name}/index.stories.tsx`

   아래 패턴을 따른다:

   ```tsx
   import type { Meta, StoryObj } from '@storybook/nextjs-vite';
   
   import { ComponentName } from '@repo/ui';
   
   const meta: Meta<typeof ComponentName> = {
     title: 'UI/ComponentName',
     component: ComponentName,
     argTypes: {
       /* Props 기반으로 채움 */
     },
   };
   
   export default meta;
   type Story = StoryObj<typeof meta>;
   
   export const Default: Story = {
     args: {
       /* 기본값 */
     },
   };
   ```

5. **완료 보고** — 생성된 파일 목록과 추가로 필요한 작업(peer dependency, core 프리미티브 등)을 안내한다.
