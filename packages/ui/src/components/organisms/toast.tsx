'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Root, createRoot } from 'react-dom/client';

import { useTimeout } from '@jbpark/use-hooks';
import { Check, Info, OctagonAlert, OctagonX, X } from 'lucide-react';
import { v4 as uuid } from 'uuid';

import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';

type ToastType = 'info' | 'success' | 'error' | 'warning';

export interface Props {
  type?: ToastType;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  closable?: boolean;
  action?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

interface StaticProps extends Props {
  id?: string;
  duration?: number;
  container?: HTMLElement;
}

const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

type ContainerState = {
  stack: StaticProps[];
  update: (() => void) | null;
};

const containerStates = new Map<HTMLElement, ContainerState>();

const getContainerState = (container: HTMLElement): ContainerState => {
  let state = containerStates.get(container);

  if (!state) {
    state = { stack: [], update: null };
    containerStates.set(container, state);
  }

  return state;
};

const createToastRoot = (container?: HTMLElement) => {
  if (!isBrowser) {
    return null;
  }

  const targetContainer = container || document.body;
  let rootEl = targetContainer.querySelector(
    '#toast-root',
  ) as HTMLElement | null;

  if (!rootEl) {
    rootEl = document.createElement('div');
    rootEl.setAttribute('id', 'toast-root');
    rootEl.setAttribute('role', 'region');
    rootEl.setAttribute('aria-label', 'Notifications');
    rootEl.style.zIndex = '10000';
    rootEl.style.position = 'fixed';
    rootEl.style.right = '0';
    rootEl.style.bottom = '0';
    rootEl.style.display = 'flex';
    rootEl.style.flexDirection = 'column-reverse';
    rootEl.style.gap = '8px';
    rootEl.style.padding = '16px';
    rootEl.style.pointerEvents = 'none';
    targetContainer.appendChild(rootEl);
  }

  return rootEl;
};

const TYPE_ICONS: Record<ToastType, React.ReactNode> = {
  info: <Info className="text-blue-400" />,
  success: <Check className="text-green-400" />,
  error: <OctagonX className="text-red-400" />,
  warning: <OctagonAlert className="text-yellow-400" />,
};

const Toast = ({
  type,
  title,
  description,
  icon,
  closable = true,
  action,
  className,
  onClose,
}: Props) => {
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-80 items-start gap-3 rounded-lg',
        'bg-background text-foreground border p-4 shadow-lg',
        className,
        //
      )}
    >
      {(icon || type) && (
        <div className="mt-0.5 shrink-0 [&_svg]:size-5">
          {icon || (type && TYPE_ICONS[type])}
        </div>
      )}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
        {action && <div className="pt-1">{action}</div>}
      </div>
      {closable && (
        <Button
          type="text"
          shape="circle"
          size="small"
          aria-label="Close"
          icon={<X />}
          onClick={onClose}
        />
      )}
    </div>
  );
};

const DEFAULT_DURATION = 4000;

const StaticToast = ({
  id,
  duration = DEFAULT_DURATION,
  container,
  onClose,
  ...props
}: StaticProps) => {
  const [visible, setVisible] = useState(true);

  const close = () => {
    onClose?.();
    setVisible(false);
    setTimeout(() => {
      Toast.destroy(id);
    }, 200);
  };

  useTimeout(close, duration || null);

  if (!isBrowser) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'transition-all duration-200',
        visible ? 'opacity-100' : 'translate-x-2 opacity-0',
      )}
    >
      <Toast {...props} onClose={close} />
    </div>,
    createToastRoot(container)!,
  );
};

const ToastStackRenderer = ({ container }: { container: HTMLElement }) => {
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
        <StaticToast key={id} id={id} {...props} />
      ))}
    </>
  );
};

const toastRoots = new Map<HTMLElement, Root>();

const renderToast = (props: StaticProps) => {
  if (!isBrowser) {
    return;
  }

  const targetContainer = props.container || document.body;
  const rootElement = createToastRoot(targetContainer)!;

  if (!toastRoots.has(targetContainer)) {
    const root = createRoot(rootElement);
    toastRoots.set(targetContainer, root);
    root.render(<ToastStackRenderer container={targetContainer} />);
  }

  const state = getContainerState(targetContainer);
  const id = props.id || uuid();
  state.stack.push({ ...props, id });
  state.update?.();

  return id;
};

Toast.destroy = (id?: string) => {
  if (!id) {
    containerStates.forEach(state => {
      state.stack = [];
      state.update?.();
    });
    toastRoots.forEach(root => root.unmount());
    toastRoots.clear();
    containerStates.clear();
    return;
  }

  containerStates.forEach((state, container) => {
    if (!state.stack.some(toast => toast.id === id)) {
      return;
    }

    state.stack = state.stack.filter(toast => toast.id !== id);
    state.update?.();

    if (!state.stack.length) {
      toastRoots.get(container)?.unmount();
      toastRoots.delete(container);
      containerStates.delete(container);
    }
  });
};

Toast.destroyAll = () => {
  Toast.destroy();
};

type TriggerOptions = Omit<StaticProps, 'type' | 'title'>;

Toast.info = (title: React.ReactNode, props?: TriggerOptions) =>
  renderToast({ type: 'info', title, ...props });
Toast.success = (title: React.ReactNode, props?: TriggerOptions) =>
  renderToast({ type: 'success', title, ...props });
Toast.error = (title: React.ReactNode, props?: TriggerOptions) =>
  renderToast({ type: 'error', title, ...props });
Toast.warning = (title: React.ReactNode, props?: TriggerOptions) =>
  renderToast({ type: 'warning', title, ...props });

export default Toast;
export type { StaticProps as ToastOptions };
