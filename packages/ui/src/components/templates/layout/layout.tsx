import { Children, isValidElement } from 'react';

import { cn } from '@repo/ui/utils';

import Sider from './sider';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {}

const hasSiderChild = (children: React.ReactNode) =>
  Children.toArray(children).some(
    child => isValidElement(child) && child.type === Sider,
  );

const Layout = ({ children, className, ...props }: Props) => {
  const isRow = hasSiderChild(children);

  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-1',
        isRow ? 'flex-row' : 'flex-col',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Layout;
