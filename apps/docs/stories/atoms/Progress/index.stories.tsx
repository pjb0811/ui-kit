import type { Meta, StoryObj } from '@storybook/nextjs';

import { Progress } from '@repo/ui';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100 } },
    classNames: { table: { disable: true } },
  },
  render: props => (
    <div className="flex size-64 items-center justify-center">
      <Progress {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};
