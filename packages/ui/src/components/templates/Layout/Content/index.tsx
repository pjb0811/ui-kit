import { cn } from '@repo/ui/utils';

const Content = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div className={cn('shrink grow basis-0', className)} {...props}>
      {children}
    </div>
  );
};

export default Content;
