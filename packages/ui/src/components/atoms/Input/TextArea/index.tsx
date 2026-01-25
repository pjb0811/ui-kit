import { cn } from '@repo/ui/utils';

import { Textarea as Core } from '../../../../core/textarea';

const TextArea = ({
  className,
  ref,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: React.Ref<HTMLTextAreaElement>;
}) => {
  return (
    <Core
      ref={ref}
      className={cn(
        className,
        //
      )}
      {...props}
    />
  );
};

export default TextArea;
