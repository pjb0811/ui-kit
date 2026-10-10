import Control from './control';
import Field from './field';
import FormImpl, { type Props } from './form';

type FormComponent = typeof FormImpl & {
  Field: typeof Field;
  Control: typeof Control;
};

const Form = FormImpl as FormComponent;

Form.Field = Field;
Form.Control = Control;

export default Form;
export type { Props };
export type { Props as FieldProps } from './field';
export type { Props as ControlProps } from './control';
