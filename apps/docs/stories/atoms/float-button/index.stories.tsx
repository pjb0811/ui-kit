import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Settings } from 'lucide-react';

import { FloatButton } from '@repo/ui';

const meta: Meta<typeof FloatButton> = {
  title: 'UI/FloatButton',
  component: FloatButton,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    icon: { table: { disable: true } },
    asChild: { table: { disable: true } },
    block: { table: { disable: true } },
    loading: { type: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Settings />,
  },
};
