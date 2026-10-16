'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useTimeout } from '@jbpark/use-hooks';
import {
  Check,
  Info,
  LoaderCircle,
  OctagonAlert,
  OctagonX,
  X,
} from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';
import {
  type ImperativeStack,
  createImperativeStack,
  isBrowser,
} from './imperative-stack';

type ToastStatus = 'info' | 'success' | 'error' | 'warning' | 'loading';

export type Placement =
  'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end';

export interface Props {
  status?: ToastStatus;
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
  placement?: Placement;
}

export interface GlobalConfig {
  placement?: Placement;
  duration?: number;
  // Visible toasts per stack; later toasts wait until one closes.
  maxCount?: number;
}

interface StackEntry extends StaticProps {
  revision: number;
}

type StackItemProps = StackEntry & { id: string; index: number };

const STATUS_ICONS: Record<ToastStatus, React.ReactNode> = {
  info: <Info className="text-blue-400" />,
  success: <Check className="text-green-400" />,
  error: <OctagonX className="text-red-400" />,
  warning: <OctagonAlert className="text-yellow-400" />,
  loading: <LoaderCircle className="text-muted-foreground animate-spin" />,
};

const Toast = ({
  status,
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
      data-slot="toast"
      role={status === 'error' ? 'alert' : 'status'}
      className={cn(
        `pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-start
        gap-3 rounded-lg`,
        'bg-background text-foreground border p-4 shadow-lg',
        className,
        //
      )}
    >
      {(icon || status) && (
        <div className="mt-0.5 shrink-0 [&_svg]:size-5">
          {icon || (status && STATUS_ICONS[status])}
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

const PLACEMENTS: readonly Placement[] = [
  'top-start',
  'top',
  'top-end',
  'bottom-start',
  'bottom',
  'bottom-end',
];

const EXIT_CLASSES: Record<Placement, string> = {
  'top-start': '-translate-x-2',
  top: '-translate-y-2',
  'top-end': 'translate-x-2',
  'bottom-start': '-translate-x-2',
  bottom: 'translate-y-2',
  'bottom-end': 'translate-x-2',
};

const globalConfig: GlobalConfig = {};

const StaticToast = ({
  id,
  index,
  revision,
  duration = globalConfig.duration ?? DEFAULT_DURATION,
  container,
  placement = 'bottom-end',
  onClose,
  ...props
}: StackItemProps): React.ReactPortal | null => {
  const [visible, setVisible] = useState(true);
  const isClosingRef = useRef(false);

  const maxCount = globalConfig.maxCount;
  const isQueued = maxCount !== undefined && index >= Math.max(1, maxCount);

  const close = () => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    onClose?.();
    setVisible(false);
    setTimeout(() => {
      destroy(id);
    }, 200);
  };

  const { reset, clear } = useTimeout(
    close,
    isQueued || !duration ? null : duration,
  );

  // An update restarts the visible duration.
  useEffect(() => {
    if (revision > 0) {
      reset();
    }
  }, [revision, reset]);

  if (!isBrowser || isQueued) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'transition-all duration-200',
        visible ? 'opacity-100' : cn('opacity-0', EXIT_CLASSES[placement]),
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
    stacks[placement].getRootElement(container)!,
  );
};

const createRootElement = (placement: Placement) => () => {
  const el = document.createElement('div');
  const [vertical, horizontal = 'center'] = placement.split('-');

  el.setAttribute('role', 'region');
  // Plain DOM, created outside any React tree — no Config to read a
  // locale override from until #226 gives the imperative stack a way
  // to inherit one.
  el.setAttribute('aria-label', 'Notifications');
  el.dataset.slot = 'toast-stack';
  el.dataset.placement = placement;
  el.style.zIndex = '10000';
  el.style.position = 'fixed';
  el.style.display = 'flex';
  // The oldest toast sits nearest the screen edge.
  el.style.flexDirection = vertical === 'top' ? 'column' : 'column-reverse';
  el.style.gap = '8px';
  el.style.padding = '16px';
  el.style.pointerEvents = 'none';
  el.style[vertical === 'top' ? 'top' : 'bottom'] = '0';

  if (horizontal === 'start') {
    el.style.insetInlineStart = '0';
    el.style.alignItems = 'flex-start';
  } else if (horizontal === 'end') {
    el.style.insetInlineEnd = '0';
    el.style.alignItems = 'flex-end';
  } else {
    el.style.left = '0';
    el.style.right = '0';
    el.style.alignItems = 'center';
  }

  return el;
};

const stacks = Object.fromEntries(
  PLACEMENTS.map(placement => [
    placement,
    createImperativeStack<StackEntry>({
      createRootElement: createRootElement(placement),
      StackItem: StaticToast,
    }),
  ]),
) as Record<Placement, ImperativeStack<StackEntry>>;

let revisionCounter = 0;

const show = (props: StaticProps): string | undefined => {
  if (props.id) {
    const revision = (revisionCounter += 1);

    // An update replaces the content but stays in the toast's stack and
    // container, so `placement` and `container` from the new call are ignored.
    for (const placement of PLACEMENTS) {
      if (
        stacks[placement].update(props.id, current => ({
          ...props,
          placement: current.placement,
          container: current.container,
          revision,
        }))
      ) {
        return props.id;
      }
    }
  }

  const placement = props.placement ?? globalConfig.placement ?? 'bottom-end';

  return stacks[placement].render({ ...props, placement, revision: 0 });
};

const destroy = (id?: string) => {
  for (const placement of PLACEMENTS) {
    stacks[placement].destroy(id);
  }
};

Toast.destroy = destroy;

Toast.destroyAll = () => {
  destroy();
};

// Sets defaults for toasts shown afterwards. `maxCount` also applies to
// queued toasts the next time their stack changes.
Toast.config = (config: GlobalConfig) => {
  Object.assign(globalConfig, config);
};

type TriggerOptions = Omit<StaticProps, 'status' | 'title'>;

Toast.open = (props: StaticProps) => show(props);
Toast.info = (title: React.ReactNode, props?: TriggerOptions) =>
  show({ status: 'info', title, ...props });
Toast.success = (title: React.ReactNode, props?: TriggerOptions) =>
  show({ status: 'success', title, ...props });
Toast.error = (title: React.ReactNode, props?: TriggerOptions) =>
  show({ status: 'error', title, ...props });
Toast.warning = (title: React.ReactNode, props?: TriggerOptions) =>
  show({ status: 'warning', title, ...props });
// Stays until updated or closed unless `duration` is given.
Toast.loading = (title: React.ReactNode, props?: TriggerOptions) =>
  show({ status: 'loading', title, duration: 0, ...props });

export default Toast;
export type { StaticProps as ToastOptions };
