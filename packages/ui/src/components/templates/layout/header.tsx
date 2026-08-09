import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'header'> {
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
        position === 'sticky' && 'sticky top-0 z-50',
        position === 'fixed' && 'fixed inset-x-0 top-0 z-50',
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
