import { input } from '@repo/ui/core';

const { Input: Core } = input;

const Input = ({ ref, ...props }: React.ComponentPropsWithRef<'input'>) => {
  return <Core ref={ref} {...props} />;
};

export default Input;
