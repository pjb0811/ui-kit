import { config } from '@repo/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowWithName: 'Props$',
        },
      ],
    },
  },
];
