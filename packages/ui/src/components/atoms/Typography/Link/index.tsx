import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'a'> {}

const Link = ({ children, className, ...props }: Props) => {
  return (
    <a
      className={cn(
        'underline-offset-1 hover:underline',
        className,
        //
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
