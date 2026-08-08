import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
} from 'react';

import { cn } from '@repo/ui/utils';

import Sider from './sider';
import { SiderRegistryContext } from './sider-context';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {}

const LayoutNestedContext = createContext(false);

// Effects (including the registry-based detection in sider-context.ts)
// never run during SSR, so registry state alone would render flex-col on
// the server and every first paint, then flip to flex-row after hydration
// for even the common, non-wrapped case. This direct-children check seeds
// the correct initial guess for that common case so it's right immediately;
// the registry then stays authoritative for Fragment-wrapped/custom-wrapped
// Siders it can't see, correcting the guess after mount if needed.
const hasDirectSiderChild = (children: React.ReactNode) =>
  Children.toArray(children).some(
    child => isValidElement(child) && child.type === Sider,
  );

const Layout = ({ children, className, ...props }: Props) => {
  const isNested = useContext(LayoutNestedContext);
  const [siderIds] = useState(() => new Set<object>());
  const [siderCount, setSiderCount] = useState(() =>
    hasDirectSiderChild(children) ? 1 : 0,
  );

  const registry = useMemo(
    () => ({
      registerSider: (id: object) => {
        siderIds.add(id);
        setSiderCount(siderIds.size);
      },
      unregisterSider: (id: object) => {
        siderIds.delete(id);
        setSiderCount(siderIds.size);
      },
    }),
    [siderIds],
  );

  const isRow = siderCount > 0;

  return (
    <LayoutNestedContext.Provider value>
      <SiderRegistryContext.Provider value={registry}>
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
      </SiderRegistryContext.Provider>
    </LayoutNestedContext.Provider>
  );
};

export default Layout;
