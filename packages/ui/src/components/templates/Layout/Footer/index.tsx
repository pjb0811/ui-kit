import { cn } from '@repo/ui/utils';

const Footer = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn(className, 'w-full')} {...props}>
      {children}
    </div>
  );
};

export default Footer;
