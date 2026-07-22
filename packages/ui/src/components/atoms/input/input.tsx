import { input } from '@repo/ui/core';

const { Input: Core } = input;

const Input = ({ ...props }: React.ComponentPropsWithoutRef<'input'>) => {
  return <Core {...props} />;
};

export default Input;
