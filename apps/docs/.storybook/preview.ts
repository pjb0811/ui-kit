import type { Preview } from '@storybook/nextjs-vite';

import '@repo/ui/style.css';

// `@repo/ui/style.css` no longer ships Tailwind's preflight (it's a global
// reset that shouldn't leak from a component library). Import the app's own
// globals first — it runs Tailwind (`@import 'tailwindcss'`) and provides
// preflight + base resets for the story canvas — then the ui-kit theme,
// utilities and component styles. Mirrors how a real app consumes the package.
import '../app/globals.css';

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
