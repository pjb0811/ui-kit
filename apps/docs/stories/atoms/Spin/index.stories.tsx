import type { Meta, StoryObj } from '@storybook/nextjs';

import { Spin } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Spin> = {
  title: 'UI/Spin',
  component: Spin,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    spinning: {
      control: { type: 'boolean' },
      description: '스피너 표시 여부',
    },
    className: {
      control: { type: 'text' },
      description: '스피너 아이콘에 적용할 추가 CSS 클래스',
    },
  },
  render: props => (
    <div
      className={cn(
        'flex h-32 w-32 items-center justify-center',
        'rounded-md border border-dashed',
        'bg-gray-50',
      )}
    >
      <Spin {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    spinning: true,
  },
};
