import { Children, isValidElement } from 'react';

import { cn } from '@repo/ui/utils';

import Content from './content';
import Footer from './footer';
import Header from './header';
import Sider from './sider';

export type { Props as ContentProps } from './content';
export type { Props as FooterProps } from './footer';
export type { Props as HeaderProps } from './header';
export type { Props as SiderProps } from './sider';

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

Layout.Content = Content;
Layout.Footer = Footer;
Layout.Header = Header;
Layout.Sider = Sider;

export default Layout;
