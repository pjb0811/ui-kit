import { cn } from '@repo/ui/utils';

export interface Props extends React.ComponentPropsWithoutRef<'p'> {}

const Paragraph = ({ children, className, ...props }: Props) => {
  return (
    <p
      data-slot="typography-paragraph"
      {...props}
      className={cn(
        'm-0',
        className,
        //
      )}
    >
      {children}
    </p>
  );
};

export default Paragraph;
