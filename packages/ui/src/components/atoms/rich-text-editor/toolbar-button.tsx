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
    // Spread first so composition props cannot override Button's antd-style
    // color/variant switch below.
    {...props}
    type="text"
    size="small"
    shape="default"
    aria-pressed={active}
    className={cn(active && 'bg-accent', className)}
  />
);

export default ToolbarButton;
