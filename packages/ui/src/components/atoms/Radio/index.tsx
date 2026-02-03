import { useId } from 'react';

import { label, radio } from '@repo/ui/core';

const { RadioGroup: Core, RadioGroupItem: Item } = radio;
const { Label } = label;

interface Props extends React.ComponentPropsWithoutRef<typeof Core> {}

const Radio = ({ children }: Props) => {
  const id = useId();

  return (
    <Core>
      <div className="flex items-center gap-3">
        <Item value="default" id={id} />
        <Label htmlFor={id}> {children}</Label>
      </div>
    </Core>
  );
};

export default Radio;
