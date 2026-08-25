import { Menu } from '@repo/ui';

const items = [
  { key: 'home', label: 'Home' },
  {
    key: 'products',
    label: 'Products',
    children: [
      { key: 'products-web', label: 'Web' },
      { key: 'products-mobile', label: 'Mobile' },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    children: [
      { key: 'services-design', label: 'Design' },
      { key: 'services-dev', label: 'Development' },
    ],
  },
  { key: 'contact', label: 'Contact' },
];

export default function MenuDemo() {
  return (
    <Menu
      mode="inline"
      items={items}
      defaultSelectedKeys={['home']}
      className="w-56"
    />
  );
}
