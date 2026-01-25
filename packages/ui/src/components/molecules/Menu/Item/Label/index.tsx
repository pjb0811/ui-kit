import { Typography } from '@repo/ui';
import { cn } from '@repo/ui/utils';

interface Props extends React.HTMLAttributes<HTMLElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Label = ({ children, level = 4, className, ...props }: Props) => {
  if (typeof children === 'string') {
    return (
      <Typography.Text level={level} className={cn(className)} {...props}>
        {children}
      </Typography.Text>
    );
  }

  return children;
};

export default Label;
