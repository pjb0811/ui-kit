import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Swiper } from '@repo/ui';
import { cn } from '@repo/ui/utils';

interface Item {
  id: number;
  title: string;
  color: string;
}

const defaultData: Item[] = [
  { id: 1, title: '슬라이드 1', color: 'bg-blue-500' },
  { id: 2, title: '슬라이드 2', color: 'bg-green-500' },
  { id: 3, title: '슬라이드 3', color: 'bg-purple-500' },
  { id: 4, title: '슬라이드 4', color: 'bg-orange-500' },
  { id: 5, title: '슬라이드 5', color: 'bg-pink-500' },
];

const meta: Meta<typeof Swiper<Item>> = {
  title: 'UI/Swiper',
  component: Swiper,
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
    style: {
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
    style: {
      width: 480,
    },
    renderItem: item => (
      <Swiper.Slide key={item.id}>
        <div
          className={cn(
            'flex items-center justify-center',
            'h-32 rounded-lg text-white',
            item.color,
          )}
        >
          <h3 className="text-xl font-bold">{item.title}</h3>
        </div>
      </Swiper.Slide>
    ),
  },
};
