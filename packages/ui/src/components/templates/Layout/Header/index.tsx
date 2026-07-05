import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'header'> {}

const Header = ({ children, className, ...props }: Props) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-50',
        'flex w-full items-center px-5',
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
