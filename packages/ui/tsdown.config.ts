import { defineConfig } from 'tsdown';

import tailwindcss from '@tailwindcss/postcss';
import postcss from 'rollup-plugin-postcss';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    Typography: 'src/components/atoms/typography/index.ts',
    Menu: 'src/components/molecules/menu/index.ts',
    Reveals: 'src/components/molecules/reveals/index.ts',
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
