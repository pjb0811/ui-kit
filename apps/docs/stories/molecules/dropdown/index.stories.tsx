import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronDown } from 'lucide-react';

import { Button, Dropdown } from '@repo/ui';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    trigger: {
      control: { type: 'select' },
      options: ['hover', 'click'],
    },
    open: {
      control: { type: 'boolean' },
    },
    menu: {
      control: { type: 'object' },
    },
    placement: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: 'hover',
    menu: {
      items: [
        {
          key: '1',
          label: '프로필',
          children: [
            {
              key: '1-1',
              label: '내 정보',
            },
            {
              key: '1-2',
              label: '설정',
            },
          ],
        },
        {
          key: '2',
          label: '계정',
          children: [
            {
              key: '2-1',
              label: '로그아웃',
            },
          ],
        },
      ],
    },
  },
  render: props => (
    <div className="p-8">
      <Dropdown
        {...props}
        menu={{
          ...props.menu,
          onClick: params => {
            console.log('Menu clicked:', params);
          },
        }}
      >
        <Button variant="outlined">
          메뉴
          <ChevronDown className="h-4 w-4" />
        </Button>
      </Dropdown>
    </div>
  ),
};
