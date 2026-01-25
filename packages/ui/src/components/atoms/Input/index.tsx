import { InputHTMLAttributes } from 'react';

import { Input as Core } from '../../../core/input';
import Search from './Search';
import TextArea from './TextArea';

const Input = ({ ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return <Core {...props} />;
};

Input.Search = Search;
Input.TextArea = TextArea;

export { Search, TextArea };

export default Input;
