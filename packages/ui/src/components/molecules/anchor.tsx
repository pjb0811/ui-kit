'use client';

import {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
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

  const update = useCallback(() => {
    if (!node) {
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

    if (next !== active) {
      setActive(next);
    }
  }, [node, container, resolvedOffset, flatItems, active, setActive]);

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
  useEffect(update, [update]);

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

              if (active !== item.href) {
                setActive(item.href);
              }

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
