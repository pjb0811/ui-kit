import { cn } from '@repo/ui/utils';

import { Skeleton as Core } from '../../../core/skeleton';
import Button from './Button';
import Node from './Node';

const getValueAtIndex = <T,>(value: T | T[], index: number) => {
  return Array.isArray(value) ? (value[index] ?? value[0]) : value;
};

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  loading?: boolean;
  avatar?: boolean;
  size?: 'default' | 'small' | 'large';
  count?: number;
  gap?: number;
  direction?: 'horizontal' | 'vertical';
  width?: string | number | (string | number)[];
  height?: string | number | (string | number)[];
  classNames?: {
    wrapper?: string;
    avatar?: string;
    item?: string;
  };
}

const SIZES = {
  small: 'w-16 h-4',
  default: 'w-20 h-6',
  large: 'w-24 h-8',
};

const Skeleton = ({
  active = true,
  loading = true,
  avatar,
  size = 'default',
  direction = 'vertical',
  count = 1,
  gap = 6,
  className,
  classNames = {},
  style,
  width,
  height,
  children,
  ...props
}: Props) => {
  if (!loading) {
    return children;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        //
      )}
    >
      {avatar && (
        <Core
          className={cn(
            'h-12 w-12',
            'rounded-xl',
            !active && 'animate-none',
            classNames.avatar,
          )}
        />
      )}
      <div
        className={cn(
          'flex grow',
          direction === 'vertical' && 'flex-col',
          classNames.wrapper,
        )}
        style={{
          gap,
        }}
      >
        {Array.from({ length: count }).map((_, index) => {
          const itemWidth = getValueAtIndex(width, index);
          const itemHeight = getValueAtIndex(height, index);

          return (
            <Core
              key={index}
              className={cn(
                'rounded-md',
                !active && 'animate-none',
                SIZES[size],
                className,
                classNames.item,
                //
              )}
              style={{
                ...style,
                width: itemWidth,
                height: itemHeight,
              }}
              {...props}
            />
          );
        })}
      </div>
    </div>
  );
};

Skeleton.Button = Button;
Skeleton.Node = Node;

export { Button, Node };

export default Skeleton;
