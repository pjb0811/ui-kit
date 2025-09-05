import { TEXT_LEVELS } from '@repo/ui/enums';
import { cn } from '@repo/ui/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}
interface Props extends TypographyProps {}

const Paragraph = ({ children, className, level, ...props }: Props) => {
  return (
    <p
      {...props}
      className={cn(
        level ? TEXT_LEVELS[level] : '',
        className,
        //
      )}
    >
      {children}
    </p>
  );
};

export default Paragraph;
