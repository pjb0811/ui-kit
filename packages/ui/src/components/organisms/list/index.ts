import Item from './item';
import ListImpl from './list';

type ListComponent = typeof ListImpl & { Item: typeof Item };

const List = ListImpl as ListComponent;

List.Item = Item;

export default List;
