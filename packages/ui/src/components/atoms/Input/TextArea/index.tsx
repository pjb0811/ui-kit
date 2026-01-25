import { Textarea as Core } from '@repo/ui/core/textarea';
import { cn } from '@repo/ui/utils';

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
