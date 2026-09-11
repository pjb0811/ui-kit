import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../../../lib/z-layers';
import Button, { Props as ButtonProps } from '../button';

export interface Props extends ButtonProps {}

const FloatButton = ({ className, children, ...props }: Props) => {
  return (
    <Button
      className={cn(
        'fixed right-5 bottom-5 rounded-full',
        OVERLAY_LAYER,
        'h-12 w-12',
        'shadow-md',
        className,
      )}
      variant="outlined"
      {...props}
    >
      {children}
    </Button>
  );
};

export default FloatButton;
