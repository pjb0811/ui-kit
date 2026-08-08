import { cn } from '@repo/ui/utils';

import Skeleton, { type Props as SkeletonProps } from './skeleton';

const Button = ({ classNames, ...props }: SkeletonProps) => {
  return (
    <Skeleton
      {...props}
      classNames={{
        ...classNames,
        item: cn(
          'h-9 w-15',
          'rounded-2xl',
          classNames?.item,
          //
        ),
      }}
    />
  );
};
export default Button;
