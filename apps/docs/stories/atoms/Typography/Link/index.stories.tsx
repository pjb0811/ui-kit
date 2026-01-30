import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Typography } from '@repo/ui';

const meta: Meta<typeof Typography.Link> = {
  title: 'UI/Typography/Link',
  component: Typography.Link,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    href: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '링크 텍스트',
    href: '#',
  },
};
