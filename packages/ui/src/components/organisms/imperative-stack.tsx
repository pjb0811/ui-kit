'use client';

import { useEffect, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';

import { v4 as uuid } from 'uuid';

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

  const getRootElement = (container?: HTMLElement): HTMLElement | null => {
    if (!isBrowser) {
      return null;
    }

    const targetContainer = container || document.body;
    let rootEl = rootElements.get(targetContainer);

    if (!rootEl) {
      rootEl = createRootElement();
      targetContainer.appendChild(rootEl);
      rootElements.set(targetContainer, rootEl);
    }

    return rootEl;
  };

  const StackRenderer = ({ container }: { container: HTMLElement }) => {
    const [, forceUpdate] = useState({});

    useEffect(() => {
      const state = getContainerState(container);
      state.update = () => forceUpdate({});
      return () => {
        state.update = null;
      };
    }, [container]);

    const { stack } = getContainerState(container);

    return (
      <>
        {stack.map(({ id, ...props }) => (
          <StackItem key={id} id={id} {...(props as TProps)} />
        ))}
      </>
    );
  };

  const render = (props: TProps): string | undefined => {
    if (!isBrowser) {
      return;
    }

    const targetContainer = props.container || document.body;
    const rootElement = getRootElement(targetContainer)!;

    if (!reactRoots.has(targetContainer)) {
      const root = createRoot(rootElement);
      reactRoots.set(targetContainer, root);
      root.render(<StackRenderer container={targetContainer} />);
    }

    const state = getContainerState(targetContainer);
    const id = props.id || uuid();
    state.stack.push({ ...props, id });
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
