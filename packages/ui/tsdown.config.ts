import { defineConfig } from 'tsdown';

import tailwindcss from '@tailwindcss/postcss';
import postcss from 'rollup-plugin-postcss';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    Typography: 'src/components/atoms/typography/index.ts',
    Button: 'src/components/atoms/button.tsx',
    Tag: 'src/components/atoms/tag.tsx',
    Card: 'src/components/molecules/card.tsx',
    Space: 'src/components/molecules/space.tsx',
    Menu: 'src/components/molecules/menu/index.ts',
    Reveals: 'src/components/molecules/reveals/index.ts',
    Layout: 'src/components/templates/layout/index.ts',
    utils: 'src/lib/utils/index.ts',
    enums: 'src/lib/enums/index.ts',
    core: 'src/core/index.ts',
    style: 'src/globals.css',
  },
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  unbundle: true,
  inlineOnly: ['gsap'],
  plugins: [
    postcss({
      extract: 'style.css',
      plugins: [tailwindcss()],
    }),
  ],
});
