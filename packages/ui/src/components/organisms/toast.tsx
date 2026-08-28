'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

import { useTimeout } from '@jbpark/use-hooks';
import { Check, Info, OctagonAlert, OctagonX, X } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';
import {
  type ImperativeStack,
  createImperativeStack,
  isBrowser,
} from './imperative-stack';

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
  const { locale } = useConfig();

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
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
          variant="text"
          shape="circle"
          size="small"
          aria-label={locale.close ?? DEFAULT_LOCALE.close}
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
}: StaticProps & { id: string }): React.ReactPortal | null => {
  const [visible, setVisible] = useState(true);

  const close = () => {
    onClose?.();
    setVisible(false);
    setTimeout(() => {
      toastStack.destroy(id);
    }, 200);
  };

  const { reset, clear } = useTimeout(close, duration || null);

  if (!isBrowser) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'transition-all duration-200',
        visible ? 'opacity-100' : 'translate-x-2 opacity-0',
      )}
      // Without this, a toast with a closable/action button (or one the
      // user is mid-read on) could auto-dismiss itself out from under
      // them — hovering or focusing anything inside pauses the timer,
      // moving away restarts it from the full duration.
      onMouseEnter={clear}
      onMouseLeave={reset}
      onFocus={clear}
      onBlur={reset}
    >
      <Toast {...props} onClose={close} />
    </div>,
    toastStack.getRootElement(container)!,
  );
};

const toastStack: ImperativeStack<StaticProps> =
  createImperativeStack<StaticProps>({
    createRootElement: () => {
      const el = document.createElement('div');
      el.setAttribute('role', 'region');
      // Plain DOM, created outside any React tree — no Config to read a
      // locale override from until #226 gives the imperative stack a way
      // to inherit one.
      el.setAttribute('aria-label', 'Notifications');
      el.style.zIndex = '10000';
      el.style.position = 'fixed';
      el.style.right = '0';
      el.style.bottom = '0';
      el.style.display = 'flex';
      el.style.flexDirection = 'column-reverse';
      el.style.gap = '8px';
      el.style.padding = '16px';
      el.style.pointerEvents = 'none';
      return el;
    },
    StackItem: StaticToast,
  });

Toast.destroy = toastStack.destroy;

Toast.destroyAll = () => {
  toastStack.destroy();
};

type TriggerOptions = Omit<StaticProps, 'type' | 'title'>;

Toast.info = (title: React.ReactNode, props?: TriggerOptions) =>
  toastStack.render({ type: 'info', title, ...props });
Toast.success = (title: React.ReactNode, props?: TriggerOptions) =>
  toastStack.render({ type: 'success', title, ...props });
Toast.error = (title: React.ReactNode, props?: TriggerOptions) =>
  toastStack.render({ type: 'error', title, ...props });
Toast.warning = (title: React.ReactNode, props?: TriggerOptions) =>
  toastStack.render({ type: 'warning', title, ...props });

export default Toast;
export type { StaticProps as ToastOptions };
