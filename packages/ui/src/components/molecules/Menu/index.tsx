'use client';

import { useEffect, useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Typography } from '@repo/ui';
import { cn } from '@repo/ui/utils';

export interface MenuItem {
  label: React.ReactNode;
  key: React.Key;
  type?: string;
  itemKey?: React.Key;
  keyPath?: React.Key[];
  path?: string;
  children?: MenuItem[];
}

interface Props {
  fullSize?: boolean;
  mode?: 'horizontal' | 'vertical' | 'inline';
  selectedKeys?: React.Key[];
  defaultSelectedKeys?: React.Key[];
  offset?: [number, number];
  inlineOffset?: number;
  classNames?: {
    rootItem?: string;
    subMenu?: string;
    item?: string;
    label?: string;
    // open?: string;
  };
  styles?: {
    rootItem?: React.CSSProperties;
    subMenu?: React.CSSProperties;
    item?: React.CSSProperties;
    label?: React.CSSProperties;
    // open?: React.CSSProperties;
  };
  onClick?: ClickEventHandler;
}

interface ItemProps extends Props, MenuItem {
  root?: boolean;
}
interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface MenuProps
  extends Props,
    Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  items?: MenuItem[];
}

export type ClickEventHandler = (params: {
  domEvent: React.MouseEvent;
  key: React.Key;
  keyPath: React.Key[];
  item: MenuItem;
}) => void;

const MENU_CLASSNAMES = [
  'p-0',
  'bg-white',
  'shadow-md',
  'rounded-md',
  //
];

const OPEN_CLASSNAMES = [
  'underline',
  'underline-offset-8',
  // 'bg-gray-100',
  // 'bg-inherit',
  //
];

const HOVER_CLASSNAMES = ['hover:underline', 'hover:underline-offset-8'];

const OFFSET: [number, number] = [8, 8];

const INLINE_OFFSET = 16;

export function findKey(menu: MenuItem, targetKeys: React.Key[]): boolean {
  if (targetKeys.includes(menu.key)) {
    return true;
  }

  if (menu.children && Array.isArray(menu.children)) {
    for (const child of menu.children) {
      if (findKey(child, targetKeys)) {
        return true;
      }
    }
  }

  return false;
}

const Label = ({ children, level = 4, className, ...props }: LabelProps) => {
  if (typeof children === 'string') {
    return (
      <Typography.Text level={level} className={cn(className)} {...props}>
        {children}
      </Typography.Text>
    );
  }

  return children;
};

const Item = ({
  itemKey = '',
  keyPath = [],
  root = false,
  mode,
  label,
  children,
  selectedKeys = [],
  fullSize,
  classNames,
  styles,
  offset = OFFSET,
  inlineOffset = INLINE_OFFSET,
  onClick,
  ...props
}: ItemProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const itemRef = useRef<HTMLLIElement | null>(null);

  const isHorizontal = mode === 'horizontal';
  const isInline = mode === 'inline';

  const [left, top] = offset;

  const item = {
    ...props,
    label,
    key: itemKey,
    children,
  };

  const itemClassNames = cn(
    'px-4 py-2',
    'cursor-pointer',
    'whitespace-nowrap',
    root && isHorizontal ? 'inline-flex' : 'flex',
    ...(root
      ? [
          'h-full',
          'rounded-none border-transparent',
          !!children?.length && 'hover:border-current',
          isHorizontal ? 'border-b-2' : 'border-r-2',
          isInline && 'border-none',
          classNames?.rootItem,
        ]
      : ['rounded-md', ...HOVER_CLASSNAMES, classNames?.item]),
  );

  const childrenContainerClassNames = cn(
    isInline ? 'relative overflow-hidden' : 'absolute min-w-[200px]',
    !isInline && root && isHorizontal
      ? 'left-0 top-full pt-2 pl-0'
      : !isInline
        ? 'left-full top-0 pl-2 pt-0'
        : 'pl-4',
    ...(fullSize
      ? [
          ...MENU_CLASSNAMES,
          'fixed flex justify-center items-start',
          isHorizontal ? 'inset-x-0 w-screen' : 'inset-y-0 h-screen',
        ]
      : []),
  );

  const childrenContainerStyle = fullSize
    ? isHorizontal
      ? {
          top: position.top,
          marginTop: top,
        }
      : {
          left: position.left,
          marginLeft: left,
        }
    : isInline
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

  useEffect(() => {
    if (!itemRef.current) {
      return;
    }

    const $item = itemRef.current;

    const onResize = () => {
      setPosition({
        top: $item.offsetTop + $item.offsetHeight,
        left: $item.offsetLeft + $item.offsetWidth,
      });
    };

    onResize();

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!root && fullSize) {
    return (
      <li
        className={cn(
          'basis-1/6',
          'min-w-[180px]',
          //
        )}
      >
        <div
          className={cn(
            itemClassNames,
            'justify-center',
            //
          )}
          onClick={e => {
            e.stopPropagation();
            onClick?.({
              domEvent: e,
              key: itemKey,
              keyPath,
              item,
            });
          }}
        >
          <Label className="font-semibold">{label}</Label>
        </div>
        <ul>
          {children?.map(child => (
            <li
              key={child.key}
              className={cn(
                itemClassNames,
                'justify-center',
                ...(findKey(child, selectedKeys)
                  ? [
                      ...OPEN_CLASSNAMES,
                      ...HOVER_CLASSNAMES,
                      //
                    ]
                  : []),
              )}
              onClick={e => {
                e.stopPropagation();
                onClick?.({
                  domEvent: e,
                  key: child.key,
                  keyPath: [...keyPath, child.key],
                  item: child,
                });
              }}
            >
              <Label level={5} className="text-center text-wrap">
                {child.label}
              </Label>
            </li>
          ))}
        </ul>
      </li>
    );
  }

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
          ...(findKey(item, selectedKeys)
            ? root
              ? ['border-current']
              : [
                  ...OPEN_CLASSNAMES,
                  ...HOVER_CLASSNAMES,
                  //
                ]
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

          onClick?.({
            domEvent: e,
            key: itemKey,
            keyPath,
            item,
          });
        }}
      >
        <div
          className={cn(
            'w-full',
            'inline-flex items-center justify-between',
            //
          )}
        >
          <Label
            className={cn(
              classNames?.label,
              root && classNames?.rootItem,
              ...(findKey(item, selectedKeys)
                ? root
                  ? []
                  : [
                      ...OPEN_CLASSNAMES,
                      ...HOVER_CLASSNAMES,
                      //
                    ]
                : []),
              //
            )}
            style={styles?.label}
          >
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
                fullSize
                  ? [
                      'h-auto',
                      'flex flex-nowrap gap-y-4',
                      'p-8',
                      //
                    ]
                  : MENU_CLASSNAMES,
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
                  mode={mode}
                  selectedKeys={selectedKeys}
                  fullSize={fullSize}
                  classNames={classNames}
                  styles={styles}
                  offset={offset}
                  inlineOffset={inlineOffset}
                  onClick={onClick}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

const Menu = ({
  items,
  mode = 'vertical',
  fullSize = false,
  defaultSelectedKeys: _defaultSelectedKeys = [],
  selectedKeys: _selectedKeys = [],
  className,
  classNames,
  styles,
  offset,
  inlineOffset,
  onClick = () => {},
  ...props
}: MenuProps) => {
  const [selectedKeys, setSelectedKeys] =
    useState<React.Key[]>(_defaultSelectedKeys);

  useEffect(() => {
    if (!_defaultSelectedKeys.length) {
      return;
    }
    setSelectedKeys(_defaultSelectedKeys);

    return () => setSelectedKeys([]);
  }, [_defaultSelectedKeys]);

  useEffect(() => {
    if (!_selectedKeys.length) {
      return;
    }
    setSelectedKeys(_selectedKeys);

    return () => setSelectedKeys([]);
  }, [_selectedKeys]);

  return (
    <ul
      className={cn(
        MENU_CLASSNAMES,
        mode === 'horizontal' ? 'flex' : 'inline-block',
        className,
      )}
      {...props}
    >
      {items?.map(item => (
        <Item
          root
          {...item}
          key={item.key}
          itemKey={item.key}
          keyPath={[item.key]}
          selectedKeys={selectedKeys}
          mode={mode}
          fullSize={fullSize}
          classNames={classNames}
          styles={styles}
          offset={offset}
          inlineOffset={inlineOffset}
          onClick={onClick}
        />
      ))}
    </ul>
  );
};

export default Menu;
