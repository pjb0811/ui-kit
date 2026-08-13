'use client';

import { useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@repo/ui/utils';

import { MENU_CLASSNAMES, MenuItem, Props } from '../menu';
import Label from './label';

interface ItemProps extends Props, MenuItem {
  itemKey: React.Key;
  keyPath: React.Key[];
  root?: boolean;
  index: number;
}
const OFFSET: [number, number] = [8, 8];
const INLINE_OFFSET = 16;

const STYLES = {
  hover: {
    classes: ['hover:underline', 'hover:underline-offset-8'],
  },
  open: {
    classes: ['underline', 'underline-offset-8'],
  },
} as const;

const getItemClasses = (
  root: boolean,
  isHorizontal: boolean,
  isInline: boolean,
  hasChildren: boolean,
  customClasses?: string,
) =>
  cn(
    'px-4 py-2',
    'cursor-pointer',
    'whitespace-nowrap',
    root && isHorizontal ? 'inline-flex' : 'flex',
    ...(root
      ? [
          'h-full',
          'rounded-none border-transparent',
          hasChildren && 'hover:border-current',
          isHorizontal ? 'border-b-2' : 'border-r-2',
          isInline && 'border-none',
        ]
      : ['rounded-md', ...STYLES.hover.classes]),
    customClasses,
  );

const Item = ({
  itemKey,
  keyPath,
  root = false,
  index,
  mode,
  label,
  children,
  selectionMap,
  classNames,
  styles,
  offset = OFFSET,
  inlineOffset = INLINE_OFFSET,
  onClick,
  onSelect,
  ...props
}: ItemProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const itemRef = useRef<HTMLLIElement | null>(null);

  const isHorizontal = mode === 'horizontal';
  const isInline = mode === 'inline';

  const [left, top] = offset;

  const selected = selectionMap?.get(itemKey) ?? false;

  const item = {
    ...props,
    label,
    key: itemKey,
    children,
  };

  const itemClassNames = getItemClasses(
    root,
    isHorizontal,
    isInline,
    !!children?.length,
    root ? classNames?.rootItem : classNames?.item,
  );

  const handleSelect = (domEvent: React.SyntheticEvent) => {
    domEvent.stopPropagation();

    if (isInline) {
      setOpen(!open);
    }

    const params = {
      domEvent,
      key: itemKey,
      keyPath,
      item,
    };

    onClick?.(params);

    if (!selected) {
      onSelect?.(params);
    }
  };

  // Roving tabindex (WAI-ARIA menu pattern): only the first item in each
  // menu/submenu level is a Tab stop (below); arrow keys move real DOM
  // focus between sibling <li>s within that same level, which is what
  // ends up mattering for actual keyboard use even though — unlike a
  // fully state-tracked implementation — focus resets to the first item
  // if the user Tabs out and back in rather than resuming where they left
  // off.
  //
  // Deliberately not `useKeyPress` (unlike dropdown.tsx's trigger and
  // radio.tsx/checkbox.tsx's icon mode, #229's action item 5): that hook
  // is a static combo -> handler binding, one listener per combo. This
  // handler is a single stateful branch — Enter/Space select, Escape
  // conditionally closes a submenu and stops the event from also closing
  // an ancestor Dropdown, and the arrow-key branch reads `itemRef` at
  // fire time to focus a *sibling* `<li>`. Splitting that into 3-4
  // separate useKeyPress calls (each its own listener) per menu item
  // wouldn't fix a bug — the existing logic is already correct — it would
  // just multiply listeners across every item in a menu for no benefit.
  const handleKeyDown = (domEvent: React.KeyboardEvent) => {
    if (domEvent.key === 'Enter' || domEvent.key === ' ') {
      domEvent.preventDefault();
      handleSelect(domEvent);
      return;
    }

    if (domEvent.key === 'Escape') {
      if (children?.length && open) {
        domEvent.stopPropagation();
        setOpen(false);
      }
      return;
    }

    const isNext = isHorizontal
      ? domEvent.key === 'ArrowRight'
      : domEvent.key === 'ArrowDown';
    const isPrev = isHorizontal
      ? domEvent.key === 'ArrowLeft'
      : domEvent.key === 'ArrowUp';

    if (!isNext && !isPrev) {
      return;
    }

    domEvent.preventDefault();
    const sibling = isNext
      ? itemRef.current?.nextElementSibling
      : itemRef.current?.previousElementSibling;
    sibling?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  };

  const childrenContainerClassNames = cn(
    isInline ? 'relative overflow-hidden' : 'absolute min-w-[200px]',
    !isInline && root && isHorizontal
      ? 'left-0 top-full pt-2 pl-0'
      : !isInline
        ? 'left-full top-0 pl-2 pt-0'
        : 'pl-4',
  );

  const childrenContainerStyle = isInline
    ? {
        paddingLeft: inlineOffset,
      }
    : root && isHorizontal
      ? {
          paddingTop: top,
        }
      : {
          paddingLeft: left,
        };

  return (
    <li
      ref={itemRef}
      role="none"
      className={cn(
        'group',
        'relative',
        root && isHorizontal ? 'inline-block' : 'block',
      )}
      onMouseEnter={() => {
        if (isInline) {
          return;
        }
        setOpen(true);
      }}
      onMouseLeave={() => {
        if (isInline) {
          return;
        }
        setOpen(false);
      }}
      onFocus={() => {
        if (isInline) {
          return;
        }
        setOpen(true);
      }}
      onBlur={e => {
        if (isInline) {
          return;
        }
        if (!itemRef.current?.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <div
        role="menuitem"
        tabIndex={index === 0 ? 0 : -1}
        aria-expanded={children?.length ? open : undefined}
        aria-haspopup={children?.length ? 'menu' : undefined}
        aria-current={selected ? true : undefined}
        className={cn(
          itemClassNames,
          ...(selected
            ? root
              ? ['border-current']
              : [...STYLES.open.classes, ...STYLES.hover.classes]
            : root && !!children?.length
              ? ['group-hover:border-current']
              : []),
          //
        )}
        style={root ? styles?.rootItem : styles?.item}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
      >
        <div
          className={cn(
            'w-full',
            'inline-flex items-center justify-between',
            //
          )}
        >
          <Label className={cn(classNames?.label)} style={styles?.label}>
            {label}
          </Label>
          {!root && !isInline && !!children?.length && (
            <ChevronDown className={cn('-rotate-90')} />
          )}
          {isInline && !!children?.length && (
            <ChevronDown
              className={cn(
                'transition-all',
                open ? '-rotate-180' : 'rotate-0',
              )}
            />
          )}
        </div>
      </div>
      <AnimatePresence>
        {!!children?.length && open && (
          <motion.div
            className={cn(
              childrenContainerClassNames,
              //
            )}
            style={childrenContainerStyle}
            initial={isInline ? { height: 0, opacity: 0 } : { opacity: 0 }}
            animate={isInline ? { height: 'auto', opacity: 1 } : { opacity: 1 }}
            exit={isInline ? { height: 0, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul
              role="menu"
              className={cn(
                MENU_CLASSNAMES,
                isInline && 'shadow-none',
                classNames?.subMenu,
                //
              )}
              style={styles?.subMenu}
            >
              {children.map((child, childIndex) => (
                <Item
                  {...child}
                  key={child.key}
                  itemKey={child.key}
                  keyPath={[...keyPath, child.key]}
                  index={childIndex}
                  selectionMap={selectionMap}
                  mode={mode}
                  classNames={classNames}
                  styles={styles}
                  offset={offset}
                  inlineOffset={inlineOffset}
                  onClick={onClick}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default Item;
