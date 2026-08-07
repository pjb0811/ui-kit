import { Loader2 } from 'lucide-react';

import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  spinning?: boolean;
}

const Spin = ({ spinning, className, children, ...props }: Props) => {
  // With no children there's nothing to render at all while idle — unlike
  // the branch below, there's no wrapper for `className`/`props` to land
  // on regardless, so returning null here isn't the same bug.
  if (!children) {
    if (!spinning) {
      return null;
    }

    return (
      <div
        role="status"
        aria-label="로딩 중"
        className={cn('flex h-full items-center justify-center', className)}
        {...props}
      >
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // `className`/rest props always land on this one wrapper regardless of
  // `spinning`, instead of applying to the icon in one branch and being
  // dropped entirely in another.
  return (
    <div className={cn('relative', className)} {...props}>
      <div className={cn(spinning && 'pointer-events-none opacity-50')}>
        {children}
      </div>
      {spinning && (
        <div
          role="status"
          aria-label="로딩 중"
          className="absolute inset-0 flex items-center justify-center"
        >
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Spin;
