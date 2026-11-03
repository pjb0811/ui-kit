import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Menu } from '@repo/ui';

const defaultItems = [
  {
    key: '1',
    label: '홈',
  },
  {
    key: '2',
    label: '제품',
    children: [
      {
        key: '2-1',
        label: '웹사이트',
      },
      {
        key: '2-2',
        label: '모바일 앱',
      },
    ],
  },
  {
    key: '3',
    label: '서비스',
    children: [
      {
        key: '3-1',
        label: '개발',
      },
      {
        key: '3-2',
        label: '디자인',
      },
      {
        key: '3-3',
        label: '마케팅',
      },
    ],
  },
  {
    key: '4',
    label: '회사',
    children: [
      {
        key: '4-1',
        label: '소개',
      },
      {
        key: '4-2',
        label: '팀',
      },
      {
        key: '4-3',
        label: '채용',
      },
    ],
  },
  {
    key: '5',
    label: '연락처',
  },
];

const meta: Meta<typeof Menu> = {
  title: 'Navigation/Menu',
  component: Menu,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'inline'],
    },
    selectedKeys: {
      control: { type: 'object' },
    },
    defaultSelectedKeys: {
      control: { type: 'object' },
    },
    offset: {
      control: { type: 'object' },
    },
    inlineOffset: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DemoControlledMenu = (args: React.ComponentProps<typeof Menu>) => {
  const [selected, setSelected] = useState<React.Key[]>(['3']);

  return (
    <div className="p-4">
      <div className="mb-4">
        <p className="mb-2 text-sm font-semibold">제어 모드: 외부 상태 관리</p>
        <p className="mb-3 text-sm text-gray-600">
          선택된 항목: {selected.length > 0 ? selected.join(', ') : '없음'}
        </p>
        <button
          onClick={() => setSelected([])}
          className="mb-4 rounded bg-blue-500 px-3 py-1 text-sm text-white
            hover:bg-blue-600"
        >
          초기화
        </button>
      </div>
      <Menu
        {...args}
        selectedKeys={selected}
        onSelect={params => {
          setSelected([params.key]);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    mode: 'horizontal',
    items: defaultItems,
    selectedKeys: [],
    defaultSelectedKeys: [],
    offset: [0, 0],
    inlineOffset: 0,
  },
};

export const Uncontrolled: Story = {
  args: {
    mode: 'vertical',
    items: defaultItems,
    defaultSelectedKeys: ['2'],
    offset: [0, 0],
    inlineOffset: 0,
  },
  render: args => (
    <div className="p-4">
      <p className="mb-4 text-sm text-gray-600">
        비제어 모드: 내부 상태 관리, defaultSelectedKeys로 초기값 설정
      </p>
      <Menu {...args} />
    </div>
  ),
};

export const Controlled: Story = {
  args: {
    mode: 'vertical',
    items: defaultItems,
    offset: [0, 0],
    inlineOffset: 0,
  },
  render: args => <DemoControlledMenu {...args} />,
};

const KeyboardMenu = ({
  direction,
  ...args
}: React.ComponentProps<typeof Menu> & { direction?: 'ltr' | 'rtl' }) => (
  <div className="flex flex-col items-start gap-4 p-4" dir={direction}>
    <button type="button">Before</button>
    <Menu {...args} />
  </div>
);

// One Tab stop per level that follows the last focused item; arrow keys
// wrap, and Home/End jump to the ends (#592).
export const KeyboardNavigation: Story = {
  args: { mode: 'horizontal', items: defaultItems },
  render: args => <KeyboardMenu {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = (name: string) => canvas.getByRole('menuitem', { name });

    await userEvent.click(canvas.getByRole('button', { name: 'Before' }));
    await userEvent.tab();
    await expect(item('홈')).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await expect(item('연락처')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(item('홈')).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(item('연락처')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(item('홈')).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(item('서비스')).toHaveFocus();
    await expect(
      canvasElement.querySelectorAll(
        '[data-slot="menu"] > li > [role="menuitem"][tabindex="0"]',
      ),
    ).toHaveLength(1);

    // Leaving and coming back lands on the item the user left. Wait for the
    // submenu of 제품 to finish its exit animation first.
    await waitFor(() =>
      expect(canvas.queryByRole('menuitem', { name: '웹사이트' })).toBeNull(),
    );
    await userEvent.tab({ shift: true });
    await expect(canvas.getByRole('button', { name: 'Before' })).toHaveFocus();
    await userEvent.tab();
    await expect(item('서비스')).toHaveFocus();

    // A submenu stacks its items vertically, so it moves with Up/Down.
    await userEvent.keyboard('{ArrowLeft}');
    await expect(item('제품')).toHaveFocus();
    await userEvent.tab();
    await expect(item('웹사이트')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(item('모바일 앱')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(item('웹사이트')).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(item('웹사이트')).toHaveAttribute('aria-current', 'true');
  },
};

export const KeyboardRightToLeft: Story = {
  args: { mode: 'horizontal', items: defaultItems },
  render: args => <KeyboardMenu {...args} direction="rtl" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = (name: string) => canvas.getByRole('menuitem', { name });

    await userEvent.click(canvas.getByRole('button', { name: 'Before' }));
    await userEvent.tab();
    await expect(item('홈')).toHaveFocus();

    // In RTL the next item sits to the left.
    await userEvent.keyboard('{ArrowLeft}');
    await expect(item('제품')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(item('홈')).toHaveFocus();
  },
};
