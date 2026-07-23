import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'a'> {}

const Link = ({ children, className, target, rel, ...props }: Props) => {
  return (
    <a
      className={cn(
        'underline-offset-1 hover:underline',
        className,
        //
      )}
      target={target}
      rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
