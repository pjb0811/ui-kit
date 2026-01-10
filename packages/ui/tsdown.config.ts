import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    Typography: 'src/components/atoms/Typography/index.tsx',
    Menu: 'src/components/molecules/Menu/index.tsx',
    Reveals: 'src/components/molecules/Reveals/index.tsx',
    utils: 'src/lib/utils/index.ts',
    enums: 'src/lib/enums/index.ts',
  },
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', 'tailwindcss'],
  copy: ['src/output.css'],
});
