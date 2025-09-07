import type { Meta, StoryObj } from '@storybook/nextjs';

import { List } from '@repo/ui';

interface Item {
  id: number;
  name: string;
  description: string;
}

const defaultData: Item[] = [
  { id: 1, name: '아이템 1', description: '첫 번째 아이템입니다.' },
  { id: 2, name: '아이템 2', description: '두 번째 아이템입니다.' },
  { id: 3, name: '아이템 3', description: '세 번째 아이템입니다.' },
  { id: 4, name: '아이템 4', description: '네 번째 아이템입니다.' },
  { id: 5, name: '아이템 5', description: '다섯 번째 아이템입니다.' },
];

const meta: Meta<typeof List<Item>> = {
  title: 'UI/List',
  component: List,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    loading: {
      control: { type: 'boolean' },
    },
    data: {
      control: { type: 'object' },
    },
    renderItem: {
      action: 'renderItem',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
    data: defaultData,
    renderItem: item => (
      <div key={item.id} className="rounded-lg border p-4">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-600">{item.description}</p>
      </div>
    ),
  },
};
