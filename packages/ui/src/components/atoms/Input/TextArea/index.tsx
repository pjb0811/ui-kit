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
        'w-full',
        'overflow-hidden outline-none',
        'border-none p-0 shadow-none ring-0',
        'focus-visible:ring-0',
        className,
        //
      )}
      {...props}
    />
  );
};

export default TextArea;
