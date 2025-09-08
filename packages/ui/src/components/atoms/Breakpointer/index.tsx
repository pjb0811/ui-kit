'use client';

import { useElementSize } from '@repo/ui/hooks';
import { cn } from '@repo/ui/utils';

export type BreakpointInfo = ReturnType<typeof useElementSize>['breakpoint'];
type SizeInfo = ReturnType<typeof useElementSize>['size'];
type RenderInfo = { size: SizeInfo; breakpoint: BreakpointInfo };

export interface Props {
  className?: string;
  children: (info: RenderInfo) => React.ReactNode;
}

const Breakpointer = ({ className, children }: Props) => {
  const { breakpoint, size, elementRef } = useElementSize<HTMLDivElement>();

  return (
    <div
      ref={elementRef}
      className={cn(
        'h-full w-full',
        className,
        //
      )}
    >
      {children({ size, breakpoint })}
    </div>
  );
};

export default Breakpointer;
