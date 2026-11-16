import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronDown } from 'lucide-react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Button, Dropdown } from '@repo/ui';

const meta: Meta<typeof Dropdown> = {
  title: 'Navigation/Dropdown',
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

export const ClickCloses: Story = {
  name: 'Click trigger closes on select and Escape',
  args: {
    trigger: 'click',
    menu: {
      onClick: fn(),
      onSelect: fn(),
      items: [
        { key: 'profile', label: 'Profile' },
        {
          key: 'account',
          label: 'Account',
          children: [{ key: 'logout', label: 'Log out' }],
        },
      ],
    },
  },
  render: props => (
    <div className="p-8">
      <Dropdown {...props}>
        <span>Open menu</span>
      </Dropdown>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open menu' });
    const isClosed = () =>
      waitFor(() => expect(canvas.queryByRole('menuitem')).toBeNull());

    // Selecting a leaf item closes the menu after the callbacks ran.
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Profile' }));
    await expect(args.menu?.onClick).toHaveBeenCalledTimes(1);
    await expect(args.menu?.onSelect).toHaveBeenCalledTimes(1);
    await isClosed();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // An item with children opens its submenu instead.
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Account' }));
    await expect(
      canvas.getByRole('menuitem', { name: 'Profile' }),
    ).toBeVisible();

    // Escape on a focused item closes the menu and focuses the trigger.
    canvas.getByRole('menuitem', { name: 'Profile' }).focus();
    await userEvent.keyboard('{Escape}');
    await isClosed();
    await expect(trigger).toHaveFocus();
  },
};
