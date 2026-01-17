import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
  title: 'UI/Menu',
  component: Menu,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'inline'],
    },
    fullSize: {
      control: { type: 'boolean' },
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

export const Default: Story = {
  args: {
    mode: 'horizontal',
    fullSize: false,
    items: defaultItems,
    selectedKeys: [],
    defaultSelectedKeys: [],
    offset: [0, 0],
    inlineOffset: 0,
  },
};
