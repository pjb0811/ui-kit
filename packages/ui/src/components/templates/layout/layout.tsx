import { Children, createContext, isValidElement, useContext } from 'react';

import { cn } from '@repo/ui/utils';

import Sider from './sider';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {}

const LayoutNestedContext = createContext(false);

const hasSiderChild = (children: React.ReactNode) =>
  Children.toArray(children).some(
    child => isValidElement(child) && child.type === Sider,
  );

const Layout = ({ children, className, ...props }: Props) => {
  const isNested = useContext(LayoutNestedContext);
  const isRow = hasSiderChild(children);

  return (
    <LayoutNestedContext.Provider value>
      <div
        className={cn(
          'flex w-full flex-1',
          // A nested Layout (the Sider row wrapper) must stay free to
          // shrink/grow inside its parent's flex column, so it keeps
          // min-h-0. The outermost Layout has no ancestor to size against,
          // so it needs its own height anchor or flex-1/grow are no-ops
          // and Content collapses under Footer.
          isNested ? 'min-h-0' : 'min-h-screen',
          isRow ? 'flex-row' : 'flex-col',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </LayoutNestedContext.Provider>
  );
};

export default Layout;
