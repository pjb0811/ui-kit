import { InputHTMLAttributes } from 'react';

import { input } from '@repo/ui/core';

import Search from './Search';
import TextArea from './TextArea';

const { Input: Core } = input;

const Input = ({ ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return <Core {...props} />;
};

Input.Search = Search;
Input.TextArea = TextArea;

export { Search, TextArea };

export default Input;
