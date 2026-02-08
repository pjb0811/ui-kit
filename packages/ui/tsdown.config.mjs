import { defineConfig } from 'tsdown';

import tailwindcss from '@tailwindcss/postcss';
import postcss from 'rollup-plugin-postcss';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    Typography: 'src/components/atoms/Typography/index.tsx',
    Menu: 'src/components/molecules/Menu/index.tsx',
    Reveals: 'src/components/molecules/Reveals/index.tsx',
    utils: 'src/lib/utils/index.ts',
    enums: 'src/lib/enums/index.ts',
    core: 'src/core/index.ts',
  },
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  unbundle: true,
  plugins: [
    postcss({
      extract: 'style.css',
      plugins: [tailwindcss()],
    }),
  ],
});
