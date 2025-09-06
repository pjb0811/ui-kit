import { cn } from '@repo/ui/utils';

import Skeleton, { type Props as SkeletonProps } from '..';

const Node = ({ className, ...props }: SkeletonProps) => {
  return (
    <Skeleton
      {...props}
      avatar={false}
      className={cn(
        'h-50 w-full min-w-80',
        'rounded-3xl',
        className,
        //
      )}
    />
  );
};
export default Node;
