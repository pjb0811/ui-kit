import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../../../lib/z-layers';

export interface Props extends React.ComponentProps<'header'> {
  position?: 'sticky' | 'static' | 'fixed';
}

const Header = ({
  children,
  className,
  position = 'sticky',
  ...props
}: Props) => {
  return (
    <header
      className={cn(
        position !== 'static' && OVERLAY_LAYER,
        position === 'sticky' && 'sticky top-0',
        position === 'fixed' && 'fixed inset-x-0 top-0',
        'bg-background',
        'flex h-16 w-full items-center px-5',
        className,
        //
      )}
      {...props}
    >
      {children}
    </header>
  );
};

export default Header;
