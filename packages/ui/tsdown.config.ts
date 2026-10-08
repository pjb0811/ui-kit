import { defineConfig } from 'tsdown';

import tailwindcss from '@tailwindcss/postcss';
import postcss from 'rollup-plugin-postcss';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    Avatar: 'src/components/atoms/avatar.tsx',
    Badge: 'src/components/atoms/badge.tsx',
    Segmented: 'src/components/atoms/segmented.tsx',
    TimePicker: 'src/components/atoms/time-picker.tsx',
    Typography: 'src/components/atoms/typography/index.ts',
    Button: 'src/components/atoms/button.tsx',
    CodeEditor: 'src/components/atoms/code-editor.tsx',
    Tag: 'src/components/atoms/tag.tsx',
    Card: 'src/components/molecules/card.tsx',
    Descriptions: 'src/components/molecules/descriptions.tsx',
    Alert: 'src/components/molecules/alert.tsx',
    Breadcrumb: 'src/components/molecules/breadcrumb.tsx',
    Steps: 'src/components/molecules/steps.tsx',
    Popconfirm: 'src/components/molecules/popconfirm.tsx',
    Pagination: 'src/components/molecules/pagination.tsx',
    Table: 'src/components/organisms/table.tsx',
    Space: 'src/components/molecules/space.tsx',
    ScrollArea: 'src/components/molecules/scroll-area.tsx',
    Menu: 'src/components/molecules/menu/index.ts',
    Reveals: 'src/components/molecules/reveals/index.ts',
    Layout: 'src/components/templates/layout/index.ts',
    utils: 'src/lib/utils/index.ts',
    providers: 'src/providers/index.ts',
    style: 'src/globals.css',
  },
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  unbundle: true,
  deps: { onlyBundle: ['gsap'] },
  plugins: [
    postcss({
      extract: 'style.css',
      plugins: [tailwindcss()],
    }),
  ],
});
