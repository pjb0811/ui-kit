import { Loader2 } from 'lucide-react';

import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  spinning?: boolean;
}

const Spin = ({ spinning, className, children, ...props }: Props) => {
  if (!spinning) {
    return children ?? null;
  }

  if (!children) {
    return (
      <div
        className={cn(
          'flex h-full items-center justify-center',
          //
        )}
        {...props}
      >
        <Loader2
          className={cn(
            'animate-spin',
            className,
            //
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative',
        className,
        //
      )}
      {...props}
    >
      <div className="pointer-events-none opacity-50">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
};

export default Spin;
