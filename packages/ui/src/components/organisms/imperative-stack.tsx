'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { Root, createRoot } from 'react-dom/client';

import { ConfigSnapshotProvider, getRootConfigValue } from '@repo/ui/providers';

// Monotonic per-session counter for stack item ids. These ids are internal
// handles (React keys + destroy(id) lookups), not cryptographic, so a plain
// counter is enough and avoids a runtime `uuid` dependency.
let idCounter = 0;
const nextId = () => `stack-${(idCounter += 1)}`;

// Shared machinery behind Modal.info/success/error/warning/confirm and
// Toast.info/success/error/warning — both used to independently
// reimplement ~120 near-identical lines of this (container-scoped stack,
// a React root per container, imperative render/destroy). The only parts
// that actually differ between the two are the DOM node their stack
// mounts into (position/ARIA) and which component renders each stack
// entry — everything else here is generic over that.

export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

type ContainerState<TProps> = {
  stack: (TProps & { id: string })[];
  update: (() => void) | null;
};

export interface ImperativeStack<
  TProps extends { id?: string; container?: HTMLElement },
> {
  render: (props: TProps) => string | undefined;
  destroy: (id?: string) => void;
  getRootElement: (container?: HTMLElement) => HTMLElement | null;
}

export interface ImperativeStackOptions<
  TProps extends { id?: string; container?: HTMLElement },
> {
  /** Creates the DOM node this stack's React root mounts into — not yet
   * attached to the document; the factory appends it to the target
   * container itself. Called once per distinct container. */
  createRootElement: () => HTMLElement;
  /** Renders one stack entry — typically each caller's "Static<Thing>"
   * component, which owns its own createPortal(..., getRootElement()). */
  StackItem: React.ComponentType<TProps & { id: string }>;
}

export function createImperativeStack<
  TProps extends { id?: string; container?: HTMLElement },
>({
  createRootElement,
  StackItem,
}: ImperativeStackOptions<TProps>): ImperativeStack<TProps> {
  const containerStates = new Map<HTMLElement, ContainerState<TProps>>();
  const rootElements = new WeakMap<HTMLElement, HTMLElement>();
  const reactRoots = new Map<HTMLElement, Root>();

  const getContainerState = (
    container: HTMLElement,
  ): ContainerState<TProps> => {
    let state = containerStates.get(container);

    if (!state) {
      state = { stack: [], update: null };
      containerStates.set(container, state);
    }

    return state;
  };

  // Shared by `render` and `getRootElement` so both agree on the same
  // target container whenever the caller doesn't pass one explicitly — the
  // stack's React root (created once, in `render`) and the DOM node a
  // `StackItem` (e.g. StaticToast) later portals into (calling
  // `getRootElement` again with the same, possibly-undefined `container`)
  // would otherwise resolve two different containers here, splitting the
  // React tree (correctly under the root Config, via ConfigSnapshotProvider
  // above) from the actual visible DOM (silently back under `document.body`,
  // outside the Config's themed wrapper — undoing this fix's whole point).
  const resolveContainer = (container?: HTMLElement): HTMLElement =>
    container || getRootConfigValue()?.getContainer() || document.body;

  const getRootElement = (container?: HTMLElement): HTMLElement | null => {
    if (!isBrowser) {
      return null;
    }

    const targetContainer = resolveContainer(container);
    let rootEl = rootElements.get(targetContainer);

    if (!rootEl) {
      rootEl = createRootElement();
      targetContainer.appendChild(rootEl);
      rootElements.set(targetContainer, rootEl);
    }

    return rootEl;
  };

  const StackRenderer = ({ container }: { container: HTMLElement }) => {
    const subscribe = useCallback(
      (onStoreChange: () => void) => {
        const state = getContainerState(container);
        state.update = onStoreChange;
        return () => {
          state.update = null;
        };
      },
      [container],
    );

    const getSnapshot = useCallback(
      () => getContainerState(container).stack,
      [container],
    );

    const stack = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    return (
      <ConfigSnapshotProvider>
        {stack.map(({ id, ...props }) => (
          <StackItem key={id} id={id} {...(props as TProps)} />
        ))}
      </ConfigSnapshotProvider>
    );
  };

  const render = (props: TProps): string | undefined => {
    if (!isBrowser) {
      return;
    }

    // An explicit `container` prop always wins (it may be chosen for
    // layout reasons unrelated to theming); otherwise mount into the root
    // Config's own themed wrapper element (if one renders — see
    // `needsWrapper` in config.tsx) so CSS custom properties and the
    // `.dark` class cascade to this stack via normal DOM inheritance, not
    // just `document.body` sitting as an unthemed sibling of it.
    const targetContainer = resolveContainer(props.container);
    const rootElement = getRootElement(targetContainer)!;

    if (!reactRoots.has(targetContainer)) {
      const root = createRoot(rootElement);
      reactRoots.set(targetContainer, root);
      root.render(<StackRenderer container={targetContainer} />);
    }

    const state = getContainerState(targetContainer);
    const id = props.id || nextId();
    state.stack = [...state.stack, { ...props, id }];
    state.update?.();

    return id;
  };

  const destroy = (id?: string) => {
    if (!id) {
      containerStates.forEach(state => {
        state.stack = [];
        state.update?.();
      });
      reactRoots.forEach((root, container) => {
        root.unmount();
        rootElements.get(container)?.remove();
        rootElements.delete(container);
      });
      reactRoots.clear();
      containerStates.clear();
      return;
    }

    containerStates.forEach((state, container) => {
      if (!state.stack.some(item => item.id === id)) {
        return;
      }

      state.stack = state.stack.filter(item => item.id !== id);
      state.update?.();

      if (!state.stack.length) {
        reactRoots.get(container)?.unmount();
        reactRoots.delete(container);
        containerStates.delete(container);
        rootElements.get(container)?.remove();
        rootElements.delete(container);
      }
    });
  };

  return { render, destroy, getRootElement };
}
