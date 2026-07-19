import Button from './button';
import Node from './node';
import SkeletonImpl, { type Props } from './skeleton';

type SkeletonComponent = typeof SkeletonImpl & {
  Button: typeof Button;
  Node: typeof Node;
};

const Skeleton = SkeletonImpl as SkeletonComponent;

Skeleton.Button = Button;
Skeleton.Node = Node;

export { Button, Node };
export default Skeleton;
export type { Props };
