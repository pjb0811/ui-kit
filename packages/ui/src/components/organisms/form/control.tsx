'use client';

import { type ComponentPropsWithRef, useContext } from 'react';

import { form } from '../../../core';
import Input from '../../atoms/input';
import { RequiredContext } from './context';

export interface Props extends Omit<
  ComponentPropsWithRef<typeof form.Field.Control>,
  'className'
> {
  className?: string;
}

const Control = ({ required, render = <Input />, ...props }: Props) => {
  const inheritedRequired = useContext(RequiredContext);

  return (
    <form.Field.Control
      {...props}
      required={required ?? inheritedRequired}
      render={render}
    />
  );
};

export default Control;
