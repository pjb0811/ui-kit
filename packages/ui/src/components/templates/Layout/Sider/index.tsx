import { cn } from '@repo/ui/utils';

const Sider = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      className={cn(
        'z-100',
        'w-50',
        className,
        //
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Sider;
