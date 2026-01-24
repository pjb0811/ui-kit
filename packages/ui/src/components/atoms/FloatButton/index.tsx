import { cn } from '@repo/ui/utils';

import Button, { Props as ButtonProps } from '../Button';
import BackTop from './BackTop';

export interface Props extends ButtonProps {}

const FloatButton = ({ className, children, ...props }: Props) => {
  return (
    <Button
      className={cn(
        'fixed right-5 bottom-5 rounded-full',
        'bg-white hover:bg-white',
        'z-50 h-12 w-12',
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

FloatButton.BackTop = BackTop;

export default FloatButton;
