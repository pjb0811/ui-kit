import { TEXT_LEVELS } from '@repo/ui/enums';
import { cn } from '@repo/ui/utils';

import { TypographyProps } from '..';

export interface Props extends TypographyProps {}

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
