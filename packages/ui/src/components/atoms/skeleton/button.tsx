import { cn } from '@repo/ui/utils';

import Skeleton, { type Props as SkeletonProps } from './skeleton';

const Button = ({ className, ...props }: SkeletonProps) => {
  return (
    <Skeleton
      {...props}
      className={cn(
        'h-9 w-15',
        'rounded-2xl',
        className,
        //
      )}
    />
  );
};
export default Button;
