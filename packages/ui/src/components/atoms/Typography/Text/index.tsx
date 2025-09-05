import { TEXT_LEVELS } from '@repo/ui/enums';
import { cn } from '@repo/ui/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

interface Props extends TypographyProps {
  underline?: boolean;
  strong?: boolean;
}

const Text = ({
  children,
  underline,
  strong,
  className,
  level,
  ...props
}: Props) => {
  return (
    <span
      className={cn(
        'text-nowrap',
        level ? TEXT_LEVELS[level] : '',
        underline && 'underline',
        strong && 'font-bold',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Text;
