import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Button, Config, Form, Input } from '@repo/ui';

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
    await expect(root.style.width).toBe('100%');
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
    const first = canvas.getByRole('textbox', { name: 'Verification code' });
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
    await userEvent.click(
      canvas.getByRole('textbox', { name: 'Verification code' }),
    );
    await userEvent.paste('01x 23');
    await expect(canvas.getByLabelText('Character 4 of 6')).toHaveValue('3');
    await expect(args.onComplete).not.toHaveBeenCalled();
    await userEvent.click(
      canvas.getByRole('textbox', { name: 'Verification code' }),
    );
    await userEvent.paste('012345');
    await expect(args.onComplete).toHaveBeenCalledWith(
      '012345',
      expect.anything(),
    );
    const form = canvas.getByRole('form') as HTMLFormElement;
    await expect(new FormData(form).get('code')).toBe('012345');
  },
};

export const FieldError: Story = {
  args: { label: undefined },
  render: function Render(props) {
    const [error, setError] = useState<string | undefined>(
      'This code has expired. Request a new code.',
    );

    return (
      <Form>
        <Form.Field name="code" label="Verification code" error={error}>
          <Input.OTP {...props} />
        </Form.Field>
        <Button onClick={() => setError(undefined)}>Clear error</Button>
      </Form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slots = canvas.getAllByRole('textbox');

    await expect(slots).toHaveLength(6);
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'This code has expired. Request a new code.',
    );

    for (const slot of slots) {
      await expect(slot).toHaveAttribute('aria-invalid', 'true');
    }

    await userEvent.click(canvas.getByRole('button', { name: 'Clear error' }));

    for (const slot of slots) {
      await expect(slot).not.toHaveAttribute('aria-invalid', 'true');
    }

    await waitFor(() =>
      expect(canvas.queryByRole('alert')).not.toBeInTheDocument(),
    );
  },
};

export const ControlledFormReset: Story = {
  render: function Render(props) {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState('');

    return (
      <form
        aria-label="Verification form"
        className="space-y-3"
        onReset={() => {
          setValue('');
          setSubmitted('');
        }}
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get('code')));
        }}
      >
        <Input.OTP
          {...props}
          name="code"
          value={value}
          onChange={(nextValue, details) => {
            setValue(nextValue);
            props.onChange?.(nextValue, details);
          }}
        />
        <div className="flex gap-2">
          <Button htmlType="submit">Submit</Button>
          <Button htmlType="reset" variant="outlined">
            Reset
          </Button>
        </div>
        <output aria-label="Submitted code">{submitted}</output>
      </form>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole('form') as HTMLFormElement;

    await userEvent.click(
      canvas.getByRole('textbox', { name: 'Verification code' }),
    );
    await userEvent.paste('012345');
    await expect(new FormData(form).get('code')).toBe('012345');
    await expect(args.onComplete).toHaveBeenCalledTimes(1);
    await expect(canvas.getByLabelText('Submitted code')).toBeEmptyDOMElement();
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(canvas.getByLabelText('Submitted code')).toHaveTextContent(
      '012345',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));

    for (const slot of canvas.getAllByRole('textbox')) {
      await expect(slot).toHaveValue('');
    }

    await expect(new FormData(form).get('code')).toBe('');
    await expect(canvas.getByLabelText('Submitted code')).toBeEmptyDOMElement();
    await expect(args.onComplete).toHaveBeenCalledTimes(1);
  },
};

export const InputRef: Story = {
  args: { defaultValue: '012345' },
  render: function Render(props) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="space-y-3">
        <Input.OTP {...props} inputRef={inputRef} />
        <Button onClick={() => inputRef.current?.focus()}>
          Focus first slot
        </Button>
      </div>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByLabelText('Character 4 of 6'));
    await expect(canvas.getByLabelText('Character 4 of 6')).toHaveFocus();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Focus first slot' }),
    );
    await expect(
      canvas.getByRole('textbox', { name: 'Verification code' }),
    ).toHaveFocus();
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(args.onComplete).not.toHaveBeenCalled();
  },
};
