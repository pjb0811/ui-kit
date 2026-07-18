import Item from './item';
import RevealsImpl, { CASCADE, DELAY, DURATION, type Props } from './reveals';

type RevealsComponent = typeof RevealsImpl & { Item: typeof Item };

const Reveals = RevealsImpl as RevealsComponent;

Reveals.Item = Item;

export default Reveals;
export { Item, DURATION, DELAY, CASCADE };
export type { ItemProps } from './item';
export type { Props as RevealsProps };
