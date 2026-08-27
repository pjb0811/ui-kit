import { cn } from '@repo/ui/utils';

import { textarea } from '../../../core';

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
