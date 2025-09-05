import { cn } from '@repo/ui/utils';

import Skeleton, { type Props as SkeletonProps } from '..';

const Node = ({ className, ...props }: SkeletonProps) => {
  return (
    <Skeleton
      className={cn(
        'h-50 w-full',
        'rounded-3xl',
        className,
        //
      )}
      {...props}
    />
  );
};
export default Node;
