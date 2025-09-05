import type { Meta, StoryObj } from '@storybook/nextjs';

import { Breakpointer } from '@repo/ui';

const meta: Meta<typeof Breakpointer> = {
  title: 'UI/Breakpointer',
  component: Breakpointer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: breakpoint => (
      <div className="p-5">
        <strong>현재 breakpoint:</strong>
        <pre>{JSON.stringify(breakpoint, null, 2)}</pre>
      </div>
    ),
  },
};
