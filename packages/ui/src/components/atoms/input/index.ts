import InputImpl from './input';
import Number from './number';
import Search from './search';
import TextArea from './text-area';

type InputComponent = typeof InputImpl & {
  Search: typeof Search;
  Number: typeof Number;
  TextArea: typeof TextArea;
};

const Input = InputImpl as InputComponent;

Input.Search = Search;
Input.Number = Number;
Input.TextArea = TextArea;

export { Number, Search, TextArea };
export type { Props as NumberProps } from './number';
export default Input;
