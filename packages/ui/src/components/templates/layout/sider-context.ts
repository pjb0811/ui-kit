import { createContext, useContext, useLayoutEffect, useRef } from 'react';

// `Layout` needs to know whether a `Sider` exists anywhere in its subtree
// to decide flex-row vs flex-col — but `Children.toArray(children).some(...)`
// only ever sees direct children, and doesn't flatten Fragments, so a
// `Sider` wrapped in a Fragment (or a custom wrapper component) went
// undetected. Registering presence via context instead survives any
// amount of wrapping, since it's `Sider` itself reporting in, not `Layout`
// inspecting its children's shape.
export interface SiderRegistry {
  registerSider: (id: object) => void;
  unregisterSider: (id: object) => void;
}

export const SiderRegistryContext = createContext<SiderRegistry | null>(null);

export const useRegisterSider = () => {
  const registry = useContext(SiderRegistryContext);
  const idRef = useRef({});

  // `useLayoutEffect` (not `useEffect`) so the registration — and the
  // resulting flex-row switch on `Layout` — commits before the browser
  // paints, avoiding a flash of the flex-col fallback layout on mount.
  useLayoutEffect(() => {
    if (!registry) {
      return;
    }

    const id = idRef.current;
    registry.registerSider(id);

    return () => {
      registry.unregisterSider(id);
    };
  }, [registry]);
};
