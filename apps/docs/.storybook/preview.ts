import type { Preview } from '@storybook/nextjs-vite';

import '@repo/ui/style.css';

// Tailwind (with preflight, in `@layer base`) first, then the ui-kit theme,
// utilities and component styles. `@repo/ui/style.css` no longer ships
// preflight, so `./tailwind.css` supplies it for the story canvas — see that
// file for why the app's globals.css must NOT be used here.
//
// Order matters here beyond just which file runs last: both this file and
// `@repo/ui/style.css` declare `* { border-color: ... }` in `@layer base`.
// Same layer + equal specificity means the *later* import wins, so
// `@repo/ui/style.css` (which restores our `--border` token over Tailwind's
// v4 default of `currentColor`) has to load after preflight, not before —
// swapped, preflight's `currentColor` silently won and every bare `border`
// utility (e.g. PopoverContent) rendered near-black instead of the theme's
// light gray.
import './tailwind.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
  },
};

export default preview;
