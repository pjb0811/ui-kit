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
    // Spread first: when this button sits inside a `Popover` trigger
    // (`asChild`), Radix injects its own native `type="button"` onto us for
    // form-submit safety — that's a different `type` than Button's own
    // antd-style color/variant switch, and if it landed after these three,
    // it would silently override `type="text"` and fall through to the
    // `outlined` variant's border.
    {...props}
    type="text"
    size="small"
    shape="default"
    aria-pressed={active}
    className={cn(active && 'bg-accent', className)}
  />
);

export default ToolbarButton;
