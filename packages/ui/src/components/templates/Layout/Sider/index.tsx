import { cn } from '@repo/ui/utils';

const Sider = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'z-[100]',
        'w-[200px]',
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
