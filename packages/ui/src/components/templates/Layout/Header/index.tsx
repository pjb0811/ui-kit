import { cn } from '@repo/ui/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const Header = ({ children, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        'sticky top-0 z-50',
        'flex w-full items-center justify-center px-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Header;
