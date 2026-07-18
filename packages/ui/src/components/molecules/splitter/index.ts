import Panel, { type Props as SplitterPanelProps } from './panel';
import SplitterImpl, { type Props } from './splitter';

type SplitterComponent = typeof SplitterImpl & { Panel: typeof Panel };

const Splitter = SplitterImpl as SplitterComponent;

Splitter.Panel = Panel;

export default Splitter;
export type { Props, SplitterPanelProps };
