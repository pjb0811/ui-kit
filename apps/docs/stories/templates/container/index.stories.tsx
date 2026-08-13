import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Container } from '@repo/ui';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    maxWidth: {
      control: { type: 'select' },
      options: [
        '3xs',
        '2xs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        'full',
        'none',
      ],
    },
    padded: {
      control: { type: 'boolean' },
    },
    asChild: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DemoContent = () => (
  <div
    className="rounded border border-dashed border-gray-300 bg-gray-50 py-6
      text-center text-sm text-gray-500"
  >
    이 영역이 Container의 maxWidth/padded 설정에 따라 폭이 제한되고 좌우 여백이
    붙습니다.
  </div>
);

export const Default: Story = {
  args: {
    maxWidth: '7xl',
    padded: true,
  },
  render: args => (
    <Container {...args}>
      <DemoContent />
    </Container>
  ),
};

export const NarrowMaxWidth: Story = {
  args: {
    maxWidth: 'md',
    padded: true,
  },
  render: args => (
    <Container {...args}>
      <DemoContent />
    </Container>
  ),
};

export const NoPadding: Story = {
  args: {
    maxWidth: 'lg',
    padded: false,
  },
  render: args => (
    <Container {...args}>
      <DemoContent />
    </Container>
  ),
};
