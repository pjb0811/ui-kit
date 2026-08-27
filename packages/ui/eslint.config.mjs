import { config } from '@repo/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['scripts/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowWithName: 'Props$',
        },
      ],
      // `src/core` is internal (#278 step ④). The `@repo/ui/core` specifier
      // still resolves via the tsconfig alias, so it passes check-types, lint
      // and the @repo/ui build — but apps that bundle @repo/ui from source
      // (the Docusaurus docs/web apps) resolve it through the package
      // `exports` map, where `./core` no longer exists, and only fail at app
      // build time. Force the relative form so that failure can't happen.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@repo/ui/core', '@repo/ui/core/*'],
              message:
                "src/core is internal — import it by relative path (e.g. '../../core'). The '@repo/ui/core' specifier breaks apps that bundle @repo/ui from source (docs/web).",
            },
          ],
        },
      ],
    },
  },
];
