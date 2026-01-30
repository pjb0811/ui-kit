import { Children } from 'react';

import { cn } from '@repo/ui/utils';

import Item, { type ItemProps } from './Item';

interface Props extends React.ComponentPropsWithoutRef<'div'>, ItemProps {
  cascade?: number;
  classNames?: {
    root?: string;
    item?: string;
  };
  once?: boolean;
  items?: ItemProps[];
}

const DURATION = 0.6;
const DELAY = 0;
const CASCADE = 0.1;

const Reveals = ({
  children,
  className,
  classNames,
  items = [],
  cascade = CASCADE,
  duration = DURATION,
  delay = DELAY,
  ...props
}: Props) => {
  const renderItems = (items: ItemProps[]) =>
    items.map((item, index) => (
      <Item
        key={index}
        duration={duration}
        delay={delay + cascade * index}
        className={cn(
          item.className,
          classNames?.item,
          //
        )}
        {...props}
        {...item}
        //
      >
        {item.children}
      </Item>
    ));

  return (
    <div
      className={cn(
        'flex gap-5',
        className,
        classNames?.root,
        //
      )}
      {...props}
    >
      {renderItems(
        children
          ? Children.toArray(children).map(child => ({
              children: child,
            }))
          : items,
      )}
    </div>
  );
};

Reveals.Item = Item;

export {
  Item,
  type ItemProps,
  type Props as RevealsProps,
  DURATION,
  DELAY,
  CASCADE,
};

export default Reveals;
