import { cn } from '@repo/ui/utils';

const Item = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};

export default Item;
