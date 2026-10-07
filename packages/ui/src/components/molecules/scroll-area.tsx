'use client';

import { scrollArea } from '../../core';

export interface Props extends scrollArea.Props {}

const ScrollArea = (props: Props) => {
  return <scrollArea.ScrollArea {...props} />;
};

export default ScrollArea;
