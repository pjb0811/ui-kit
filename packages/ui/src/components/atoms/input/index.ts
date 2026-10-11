import InputImpl from './input';
import Number from './number';
import OTP from './otp';
import Search from './search';
import TextArea from './text-area';

type InputComponent = typeof InputImpl & {
  Search: typeof Search;
  Number: typeof Number;
  OTP: typeof OTP;
  TextArea: typeof TextArea;
};

const Input = InputImpl as InputComponent;

Input.Search = Search;
Input.Number = Number;
Input.OTP = OTP;
Input.TextArea = TextArea;

export { Number, OTP, Search, TextArea };
export type { Props as OTPProps } from './otp';
export type { Props as NumberProps } from './number';
export default Input;
