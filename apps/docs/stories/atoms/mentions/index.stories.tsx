import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test';

import { Button, Config, Drawer, Mentions, Modal } from '@repo/ui';

const options = [
  { value: 'alice', label: 'Alice Park' },
  { value: 'bob', label: 'Bob Kim' },
  { value: 'locked', label: 'Unavailable person', disabled: true },
];
const meta: Meta<typeof Mentions> = {
  title: 'UI/Mentions',
  component: Mentions,
  args: {
    options,
    'aria-label': 'Message',
    placeholder: 'Type @ to mention someone',
    rows: 4,
    onChange: fn(),
    onSelect: fn(),
    onSearch: fn(),
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MidSentence: Story = {
  args: { defaultValue: 'Hello @ali there' },
  play: async ({ canvasElement, args }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'Message',
    }) as HTMLTextAreaElement;
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(field);
    field.setSelectionRange(10, 10);
    fireEvent(field.ownerDocument, new Event('selectionchange'));
    await userEvent.click(
      await page.findByRole('option', { name: 'Alice Park' }),
    );
    await expect(field).toHaveValue('Hello @alice there');
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
    await expect(args.onChange).toHaveBeenLastCalledWith('Hello @alice there');
    await waitFor(() => expect(field.selectionStart).toBe(12));
    await expect(field).toHaveFocus();
  },
};
export const Keyboard: Story = {
  play: async ({ canvasElement, args }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'Message',
    });

    await userEvent.type(field, 'Hi @bo');
    await within(canvasElement.ownerDocument.body).findByRole('option', {
      name: 'Bob Kim',
    });
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(field).toHaveValue('Hi @bob ');
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}{Enter}next line');
    await expect(field).toHaveValue('Hi @bob \nnext line');
  },
};
export const EscapePreservesText: Story = {
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'Message',
    });

    await userEvent.type(field, '@a');
    await within(canvasElement.ownerDocument.body).findByRole('option', {
      name: 'Alice Park',
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(field).not.toHaveAttribute('aria-expanded', 'true'),
    );
    await userEvent.keyboard('{Escape}');
    await expect(field).toHaveValue('@a');
    await userEvent.type(field, 'l');
    await within(canvasElement.ownerDocument.body).findByRole('option', {
      name: 'Alice Park',
    });
  },
};
export const SelectionReplacement: Story = {
  args: { defaultValue: 'Hello @alice there' },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole(
      'textbox',
    ) as HTMLTextAreaElement;

    await userEvent.click(field);
    field.setSelectionRange(8, 11);
    fireEvent(field.ownerDocument, new Event('selectionchange'));
    await userEvent.click(
      await within(canvasElement.ownerDocument.body).findByRole('option', {
        name: 'Alice Park',
      }),
    );
    await expect(field).toHaveValue('Hello @alice there');
    await waitFor(() => expect(field.selectionStart).toBe(12));
  },
};
export const IME: Story = {
  args: { options: [{ value: '지민', label: '지민' }] },
  play: async ({ canvasElement, args }) => {
    const field = within(canvasElement).getByRole(
      'textbox',
    ) as HTMLTextAreaElement;

    await userEvent.type(field, '@');
    fireEvent.compositionStart(field);
    fireEvent.change(field, { target: { value: '@지' } });
    fireEvent.keyDown(field, { key: 'Enter', keyCode: 229, isComposing: true });
    await expect(args.onSelect).not.toHaveBeenCalled();
    fireEvent.compositionEnd(field, { data: '지' });
    field.setSelectionRange(2, 2);
    fireEvent(field.ownerDocument, new Event('selectionchange'));
    await userEvent.click(
      await within(canvasElement.ownerDocument.body).findByRole('option', {
        name: '지민',
      }),
    );
    await expect(field).toHaveValue('@지민 ');
  },
};
export const Controlled: Story = {
  render: function Render(props) {
    const [value, setValue] = useState('');

    return <Mentions {...props} value={value} onChange={setValue} />;
  },
};
export const ControlledUnchanged: Story = {
  args: { value: 'Hello @ali there' },
  play: async ({ canvasElement, args }) => {
    const field = within(canvasElement).getByRole(
      'textbox',
    ) as HTMLTextAreaElement;

    await userEvent.click(field);
    field.setSelectionRange(10, 10);
    fireEvent(field.ownerDocument, new Event('selectionchange'));
    await userEvent.click(
      await within(canvasElement.ownerDocument.body).findByRole('option', {
        name: 'Alice Park',
      }),
    );
    await expect(field).toHaveValue('Hello @ali there');
    await expect(args.onChange).toHaveBeenLastCalledWith('Hello @alice there');
    await waitFor(() =>
      expect(field).not.toHaveAttribute('aria-expanded', 'true'),
    );
  },
};
export const Prefixes: Story = {
  args: {
    prefixes: ['@', '#'],
    options: [
      { value: 'alice', prefix: '@', label: 'Alice' },
      { value: 'release', prefix: '#', label: 'Release' },
    ],
  },
};
export const CallerFiltered: Story = {
  render: function Render(props) {
    const [query, setQuery] = useState('');

    return (
      <>
        <Mentions
          {...props}
          filterOption={false}
          options={options.filter(option => option.value.startsWith(query))}
          onSearch={setQuery}
        />
        <output>Search: {query}</output>
      </>
    );
  },
};
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { options: [] } };
// Waits long enough for a popup to open if it was going to.
const expectNoSuggestions = async (canvasElement: HTMLElement) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  await expect(
    within(canvasElement.ownerDocument.body).queryByRole('listbox'),
  ).not.toBeInTheDocument();
};

// Opens suggestions in the visible Message field and checks that the list sits
// inside the viewport and is the topmost element where it is drawn.
const expectSuggestionsOnTop = async (canvasElement: HTMLElement) => {
  const document = canvasElement.ownerDocument;
  const page = within(document.body);
  const field = await page.findByRole('textbox', { name: 'Message' });

  await userEvent.type(field, '@');

  const listbox = await page.findByRole('listbox');
  const option = await page.findByRole('option', { name: 'Alice Park' });

  await waitFor(() => {
    const box = listbox.getBoundingClientRect();
    const view = document.defaultView!;

    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.bottom).toBeLessThanOrEqual(view.innerHeight);
    expect(box.right).toBeLessThanOrEqual(view.innerWidth);
  });

  const optionBox = option.getBoundingClientRect();
  const hit = document.elementFromPoint(
    optionBox.left + optionBox.width / 2,
    optionBox.top + optionBox.height / 2,
  );

  await expect(option.contains(hit)).toBe(true);
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '@alice' },
  play: async ({ canvasElement, args }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'Message',
    });

    await expect(field).toBeDisabled();
    await userEvent.type(field, ' @b');
    await expect(field).toHaveValue('@alice');
    await expectNoSuggestions(canvasElement);
    await expect(args.onSearch).not.toHaveBeenCalled();
  },
};
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: '@alice' },
  play: async ({ canvasElement, args }) => {
    const field = within(canvasElement).getByRole('textbox', {
      name: 'Message',
    }) as HTMLTextAreaElement;

    // A caret inside an existing token opens suggestions in an editable field.
    await userEvent.click(field);
    field.setSelectionRange(3, 3);
    fireEvent(field.ownerDocument, new Event('selectionchange'));
    await userEvent.keyboard('@b');
    await expect(field).toHaveValue('@alice');
    await expectNoSuggestions(canvasElement);
    await expect(args.onSearch).not.toHaveBeenCalled();
  },
};
export const Multiline: Story = {
  args: { defaultValue: '@alice\nPlease ask @bo about the release.' },
};
export const Resizable: Story = {
  args: { rows: 8, style: { resize: 'both', minWidth: 160, maxWidth: '100%' } },
};
export const LongLabels: Story = {
  args: { options: [{ value: 'long', label: 'LongSuggestion'.repeat(30) }] },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <Mentions {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <Mentions {...props} />
    </Config>
  ),
};
export const FormAndRef: Story = {
  render: function Render(props) {
    const field = useRef<HTMLTextAreaElement>(null);
    const [submitted, setSubmitted] = useState('');

    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(
            String(new FormData(event.currentTarget).get('message')),
          );
        }}
      >
        <label htmlFor="message">Message</label>
        <Mentions {...props} id="message" name="message" ref={field} />
        <Button htmlType="submit">Send</Button>
        <Button onClick={() => field.current?.focus()}>Focus message</Button>
        <output>{submitted}</output>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Focus message' }),
    );
    await expect(canvas.getByRole('textbox')).toHaveFocus();
    await userEvent.keyboard('Hello @alice{Escape}');
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Hello @alice');
  },
};
export const InModal: Story = {
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal title="Message" open={open} onCancel={() => setOpen(false)}>
          <Mentions {...props} />
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Open modal' }),
    );
    await expectSuggestionsOnTop(canvasElement);
  },
};
export const InDrawer: Story = {
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer title="Message" open={open} onClose={() => setOpen(false)}>
          <Mentions {...props} />
        </Drawer>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Open drawer' }),
    );
    await expectSuggestionsOnTop(canvasElement);
  },
};

export const ViewportEdge: Story = {
  render: props => (
    <div className="fixed end-0 bottom-0 w-64">
      <Mentions {...props} rows={2} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expectSuggestionsOnTop(canvasElement);
  },
};
