import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Combobox, Config } from '@repo/ui';

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Apricot', value: 'apricot' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blackberry', value: 'blackberry' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' },
  { label: 'Grapefruit', value: 'grapefruit' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Lime', value: 'lime' },
  { label: 'Mango', value: 'mango' },
  { label: 'Orange', value: 'orange' },
  { label: 'Peach', value: 'peach' },
  { label: 'Pear', value: 'pear' },
  { label: 'Pineapple', value: 'pineapple' },
  { label: 'Raspberry', value: 'raspberry' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Watermelon', value: 'watermelon' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Data Entry/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use Combobox for a large set of predefined values that users need to filter by typing. Use Select when filtering is unnecessary; use Input.Search for a free-text search rather than choosing a predefined value. The required `label` gives the input an accessible name. Multiple selection and chips are outside this single-select API.',
      },
    },
  },
  argTypes: {
    options: { control: false },
    classNames: { control: false },
  },
  render: props => (
    <div className="flex min-h-60 items-start justify-center pt-8">
      <Combobox {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Choose a fruit',
    placeholder: 'Search fruit',
    options: fruits,
  },
};

export const Controlled: Story = {
  render: function ControlledCombobox() {
    const [value, setValue] = useState<string | null>('banana');

    return (
      <div className="flex flex-col gap-3">
        <Combobox
          label="Choose a fruit"
          placeholder="Search fruit"
          options={fruits}
          value={value}
          onChange={setValue}
        />
        <span data-testid="selected-value">Selected: {value ?? 'none'}</span>
      </div>
    );
  },
};

export const DisabledOption: Story = {
  args: {
    ...Default.args,
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana (unavailable)', value: 'banana', disabled: true },
      { label: 'Cherry', value: 'cherry' },
    ],
  },
};

export const NoResults: Story = {
  args: {
    ...Default.args,
    defaultInputValue: 'no-match',
    emptyText: 'Try a different fruit.',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const ThemedRtl: Story = {
  render: () => (
    <Config direction="rtl" theme={{ dark: 'dark' }}>
      <Combobox
        label="اختر فاكهة"
        placeholder="ابحث عن فاكهة"
        options={fruits}
      />
    </Config>
  ),
};
