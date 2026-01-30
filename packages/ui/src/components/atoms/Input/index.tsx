import { input } from '@repo/ui/core';

import Search from './Search';
import TextArea from './TextArea';

const { Input: Core } = input;

const Input = ({ ...props }: React.ComponentPropsWithoutRef<'input'>) => {
  return <Core {...props} />;
};

Input.Search = Search;
Input.TextArea = TextArea;

export { Search, TextArea };

export default Input;
