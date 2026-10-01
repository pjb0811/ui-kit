import { Breadcrumb } from '@repo/ui';

export default function BreadcrumbDemo() {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { title: 'Home', href: '#home' },
          { title: 'Components', href: '#components' },
          { title: 'Breadcrumb' },
        ]}
      />
      <Breadcrumb
        maxItems={4}
        items={[
          { title: 'Home', href: '#home' },
          { title: 'Catalog', href: '#catalog' },
          { title: 'Electronics', href: '#electronics' },
          { title: 'Audio', href: '#audio' },
          { title: 'Headphones', href: '#headphones' },
          { title: 'Details' },
        ]}
      />
    </div>
  );
}
