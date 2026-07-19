import { textarea } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { Textarea: Core } = textarea;

const TextArea = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<'textarea'>) => {
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
