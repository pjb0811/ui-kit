import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Config, Input } from '@repo/ui';

const meta: Meta<typeof Input.OTP> = {
  title: 'Data Entry/Input/OTP',
  component: Input.OTP,
  args: {
    length: 6,
    label: 'Verification code',
    name: 'code',
    onChange: fn(),
    onComplete: fn(),
  },
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const RootPropsAndDescription: Story = {
  args: {
    className: 'w-full',
    style: { width: '100%' },
    'aria-describedby': 'otp-help',
  },
  render: props => (
    <>
      <Input.OTP
        {...props}
        data-testid="otp-root"
        ref={node => {
          node?.setAttribute('data-ref-target', 'true');
        }}
      />
      <p id="otp-help">Enter the six-digit verification code.</p>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId('otp-root');

    await expect(root).toHaveClass('w-full');
    await expect(root).toHaveStyle({ width: '100%' });
    await expect(root).toHaveAttribute('data-ref-target', 'true');
    await expect(root).toHaveAttribute('aria-describedby', 'otp-help');
    await expect(root.querySelectorAll('input[aria-describedby]')).toHaveLength(
      0,
    );
  },
};
export const InvalidLength: Story = {
  args: { length: 0 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Character 6 of 6'),
    ).toBeVisible();
  },
};
export const DefaultLength: Story = {
  ...InvalidLength,
  args: { length: undefined },
};
export const LeadingZeroes: Story = { args: { defaultValue: '012345' } };
export const Masked: Story = { args: { defaultValue: '012345', mask: true } };
export const Disabled: Story = {
  args: { disabled: true, defaultValue: '012' },
};
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: '012345' },
};
export const Alphanumeric: Story = {
  args: { validationType: 'alphanumeric', defaultValue: 'A7C9XZ' },
};
export const LongCodeRTL: Story = { args: { length: 12, dir: 'rtl' } };
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <Input.OTP {...props} />
    </Config>
  ),
};
export const Controlled: Story = {
  render: function Render(props) {
    const [value, setValue] = useState('');
    return (
      <>
        <Input.OTP {...props} value={value} onChange={setValue} />
        <output>{value}</output>
      </>
    );
  },
};
export const Editing: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByLabelText('Verification code');
    await userEvent.click(first);
    await userEvent.keyboard('012345');
    await expect(args.onComplete).toHaveBeenCalledTimes(1);
    await expect(args.onComplete).toHaveBeenCalledWith(
      '012345',
      expect.anything(),
    );
    await userEvent.keyboard('{Backspace}');
    await expect(canvas.getByLabelText('Character 6 of 6')).toHaveValue('');
    await userEvent.click(canvas.getByLabelText('Character 6 of 6'));
    await userEvent.keyboard('9');
    await expect(args.onComplete).toHaveBeenCalledWith(
      '012349',
      expect.anything(),
    );
  },
};
export const PasteAndForm: Story = {
  render: props => (
    <form aria-label="Code form">
      <Input.OTP {...props} />
    </form>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText('Verification code'));
    await userEvent.paste('01x 23');
    await expect(canvas.getByLabelText('Character 4 of 6')).toHaveValue('3');
    await expect(args.onComplete).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByLabelText('Verification code'));
    await userEvent.paste('012345');
    await expect(args.onComplete).toHaveBeenCalledWith(
      '012345',
      expect.anything(),
    );
    const form = canvas.getByRole('form') as HTMLFormElement;
    await expect(new FormData(form).get('code')).toBe('012345');
  },
};
