import { resizable } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { ResizablePanel } = resizable;

export interface Props extends React.ComponentProps<typeof ResizablePanel> {
  children: React.ReactNode;
}

const Panel = ({ children, className, ...props }: Props) => {
  return (
    <ResizablePanel
      className={cn('min-h-0 min-w-0 overflow-auto', className)}
      {...props}
    >
      {children}
    </ResizablePanel>
  );
};

export default Panel;
