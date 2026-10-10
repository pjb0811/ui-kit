import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Button,
  Checkbox,
  Config,
  Form,
  type FormProps,
  Input,
  Select,
} from '@repo/ui';

const meta: Meta<typeof Form> = {
  title: 'Data Entry/Form',
  component: Form,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function Registration(props: FormProps) {
  const [submitted, setSubmitted] = useState('');

  return (
    <Form
      {...props}
      onSubmit={event => {
        event.preventDefault();
        setSubmitted(
          JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
        );
      }}
    >
      <Form.Field
        name="email"
        label="Email"
        description="Use your work email."
        required
      >
        <Form.Control type="email" placeholder="you@company.com" />
      </Form.Field>
      <Form.Field name="role" label="Role" required>
        <Select
          required
          options={[
            { value: 'member', label: 'Member' },
            { value: 'admin', label: 'Administrator' },
          ]}
          placeholder="Choose a role"
        />
      </Form.Field>
      <Form.Field name="updates" label="Product updates">
        <Checkbox value="yes" />
      </Form.Field>
      <div className="flex gap-2">
        <Button htmlType="submit">Submit</Button>
        <Button htmlType="reset" variant="outlined">
          Reset
        </Button>
      </div>
      <output aria-label="Submitted values">{submitted}</output>
    </Form>
  );
}

export const Default: Story = { render: props => <Registration {...props} /> };
export const Horizontal: Story = {
  args: { layout: 'horizontal' },
  render: props => <Registration {...props} />,
};
export const OnBlur: Story = {
  args: { validationMode: 'onBlur' },
  render: props => <Registration {...props} />,
};
export const OnChange: Story = {
  args: { validationMode: 'onChange' },
  render: props => <Registration {...props} />,
};
export const ExternalErrors: Story = {
  render: function Render(props) {
    const [errors, setErrors] = useState<FormProps['errors']>({});
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState('');

    return (
      <Form
        {...props}
        errors={errors}
        onSubmit={async event => {
          event.preventDefault();
          const username = new FormData(event.currentTarget).get('username');

          setPending(true);
          setResult('');
          await new Promise(resolve => setTimeout(resolve, 300));
          setErrors(
            username === 'admin'
              ? {
                  username: [
                    'This name is reserved.',
                    'Choose a different username.',
                  ],
                }
              : {},
          );
          setResult(username === 'admin' ? '' : 'Saved');
          setPending(false);
        }}
      >
        <Form.Field
          name="username"
          label="Username"
          description="Try admin to receive server errors."
          required
        >
          <Form.Control defaultValue="admin" />
        </Form.Field>
        <Button htmlType="submit" disabled={pending}>
          Save
        </Button>
        <output aria-live="polite">{pending ? 'Saving…' : result}</output>
      </Form>
    );
  },
};
export const CustomValidation: Story = {
  render: props => (
    <Form {...props} validationMode="onChange">
      <Form.Field
        name="code"
        label="Project code"
        validate={value =>
          String(value).startsWith('UI-') ? null : 'Start the code with UI-.'
        }
      >
        <Form.Control />
      </Form.Field>
    </Form>
  ),
};
export const Controlled: Story = {
  render: function Render(props) {
    const [value, setValue] = useState('initial');

    return (
      <Form {...props} onReset={() => setValue('initial')}>
        <Form.Field name="project" label="Project">
          <Form.Control value={value} onValueChange={setValue} />
        </Form.Field>
        <Button htmlType="reset">Reset</Button>
        <output>{value}</output>
      </Form>
    );
  },
};
export const NativeReset: Story = {
  render: function Render(props) {
    const input = useRef<HTMLElement>(null);
    const form = useRef<HTMLFormElement>(null);
    const [submitted, setSubmitted] = useState('');

    return (
      <Form
        {...props}
        ref={form}
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(
            JSON.stringify(
              Object.fromEntries(new FormData(event.currentTarget)),
            ),
          );
        }}
      >
        <Form.Field name="project" label="Project">
          <Form.Control ref={input} defaultValue="initial" />
        </Form.Field>
        <Form.Field name="excluded" label="Disabled" disabled>
          <Form.Control defaultValue="excluded" />
        </Form.Field>
        <Button onClick={() => input.current?.focus()}>Focus input</Button>
        <Button htmlType="submit">Submit</Button>
        <Button htmlType="reset">Reset</Button>
        <Button onClick={() => form.current?.requestSubmit()}>
          Submit via ref
        </Button>
        <output>{submitted}</output>
      </Form>
    );
  },
};
export const TextArea: Story = {
  render: props => (
    <Form {...props}>
      <Form.Field
        name="notes"
        label="Notes"
        description="A native textarea adapter."
        required
      >
        <Form.Control render={<Input.TextArea />} />
      </Form.Field>
      <Button htmlType="submit">Submit</Button>
    </Form>
  ),
};
export const LongError: Story = {
  render: props => (
    <Form {...props} layout="horizontal">
      <Form.Field
        name="project"
        label="Project"
        error={'UnbrokenError'.repeat(35)}
      >
        <Form.Control defaultValue="project" />
      </Form.Field>
    </Form>
  ),
};
export const ReadOnly: Story = {
  render: props => (
    <Form {...props}>
      <Form.Field name="project" label="Project">
        <Form.Control readOnly defaultValue="Read only" />
      </Form.Field>
    </Form>
  ),
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <Registration {...props} layout="horizontal" />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <Registration {...props} />
    </Config>
  ),
};

export const RegisteredValues: Story = {
  render: function Render(props) {
    const [result, setResult] = useState('');

    return (
      <Form<{ project: string }>
        {...props}
        onFormSubmit={values => setResult(values.project.toUpperCase())}
      >
        <Form.Field name="project" label="Project" required>
          <Form.Control defaultValue="ui-kit" />
        </Form.Field>
        <Button htmlType="submit">Submit</Button>
        <output>{result}</output>
      </Form>
    );
  },
};
