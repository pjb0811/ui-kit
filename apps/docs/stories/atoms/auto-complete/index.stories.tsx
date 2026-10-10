import { useEffect, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import {
  AutoComplete,
  type AutoCompleteOption,
  Button,
  Config,
  Drawer,
  Modal,
} from '@repo/ui';

const options: AutoCompleteOption[] = [
  { value: 'alpha', label: 'Alpha project' },
  { value: 'beta', label: 'Beta project' },
  { value: 'locked', disabled: true },
];
const meta: Meta<typeof AutoComplete> = {
  title: 'Data Entry/AutoComplete',
  component: AutoComplete,
  args: {
    options,
    'aria-label': 'Project name',
    placeholder: 'Type a project name',
    onChange: fn(),
    onSelect: fn(),
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Controlled: Story = {
  render: function Render(props) {
    const [value, setValue] = useState('');

    return (
      <>
        <AutoComplete {...props} value={value} onChange={setValue} />
        <output>{value}</output>
      </>
    );
  },
};
export const ControlledUnchanged: Story = { args: { value: 'alpha' } };
export const FreeText: Story = { args: { defaultValue: 'Unlisted project' } };
export const Disabled: Story = {
  args: { defaultValue: 'alpha', disabled: true },
};
export const ReadOnly: Story = {
  args: { defaultValue: 'alpha', readOnly: true },
};
export const Empty: Story = { args: { options: [] } };
export const NoClear: Story = {
  args: { defaultValue: 'alpha', allowClear: false },
};
export const CustomFilter: Story = {
  args: {
    filterOption: (query, option) =>
      (option.label ?? option.value)
        .toLowerCase()
        .includes(query.toLowerCase()),
  },
};
export const ExternallyFiltered: Story = {
  args: { filterOption: false, options: [{ value: 'nyc', label: 'New York' }] },
};
export const LongLabels: Story = {
  args: {
    options: [{ value: 'long', label: 'UnbrokenLabel'.repeat(30) }],
    filterOption: false,
  },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <AutoComplete {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <AutoComplete {...props} />
    </Config>
  ),
};
export const InModal: Story = {
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal title="Project" open={open} onCancel={() => setOpen(false)}>
          <AutoComplete {...props} />
        </Modal>
      </>
    );
  },
};
export const InDrawer: Story = {
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer title="Project" open={open} onClose={() => setOpen(false)}>
          <AutoComplete {...props} />
        </Drawer>
      </>
    );
  },
};
export const FormValue: Story = {
  render: function Render(props) {
    const [submitted, setSubmitted] = useState('');
    const input = useRef<HTMLInputElement>(null);

    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          setSubmitted(
            String(new FormData(event.currentTarget).get('project')),
          );
        }}
      >
        <label htmlFor="project">Project</label>
        <AutoComplete {...props} id="project" name="project" ref={input} />
        <Button htmlType="submit">Submit</Button>
        <Button onClick={() => input.current?.focus()}>Focus input</Button>
        <output>{submitted}</output>
      </form>
    );
  },
};
export const SelectionEvents: Story = {
  render: function Render(props) {
    const [events, setEvents] = useState<string[]>([]);

    return (
      <>
        <AutoComplete
          {...props}
          onChange={value =>
            setEvents(events => [...events, `change:${value}`])
          }
          onSelect={value =>
            setEvents(events => [...events, `select:${value}`])
          }
        />
        <output>{JSON.stringify(events)}</output>
      </>
    );
  },
};
export const AsyncSuggestions: Story = {
  render: function Render(props) {
    const [value, setValue] = useState('');
    const [items, setItems] = useState(options);
    const [isLoading, setIsLoading] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);

    return (
      <AutoComplete
        {...props}
        value={value}
        options={items}
        filterOption={false}
        aria-busy={isLoading}
        onChange={query => {
          setValue(query);
          clearTimeout(timer.current);
          setIsLoading(true);
          timer.current = setTimeout(() => {
            setItems(options.filter(option => option.value.includes(query)));
            setIsLoading(false);
          }, 400);
        }}
      />
    );
  },
};
export const DataUpdates: Story = {
  render: function Render(props) {
    const [items, setItems] = useState(options);

    return (
      <>
        <AutoComplete {...props} options={items} />
        <Button onClick={() => setItems([{ value: 'replacement' }])}>
          Replace suggestions
        </Button>
      </>
    );
  },
};
