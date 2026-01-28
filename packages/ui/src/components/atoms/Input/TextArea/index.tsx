import { textarea } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { Textarea: Core } = textarea;

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
