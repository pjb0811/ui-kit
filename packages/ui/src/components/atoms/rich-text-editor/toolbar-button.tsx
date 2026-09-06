import { cn } from '@repo/ui/utils';

import Button, { type Props as ButtonProps } from '../button';

export interface ToolbarButtonProps extends Omit<
  ButtonProps,
  'type' | 'shape' | 'size'
> {
  active?: boolean;
}

const ToolbarButton = ({ active, className, ...props }: ToolbarButtonProps) => (
  <Button
    type="text"
    size="small"
    shape="default"
    aria-pressed={active}
    className={cn(active && 'bg-accent', className)}
    {...props}
  />
);

export default ToolbarButton;
