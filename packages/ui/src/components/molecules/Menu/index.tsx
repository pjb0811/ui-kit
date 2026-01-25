'use client';

import { useMemo, useState } from 'react';

import { cn } from '@repo/ui/utils';

import Item from './Item';

export interface MenuItem {
  label: React.ReactNode;
  key: React.Key;
  type?: string;
  path?: string;
  children?: MenuItem[];
}

export interface Props {
  mode?: 'horizontal' | 'vertical' | 'inline';
  selectedKeys?: React.Key[];
  defaultSelectedKeys?: React.Key[];
  selectionMap?: SelectionMap;
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
  onSelect?: ClickEventHandler;
}

export interface MenuProps
  extends
    Props,
    Omit<React.HTMLAttributes<HTMLElement>, 'onClick' | 'onSelect'> {
  items?: MenuItem[];
}

export type ClickEventHandler = (params: {
  domEvent: React.MouseEvent;
  key: React.Key;
  keyPath: React.Key[];
  item: MenuItem;
}) => void;

export const MENU_CLASSNAMES = [
  'p-0',
  'bg-white',
  'shadow-md',
  'rounded-md',
  //
];

export type SelectionMap = ReadonlyMap<React.Key, boolean>;

export function buildSelectionMap(
  items: MenuItem[],
  selectedKeysSet: ReadonlySet<React.Key>,
): SelectionMap {
  const map = new Map<React.Key, boolean>();

  const dfs = (node: MenuItem): boolean => {
    const self = selectedKeysSet.has(node.key);
    const hasSelectedChild = node.children?.some(child => dfs(child)) ?? false;
    const isSelected = self || hasSelectedChild;
    map.set(node.key, isSelected);
    return isSelected;
  };

  items.forEach(dfs);
  return map;
}

export function findKey(
  menu: MenuItem,
  targetKeys: ReadonlySet<React.Key>,
): boolean {
  if (targetKeys.has(menu.key)) {
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

const Menu = ({
  items,
  mode = 'vertical',
  defaultSelectedKeys = [],
  selectedKeys: _selectedKeys,
  className,
  classNames,
  styles,
  offset,
  inlineOffset,
  onClick,
  onSelect: _onSelect,
  ...props
}: MenuProps) => {
  const isControlled = _selectedKeys !== undefined;
  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = useState<
    React.Key[]
  >(defaultSelectedKeys ?? []);

  const selectedKeys = isControlled
    ? (_selectedKeys as React.Key[])
    : uncontrolledSelectedKeys;

  const selectedKeysSet = useMemo(
    () => new Set<React.Key>(selectedKeys ?? []),
    [selectedKeys],
  );

  const selectionMap = useMemo(
    () => buildSelectionMap(items ?? [], selectedKeysSet),
    [items, selectedKeysSet],
  );

  const onSelect = (params: {
    domEvent: React.MouseEvent;
    key: React.Key;
    keyPath: React.Key[];
    item: MenuItem;
  }) => {
    if (!isControlled) {
      setUncontrolledSelectedKeys([params.key]);
    }
    _onSelect?.(params);
  };

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
  );
};

export default Menu;
