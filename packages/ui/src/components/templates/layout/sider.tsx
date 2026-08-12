'use client';

import { useEffect, useId, useRef } from 'react';

import { useControllableState, useResponsiveSize } from '@jbpark/use-hooks';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { useRegisterSider } from './sider-context';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Order matters here, not the values — used to compare the current
// viewport tier against the configured `breakpoint` ordinally, since
// `useResponsiveSize` reports which named tier the viewport is currently
// in rather than a raw pixel width.
const BREAKPOINT_ORDER: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export interface Props extends Omit<
  React.ComponentProps<'aside'>,
  'onCollapse'
> {
  width?: number | string;
  collapsedWidth?: number | string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  placement?: 'left' | 'right';
  reverseArrow?: boolean;
  trigger?: React.ReactNode;
  classNames?: {
    trigger?: string;
  };
  breakpoint?: Breakpoint;
  onCollapse?: (collapsed: boolean) => void;
  onBreakpoint?: (broken: boolean) => void;
}

const toCssSize = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value;

const Sider = ({
  children,
  className,
  classNames,
  style,
  width = 200,
  collapsedWidth = 80,
  collapsible = false,
  defaultCollapsed = false,
  collapsed: _collapsed,
  placement = 'left',
  reverseArrow = false,
  trigger,
  breakpoint,
  onCollapse,
  onBreakpoint,
  ...props
}: Props) => {
  useRegisterSider();

  const { locale } = useConfig();
  const contentId = useId();
  const [collapsed, setCollapsed] = useControllableState<boolean>({
    value: _collapsed,
    defaultValue: defaultCollapsed,
    onChange: onCollapse,
  });

  const { breakpoint: viewportBreakpoint } = useResponsiveSize({
    viewport: true,
  });
  const broken = breakpoint
    ? BREAKPOINT_ORDER.indexOf(viewportBreakpoint.current) <
      BREAKPOINT_ORDER.indexOf(breakpoint)
    : false;

  const latestBrokenRef = useRef(broken);
  const previousBrokenRef = useRef<boolean | null>(null);
  const microtaskScheduledRef = useRef(false);
  const onBreakpointRef = useRef(onBreakpoint);

  useEffect(() => {
    onBreakpointRef.current = onBreakpoint;
  });

  // `useResponsiveSize`'s own initial measurement resolves through its own
  // layout effect, which (since it's called earlier in this component)
  // commits and — if the real viewport differs from its SSR-safe 'xs'
  // placeholder default — triggers a synchronous corrective re-render, all
  // before the browser paints. Both the placeholder-derived render and the
  // corrected one get their own effect pass (React doesn't coalesce
  // same-tick synchronous re-commits into a single effect flush), so
  // reacting to `broken` directly — in a layout or passive effect either
  // way — fires once with the wrong placeholder value, then again with the
  // corrected one.
  //
  // Coalescing through a microtask sidesteps that: every effect pass just
  // records its `broken` into a ref and schedules (at most once) a
  // microtask that reads whatever ended up latest once the synchronous
  // cascade has fully settled, and acts on that single, correct value.
  //
  // The `previousBrokenRef` guard is the separate fix for #227 point 3:
  // without it, an inline `onCollapse`/`onBreakpoint` (a fresh identity
  // every render) would change `setCollapsed`'s own identity and re-run
  // this effect on every unrelated parent re-render, reapplying `broken`
  // and undoing a user's manual toggle. Only a genuine change should act.
  useEffect(() => {
    if (!breakpoint) {
      return;
    }

    latestBrokenRef.current = broken;

    if (microtaskScheduledRef.current) {
      return;
    }
    microtaskScheduledRef.current = true;

    queueMicrotask(() => {
      microtaskScheduledRef.current = false;

      const settledBroken = latestBrokenRef.current;

      if (previousBrokenRef.current === settledBroken) {
        return;
      }

      previousBrokenRef.current = settledBroken;
      setCollapsed(settledBroken);
      onBreakpointRef.current?.(settledBroken);
    });
  }, [broken, breakpoint, setCollapsed]);

  const onTriggerClick = () => {
    setCollapsed(!collapsed);
  };

  // A right-placed Sider's collapse icon should default to pointing the
  // opposite way from a left-placed one (it's opening/closing a panel on
  // the other side of the content), so `placement` flips the effective
  // direction on top of whatever `reverseArrow` already requests —
  // `reverseArrow` still layers on as a manual override either way.
  const effectiveReverseArrow = reverseArrow !== (placement === 'right');
  const TriggerIcon =
    collapsed !== effectiveReverseArrow ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        // Below Header's z-50 (and every other floating/overlay primitive
        // in this library, which all use z-50) — Sider is a static layout
        // column, not floating chrome, and previously outranked Header
        // with an arbitrary z-100, covering it once Header stuck to the
        // viewport top on scroll.
        'z-10 flex h-full shrink-0 flex-col overflow-hidden',
        'transition-[width] duration-200',
        // Lets a Sider visually sit on the right without needing to
        // reorder JSX/children — useful since Sider's presence is
        // detected via context (sider-context.ts) rather than requiring
        // it to be a specific direct child in a specific position.
        placement === 'right' && 'order-last',
        className,
        //
      )}
      style={{
        width: toCssSize(collapsed ? collapsedWidth : width),
        ...style,
      }}
      {...props}
    >
      <div id={contentId} className="min-h-0 flex-1 overflow-auto">
        {children}
      </div>
      {collapsible && trigger !== null && (
        <button
          type="button"
          aria-label={
            collapsed
              ? (locale.expand ?? DEFAULT_LOCALE.expand)
              : (locale.collapse ?? DEFAULT_LOCALE.collapse)
          }
          aria-expanded={!collapsed}
          aria-controls={contentId}
          onClick={onTriggerClick}
          className={cn(
            'flex w-full shrink-0 items-center justify-center py-2',
            'cursor-pointer transition-colors hover:bg-black/5',
            classNames?.trigger,
            //
          )}
        >
          {trigger === undefined ? <TriggerIcon className="size-4" /> : trigger}
        </button>
      )}
    </aside>
  );
};

export default Sider;
