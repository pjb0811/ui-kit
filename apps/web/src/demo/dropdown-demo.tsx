import { Button, Dropdown } from '@repo/ui';

const menu = {
  items: [
    {
      key: 'profile',
      label: 'Profile',
      children: [
        { key: 'profile-info', label: 'My info' },
        { key: 'profile-settings', label: 'Settings' },
      ],
    },
    { key: 'help', label: 'Help' },
    { key: 'logout', label: 'Log out' },
  ],
};

export default function DropdownDemo() {
  return (
    <Dropdown trigger="click" menu={menu}>
      <Button>Menu</Button>
    </Dropdown>
  );
}
