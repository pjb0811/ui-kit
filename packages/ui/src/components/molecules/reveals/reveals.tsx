import { Children } from 'react';

import { cn } from '@repo/ui/utils';

import Item, { type ItemProps } from './item';

export interface Props
  extends React.ComponentPropsWithoutRef<'div'>, ItemProps {
  cascade?: number;
  classNames?: {
    root?: string;
    item?: string;
  };
  once?: boolean;
  items?: ItemProps[];
}

export const DURATION = 0.6;
export const DELAY = 0;
export const CASCADE = 0.1;

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

export default Reveals;
