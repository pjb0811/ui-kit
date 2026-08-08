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

  // Idle: return children as-is rather than inserting a wrapper div, same
  // policy Skeleton follows and for the same reason — a wrapper here could
  // produce invalid markup (e.g. inside a <tr>/<li>) or break flex/grid
  // child layout. className/props only ever describe the spinning overlay
  // below, so there's nothing for them to apply to while idle.
  if (!spinning) {
    return children;
  }

  return (
    <div className={cn('relative', className)} {...props}>
      <div className="pointer-events-none opacity-50">{children}</div>
      <div
        role="status"
        aria-label="로딩 중"
        className="absolute inset-0 flex items-center justify-center"
      >
        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
};

export default Spin;
