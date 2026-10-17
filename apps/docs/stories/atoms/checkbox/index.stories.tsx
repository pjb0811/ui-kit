import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Checkbox } from '@repo/ui';

const meta: Meta<typeof Checkbox> = {
  title: 'Data Entry/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: { type: 'radio' },
      options: ['left', 'right'],
    },
    defaultChecked: {
      control: { type: 'boolean' },
    },
    checked: {
      control: { type: 'boolean' },
    },
    value: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '체크박스',
    defaultChecked: false,
    placement: 'left',
    value: false,
  },
};

export const Indeterminate: Story = {
  args: { children: 'Partial selection', indeterminate: true },
};

export const IndeterminateIcons: Story = {
  args: {
    children: 'Partial selection with icons',
    indeterminate: true,
    icons: {},
  },
};

export const Controlled: Story = {
  args: {
    children: '체크박스',
    placement: 'left',
    checked: true,
  },
  render: function Render({ checked: _checked, ...props }) {
    const [checked, setChecked] = useState(_checked);

    useEffect(() => {
      setChecked(_checked);
    }, [_checked]);

    return (
      <Checkbox
        {...props}
        checked={checked}
        onChange={next => {
          setChecked(next);
        }}
      />
    );
  },
};

export const ExternalLabel: Story = {
  render: props => (
    <div className="flex flex-col gap-2">
      <label htmlFor="terms">Accept the terms</label>
      <Checkbox
        {...props}
        id="terms"
        aria-describedby="terms-error"
        aria-invalid
      />
      <p id="terms-error">You must accept the terms to continue.</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', {
      name: 'Accept the terms',
    });

    await expect(checkbox).toHaveAccessibleDescription(
      'You must accept the terms to continue.',
    );
    await expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    await expect(
      canvasElement.querySelector('[data-slot="checkbox-field"]'),
    ).not.toHaveAttribute('id');

    await userEvent.click(canvas.getByText('Accept the terms'));
    await expect(checkbox).toBeChecked();
  },
};

export const IconsLabelledBy: Story = {
  render: props => (
    <div className="flex flex-col gap-2">
      <span id="newsletter-label">Subscribe to the newsletter</span>
      <Checkbox
        {...props}
        icons={{}}
        aria-labelledby="newsletter-label"
        aria-describedby="newsletter-hint"
      />
      <p id="newsletter-hint">One email a month.</p>
      <Checkbox icons={{}}>Visible label</Checkbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('checkbox', { name: 'Subscribe to the newsletter' }),
    ).toHaveAccessibleDescription('One email a month.');
    await expect(
      canvas.getByRole('checkbox', { name: 'Visible label' }),
    ).toBeVisible();
  },
};
