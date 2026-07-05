import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'footer'> {}

const Footer = ({ children, className, ...props }: Props) => {
  return (
    <footer className={cn('w-full', className)} {...props}>
      {children}
    </footer>
  );
};

export default Footer;
