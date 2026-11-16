'use client';

import {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useControllableState,
  useEventListener,
  useMergedRef,
} from '@jbpark/use-hooks';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Typography from '../atoms/typography';

export interface Item {
  key: string;
  href: `#${string}`;
  title: string;
  children?: readonly Item[];
}

export interface Props extends Omit<
  ComponentProps<'nav'>,
  'children' | 'onChange' | 'onSelect'
> {
  items: readonly Item[];
  current?: string;
  defaultCurrent?: string;
  onChange?: (href: string) => void;
  onSelect?: (item: Item) => void;
  container?: HTMLElement | null;
  offset?: number;
  smooth?: boolean;
  updateHash?: boolean;
  sticky?: boolean;
  classNames?: { list?: string; link?: string; activeLink?: string };
}

function flatten(items: readonly Item[]): Item[] {
  return items.flatMap(item => [item, ...flatten(item.children ?? [])]);
}

function targetFor(document: Document, href: string) {
  try {
    return href.startsWith('#')
      ? document.getElementById(decodeURIComponent(href.slice(1)))
      : null;
  } catch {
    return null;
  }
}

const Anchor = ({
  items,
  current,
  defaultCurrent = '',
  onChange,
  onSelect,
  container,
  offset = 0,
  smooth = false,
  updateHash = true,
  sticky = false,
  className,
  classNames,
  dir,
  ref,
  'aria-label': ariaLabel = 'On this page',
  ...props
}: Props) => {
  const { direction } = useConfig();
  const [node, setNode] = useState<HTMLElement | null>(null);
  const mergedRef = useMergedRef(ref, setNode);
  const ownerWindow = node?.ownerDocument.defaultView ?? null;
  const containerRef = useMemo(
    () => ({ current: container ?? null }),
    [container],
  );
  const flatItems = useMemo(() => flatten(items), [items]);
  const resolvedOffset = Number.isFinite(offset) ? offset : 0;
  const [active, setActive] = useControllableState<string>({
    value: current,
    defaultValue: defaultCurrent,
    onChange,
  });
  // Compared against instead of `active`, so `update` does not change (and
  // re-run) whenever the active link does.
  const activeRef = useRef(active);
  // The link a click scrolled to. Scroll-driven updates wait until that
  // scroll ends, so a smooth scroll does not highlight the sections it passes.
  const pendingHref = useRef<string | null>(null);
  const releaseTimer = useRef<number | undefined>(undefined);

  const commitActive = useCallback(
    (next: string) => {
      if (next === activeRef.current) {
        return;
      }

      activeRef.current = next;
      setActive(next);
    },
    [setActive],
  );

  const update = useCallback(() => {
    if (!node || pendingHref.current !== null) {
      return;
    }

    const boundary = container
      ? container.getBoundingClientRect().top +
        container.clientTop +
        resolvedOffset
      : resolvedOffset;
    let next = '';
    let closest = -Infinity;

    for (const item of flatItems) {
      const target = targetFor(node.ownerDocument, item.href);

      if (!target || (container && !container.contains(target))) {
        continue;
      }

      const top = target.getBoundingClientRect().top;

      if (top <= boundary + 1 && top > closest) {
        closest = top;
        next = item.href;
      }
    }

    // At the end of the scroll range, sections below the last one that
    // reached the boundary can never reach it, so the last visible one wins.
    const scroller = container ?? node.ownerDocument.documentElement;
    const maxScroll = scroller.scrollHeight - scroller.clientHeight;

    if (maxScroll > 0 && scroller.scrollTop >= maxScroll - 1) {
      const bottom = container
        ? container.getBoundingClientRect().bottom
        : (ownerWindow?.innerHeight ?? 0);

      for (const item of flatItems) {
        const target = targetFor(node.ownerDocument, item.href);

        if (
          target &&
          (!container || container.contains(target)) &&
          target.getBoundingClientRect().top < bottom
        ) {
          next = item.href;
        }
      }
    }

    commitActive(next);
  }, [node, container, resolvedOffset, flatItems, ownerWindow, commitActive]);

  const releasePending = useCallback(() => {
    window.clearTimeout(releaseTimer.current);

    if (pendingHref.current === null) {
      return;
    }

    pendingHref.current = null;
    update();
  }, [update]);

  useEventListener('scroll', update, {
    target: containerRef,
    passive: true,
    enabled: !!container,
  });
  useEventListener('scroll', update, {
    target: ownerWindow,
    passive: true,
    enabled: !container && !!ownerWindow,
  });
  useEventListener('resize', update, {
    target: ownerWindow,
    enabled: !!ownerWindow,
  });
  // A clicked link's scroll is over when the scroller reports it, or when the
  // user takes over with the wheel, touch or keyboard.
  useEventListener('scrollend', releasePending, {
    target: containerRef,
    enabled: !!container,
  });
  useEventListener('scrollend', releasePending, {
    target: ownerWindow,
    enabled: !container && !!ownerWindow,
  });
  useEventListener('wheel', releasePending, {
    target: ownerWindow,
    passive: true,
    enabled: !!ownerWindow,
  });
  useEventListener('touchmove', releasePending, {
    target: ownerWindow,
    passive: true,
    enabled: !!ownerWindow,
  });
  useEventListener('keydown', releasePending, {
    target: ownerWindow,
    enabled: !!ownerWindow,
  });
  useEffect(() => {
    activeRef.current = active;
  });
  useEffect(update, [update]);
  useEffect(() => () => window.clearTimeout(releaseTimer.current), []);

  const renderItems = (links: readonly Item[]) => (
    <ul
      className={cn(
        'm-0 list-none space-y-1 p-0',
        classNames?.list,
        //
      )}
    >
      {links.map(item => (
        <li key={item.key} className="m-0">
          <Typography.Link
            href={item.href}
            aria-current={active === item.href ? 'location' : undefined}
            className={cn(
              'block border-s-2 border-transparent px-3 py-1 text-sm',
              active === item.href && 'border-primary font-medium text-primary',
              classNames?.link,
              active === item.href && classNames?.activeLink,
              //
            )}
            onClick={event => {
              if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
              ) {
                return;
              }

              const target = node && targetFor(node.ownerDocument, item.href);

              if (
                !target ||
                !ownerWindow ||
                (container && !container.contains(target))
              ) {
                return;
              }

              event.preventDefault();

              const behavior =
                smooth &&
                !ownerWindow.matchMedia('(prefers-reduced-motion: reduce)')
                  .matches
                  ? 'smooth'
                  : 'auto';

              // `scrollend` does not fire when nothing scrolls, and not in
              // every browser, so the wait also ends on a timer.
              pendingHref.current = item.href;
              window.clearTimeout(releaseTimer.current);
              releaseTimer.current = window.setTimeout(
                releasePending,
                behavior === 'smooth' ? 1000 : 100,
              );

              if (container) {
                container.scrollTo({
                  top:
                    container.scrollTop +
                    target.getBoundingClientRect().top -
                    container.getBoundingClientRect().top -
                    container.clientTop -
                    resolvedOffset,
                  behavior,
                });
              } else {
                ownerWindow.scrollTo({
                  top:
                    ownerWindow.scrollY +
                    target.getBoundingClientRect().top -
                    resolvedOffset,
                  behavior,
                });
              }

              if (updateHash && ownerWindow.location.hash !== item.href) {
                ownerWindow.history.pushState(null, '', item.href);
              }

              commitActive(item.href);

              onSelect?.(item);
            }}
          >
            {item.title}
          </Typography.Link>
          {item.children && item.children.length > 0 && (
            <div className="ps-3">{renderItems(item.children)}</div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <nav
      {...props}
      ref={mergedRef}
      data-slot="anchor"
      dir={dir ?? direction}
      aria-label={ariaLabel}
      className={cn(
        'min-w-0',
        sticky && 'sticky self-start',
        className,
        //
      )}
      style={{ ...(sticky ? { top: resolvedOffset } : {}), ...props.style }}
    >
      {renderItems(items)}
    </nav>
  );
};

export default Anchor;
