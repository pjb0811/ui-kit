import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button, Empty } from '@repo/ui';

const meta: Meta<typeof Empty> = {
  title: 'Data Display/Empty',
  component: Empty,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    icon: { table: { disable: true } },
    action: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    description: 'No data',
  },
};

export const WithTitle: Story = {
  args: {
    title: '검색 결과가 없습니다',
    description: '다른 검색어로 다시 시도해 보세요',
  },
};

export const WithAction: Story = {
  args: {
    title: '항목이 없습니다',
    description: '첫 항목을 추가해 보세요',
  },
  render: args => (
    <Empty {...args} action={<Button color="primary">항목 추가</Button>} />
  ),
};
