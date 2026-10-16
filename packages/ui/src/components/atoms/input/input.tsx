import { input } from '../../../core';

const { Input: Core } = input;

export type Props = React.ComponentPropsWithRef<'input'>;

const Input = ({ ref, ...props }: Props) => {
  return <Core ref={ref} {...props} />;
};

export default Input;
