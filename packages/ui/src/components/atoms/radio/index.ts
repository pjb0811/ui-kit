import Group from './group';
import RadioImpl, { type Props } from './radio';

type RadioComponent = typeof RadioImpl & { Group: typeof Group };

const Radio = RadioImpl as RadioComponent;

Radio.Group = Group;

export default Radio;
export type { Props };
