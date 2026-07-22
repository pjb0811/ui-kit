import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Reveals } from '@repo/ui';

const defaultItems = [
  {
    children: (
      <div className="rounded-lg bg-blue-500 p-6 text-white">
        <h3 className="text-xl font-bold">첫 번째 카드</h3>
        <p className="text-blue-100">이 카드는 첫 번째로 나타납니다.</p>
      </div>
    ),
  },
  {
    children: (
      <div className="rounded-lg bg-green-500 p-6 text-white">
        <h3 className="text-xl font-bold">두 번째 카드</h3>
        <p className="text-green-100">이 카드는 두 번째로 나타납니다.</p>
      </div>
    ),
  },
  {
    children: (
      <div className="rounded-lg bg-purple-500 p-6 text-white">
        <h3 className="text-xl font-bold">세 번째 카드</h3>
        <p className="text-purple-100">이 카드는 세 번째로 나타납니다.</p>
      </div>
    ),
  },
  {
    children: (
      <div className="rounded-lg bg-orange-500 p-6 text-white">
        <h3 className="text-xl font-bold">네 번째 카드</h3>
        <p className="text-orange-100">이 카드는 네 번째로 나타납니다.</p>
      </div>
    ),
  },
];

const meta: Meta<typeof Reveals> = {
  title: 'UI/Reveals',
  component: Reveals,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    cascade: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
    },
    delay: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
    },
    items: {
      control: { type: 'object' },
    },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
    viewport: { table: { disable: true } },
    variants: { table: { disable: true } },
    transition: { table: { disable: true } },
    classNames: { table: { disable: true } },
  },
  render: props => (
    <div className="flex h-[1500px] items-center justify-center">
      <Reveals {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cascade: 0.1,
    duration: 0.6,
    delay: 0,
    items: defaultItems,
  },
};
