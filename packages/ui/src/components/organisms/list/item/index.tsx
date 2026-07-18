import { cn } from '@repo/ui/utils';

const Item = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};

export default Item;
