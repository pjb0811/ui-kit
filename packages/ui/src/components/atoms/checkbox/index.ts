import CheckboxImpl, { type Props } from './checkbox';
import Group from './group';

type CheckboxComponent = typeof CheckboxImpl & { Group: typeof Group };

const Checkbox = CheckboxImpl as CheckboxComponent;

Checkbox.Group = Group;

export default Checkbox;
export type { Props };
