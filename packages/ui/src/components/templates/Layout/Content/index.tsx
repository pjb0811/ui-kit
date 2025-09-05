import { cn } from '@repo/ui/utils';

const Content = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('shrink flex-grow basis-0', className)} {...props}>
      {children}
    </div>
  );
};

export default Content;
