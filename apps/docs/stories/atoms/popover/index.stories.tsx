import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, Popover } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    content: {
      control: { type: 'text' },
    },
    placement: {
      control: {
        type: 'select',
        options: [
          'top',
          'left',
          'right',
          'bottom',
          'topLeft',
          'topRight',
          'bottomLeft',
          'bottomRight',
          'leftTop',
          'leftBottom',
          'rightTop',
          'rightBottom',
        ],
      },
    },
  },
  render: props => (
    <div
      className={cn(
        'flex items-center justify-center',
        'w-80 p-10',
        'rounded-md border',
      )}
    >
      <Popover {...props} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: (
      <div className="text-foreground mb-2 text-sm font-medium">Title</div>
    ),
    content: (
      <p className="text-muted-foreground text-sm">
        간단한 컨텐츠 영역입니다. 원하는 내용을 넣어보세요.
      </p>
    ),
    children: <Button>Open Popover</Button>,
  },
};
