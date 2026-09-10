import { config } from '@repo/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    // Node scripts, not part of the Docusaurus bundle — the shared React config
    // targets the browser, so `process`/`import.meta` trip `no-undef` here.
    // Matches how packages/ui treats its own scripts/.
    ignores: ['.docusaurus/**', 'build/**', '.next/**', 'scripts/**'],
  },
];
