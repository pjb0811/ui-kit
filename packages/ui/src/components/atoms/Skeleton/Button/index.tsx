import { cn } from '@repo/ui/utils';

import Skeleton, { type Props as SkeletonProps } from '..';

const Button = ({ className, ...props }: SkeletonProps) => {
  return (
    <Skeleton
      className={cn(
        'h-10 w-16',
        'rounded-2xl',
        className,
        //
      )}
      {...props}
    />
  );
};
export default Button;
