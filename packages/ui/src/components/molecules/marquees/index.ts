import Item from './item';
import MarqueesImpl, { type Props } from './marquees';

type MarqueesComponent = typeof MarqueesImpl & { Item: typeof Item };

const Marquees = MarqueesImpl as MarqueesComponent;

Marquees.Item = Item;

export default Marquees;
export { Item };
export type { ItemProps } from './item';
export type { Props, Props as MarqueesProps };
