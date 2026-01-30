import { Loader2 } from 'lucide-react';

import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  spinning?: boolean;
}

const Spin = ({ spinning, className, ...props }: Props) => {
  if (spinning) {
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

  return null;
};

export default Spin;
