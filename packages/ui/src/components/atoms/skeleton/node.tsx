import { cn } from '@repo/ui/utils';

import Skeleton, { type Props as SkeletonProps } from './skeleton';

const Node = ({ classNames, ...props }: SkeletonProps) => {
  return (
    <Skeleton
      {...props}
      avatar={false}
      classNames={{
        ...classNames,
        item: cn(
          'h-50 w-full min-w-80',
          'rounded-3xl',
          classNames?.item,
          //
        ),
      }}
    />
  );
};
export default Node;
