import type { Preview } from '@storybook/nextjs-vite';

import '@repo/ui/style.css';

// Tailwind (with preflight, in `@layer base`) first, then the ui-kit theme,
// utilities and component styles. `@repo/ui/style.css` no longer ships
// preflight, so `./tailwind.css` supplies it for the story canvas — see that
// file for why the app's globals.css must NOT be used here.
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
