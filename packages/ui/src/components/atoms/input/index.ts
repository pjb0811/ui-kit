import InputImpl from './input';
import Search from './search';
import TextArea from './text-area';

type InputComponent = typeof InputImpl & {
  Search: typeof Search;
  TextArea: typeof TextArea;
};

const Input = InputImpl as InputComponent;

Input.Search = Search;
Input.TextArea = TextArea;

export { Search, TextArea };
export default Input;
