import type { Preview } from '@storybook/nextjs-vite';

// `./tailwind.css` also pulls in `@repo/ui/style.css`, deliberately after
// Tailwind's own preflight — see the comment in that file for why it isn't
// a separate import here.
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
