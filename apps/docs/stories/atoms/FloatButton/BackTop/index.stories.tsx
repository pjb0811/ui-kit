import type { Meta, StoryObj } from '@storybook/nextjs';

import { FloatButton } from '@repo/ui';

const meta: Meta<typeof FloatButton.BackTop> = {
  title: 'UI/FloatButton/BackTop',
  component: FloatButton.BackTop,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    visibilityHeight: { control: 'number' },
    asChild: { table: { disable: true } },
    icon: { table: { disable: true } },
    block: { table: { disable: true } },
    loading: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  render: props => (
    <div className="h-[1000px]">
      <FloatButton.BackTop {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { visibilityHeight: 450 },
};
