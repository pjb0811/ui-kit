import { useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@repo/ui/utils';

import { MENU_CLASSNAMES, MenuItem, Props } from '..';
import Label from './Label';

interface ItemProps extends Props, MenuItem {
  itemKey: React.Key;
  keyPath: React.Key[];
  root?: boolean;
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
  mode,
  label,
  children,
  selectedKeys = [],
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

  const isItemSelected = selectionMap?.get(itemKey) ?? false;

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
    >
      <div
        className={cn(
          itemClassNames,
          ...(isItemSelected
            ? root
              ? ['border-current']
              : [...STYLES.open.classes, ...STYLES.hover.classes]
            : root && !!children?.length
              ? ['group-hover:border-current']
              : []),
          //
        )}
        style={root ? styles?.rootItem : styles?.item}
        onClick={e => {
          e.stopPropagation();

          if (isInline) {
            setOpen(!open);
          }

          const params = {
            domEvent: e,
            key: itemKey,
            keyPath,
            item,
          };

          onClick?.(params);

          if (!isItemSelected) {
            onSelect?.(params);
          }
        }}
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
              className={cn(
                MENU_CLASSNAMES,
                isInline && 'shadow-none',
                classNames?.subMenu,
                //
              )}
              style={styles?.subMenu}
            >
              {children.map(child => (
                <Item
                  {...child}
                  key={child.key}
                  itemKey={child.key}
                  keyPath={[...keyPath, child.key]}
                  selectionMap={selectionMap}
                  mode={mode}
                  selectedKeys={selectedKeys}
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
