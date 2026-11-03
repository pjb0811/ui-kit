'use client';

import { useRef, useState } from 'react';

import { useRovingFocus } from '@jbpark/use-hooks';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@repo/ui/utils';

import { MENU_CLASSNAMES, MenuItem, Props } from '../menu';
import Label from './label';

type FocusProps = ReturnType<ReturnType<typeof useRovingFocus>['getItemProps']>;

interface ItemProps extends Props, MenuItem {
  itemKey: React.Key;
  keyPath: React.Key[];
  root?: boolean;
  /** Roving focus props from the level this item belongs to. */
  focusProps: FocusProps;
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
  focusProps: { ref: focusRef, tabIndex, onFocus, onKeyDown: onRovingKeyDown },
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
  // Submenu items are stacked vertically in every mode.
  const { getItemProps } = useRovingFocus({ count: children?.length ?? 0 });

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

    // Next.js's types pull in React's `react/experimental` augmentation
    // (adding `useOptimistic`'s internal key symbol to `React.Key`), which
    // widens `itemKey`/`item.key` here beyond what `ClickEventHandler`
    // expects when this file is type-checked as part of a Next.js app —
    // real menu item keys are always string/number, never that symbol.
    const params = {
      domEvent,
      key: itemKey as Exclude<React.Key, symbol>,
      keyPath,
      item: item as unknown as MenuItem,
    };

    onClick?.(params);

    if (!selected) {
      onSelect?.(params);
    }
  };

  // Enter/Space select and Escape closes this item's submenu without also
  // closing an ancestor Dropdown. Other keys go to the level's roving focus:
  // arrow keys for the level's orientation (mirrored in RTL), wrapping at
  // the ends, and Home/End.
  const handleKeyDown = (domEvent: React.KeyboardEvent<HTMLElement>) => {
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

    onRovingKeyDown(domEvent);
  };

  const childrenContainerClassNames = cn(
    isInline ? 'relative overflow-hidden' : 'absolute min-w-[200px]',
    !isInline && root && isHorizontal
      ? 'top-full left-0 pt-2 pl-0'
      : !isInline
        ? 'top-0 left-full pt-0 pl-2'
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
        // `m-0` completes MENU_CLASSNAMES' list reset — see Radio.Group for
        // the host rule (`.markdown li + li`) this guards against.
        'm-0',
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
        ref={focusRef}
        role="menuitem"
        tabIndex={tabIndex}
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
        onFocus={onFocus}
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
                  focusProps={getItemProps(childIndex)}
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
