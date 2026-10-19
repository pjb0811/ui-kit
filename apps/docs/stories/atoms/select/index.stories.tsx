import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Config, Select } from '@repo/ui';

// Storybook's props inference reduces the two Select modes to never.
const meta: Meta = {
  title: 'Data Entry/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use the default Select for short lists. Set `searchable` for long lists of predefined values; its search field opens inside the popup. Add `multiple` to searchable mode for removable selection chips and an array of values. Searchable modes require an accessible `label` and string option labels. Use Input.Search for free-text search instead of selecting a predefined value.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '선택하세요',
    options: [
      { label: '옵션 1', value: '1' },
      { label: '옵션 2', value: '2' },
      { label: '옵션 3', value: '3' },
    ],
  },
};

export const Grouped: Story = {
  args: {
    placeholder: '글꼴을 선택하세요',
    options: [
      {
        label: 'Sans serif',
        options: [
          { label: 'Inter', value: 'inter' },
          { label: 'Pretendard', value: 'pretendard' },
        ],
      },
      {
        label: 'Monospace',
        options: [
          { label: 'JetBrains Mono', value: 'jetbrains-mono' },
          { label: 'Geist Mono', value: 'geist-mono' },
        ],
      },
    ],
  },
};

export const Controlled: Story = {
  render: function ControlledSelect() {
    const [value, setValue] = useState('1');

    return (
      <div className="flex flex-col gap-3">
        <Select
          value={value}
          onChange={setValue}
          options={Default.args?.options}
        />
        <span data-testid="selected-value">Selected: {value}</span>
      </div>
    );
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
    <Config
      direction="rtl"
      theme={{
        dark: 'dark',
        token: { colorPopover: 'oklch(0.3 0.08 250)' },
      }}
    >
      <Select
        placeholder="اختر خيارًا"
        options={[
          { label: 'الخيار الأول', value: 'first' },
          { label: 'الخيار الثاني', value: 'second' },
        ]}
      />
    </Config>
  ),
};

export const Scrollable: Story = {
  args: {
    placeholder: '항목을 선택하세요',
    options: Array.from({ length: 30 }, (_, index) => ({
      label: `항목 ${index + 1}`,
      value: String(index + 1),
    })),
  },
};

const fruits = [
  'Apple',
  'Apricot',
  'Banana',
  'Blackberry',
  'Blueberry',
  'Cherry',
  'Grape',
  'Grapefruit',
  'Kiwi',
  'Lemon',
  'Lime',
  'Mango',
  'Orange',
  'Peach',
  'Pear',
  'Pineapple',
  'Raspberry',
  'Strawberry',
  'Watermelon',
].map(label => ({ label, value: label.toLowerCase() }));

export const Searchable: Story = {
  args: {
    searchable: true,
    label: 'Choose a fruit',
    placeholder: 'Select a fruit',
    searchPlaceholder: 'Search fruit',
    options: fruits,
  },
};

export const SearchableGrouped: Story = {
  args: {
    searchable: true,
    label: 'Choose a font',
    placeholder: 'Select a font',
    options: [
      {
        label: 'Sans serif',
        options: [
          { label: 'Inter', value: 'inter' },
          { label: 'Pretendard', value: 'pretendard' },
        ],
      },
      {
        label: 'Monospace',
        options: [
          { label: 'JetBrains Mono', value: 'jetbrains-mono' },
          { label: 'Geist Mono', value: 'geist-mono' },
        ],
      },
    ],
  },
};

export const SearchableControlled: Story = {
  render: function ControlledSearchableSelect() {
    const [value, setValue] = useState<string | null>('banana');

    return (
      <div className="flex flex-col gap-3">
        <Select
          searchable
          label="Choose a fruit"
          placeholder="Select a fruit"
          options={fruits}
          value={value}
          onChange={setValue}
        />
        <span data-testid="selected-value">Selected: {value ?? 'none'}</span>
      </div>
    );
  },
};

export const SearchableDisabledOption: Story = {
  args: {
    searchable: true,
    label: 'Choose a fruit',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana (unavailable)', value: 'banana', disabled: true },
      { label: 'Cherry', value: 'cherry' },
    ],
  },
};

export const SearchableNoResults: Story = {
  args: {
    ...Searchable.args,
    defaultInputValue: 'no-match',
    emptyText: 'Try a different fruit.',
  },
};

export const SearchableDisabled: Story = {
  args: {
    ...Searchable.args,
    disabled: true,
  },
};

export const SearchableThemedRtl: Story = {
  render: () => (
    <Config direction="rtl" theme={{ dark: 'dark' }}>
      <Select
        searchable
        label="اختر فاكهة"
        placeholder="اختر فاكهة"
        searchPlaceholder="ابحث عن فاكهة"
        options={fruits}
      />
    </Config>
  ),
};

export const SearchableMultiple: Story = {
  args: {
    searchable: true,
    multiple: true,
    label: 'Choose fruits',
    placeholder: 'Select fruits',
    searchPlaceholder: 'Search fruit',
    options: fruits,
    defaultValue: ['apple', 'banana'],
  },
};

export const SearchableMultipleControlled: Story = {
  render: function ControlledMultipleSelect() {
    const [values, setValues] = useState<string[]>(['banana', 'cherry']);

    return (
      <div className="flex flex-col gap-3">
        <Select
          searchable
          multiple
          label="Choose fruits"
          options={fruits}
          value={values}
          onChange={setValues}
        />
        <span data-testid="selected-values">
          Selected: {values.length ? values.join(', ') : 'none'}
        </span>
      </div>
    );
  },
};

export const SearchableMultipleGrouped: Story = {
  args: {
    searchable: true,
    multiple: true,
    label: 'Choose fonts',
    options: [
      {
        label: 'Sans serif',
        options: [
          { label: 'Inter', value: 'inter' },
          { label: 'Pretendard', value: 'pretendard' },
        ],
      },
      {
        label: 'Monospace',
        options: [
          { label: 'JetBrains Mono', value: 'jetbrains-mono' },
          { label: 'Geist Mono (unavailable)', value: 'geist', disabled: true },
        ],
      },
    ],
  },
};

export const SearchableMultipleDisabled: Story = {
  args: {
    ...SearchableMultiple.args,
    disabled: true,
  },
};

export const SearchableMultipleThemedRtl: Story = {
  render: () => (
    <Config direction="rtl" theme={{ dark: 'dark' }}>
      <Select
        searchable
        multiple
        label="اختر فواكه"
        placeholder="اختر فواكه"
        options={fruits}
        defaultValue={['apple', 'banana']}
      />
    </Config>
  ),
};

const fruitOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
];

export const ExternalLabel: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="fruit">Fruit</label>
        <Select
          id="fruit"
          options={fruitOptions}
          aria-describedby="fruit-error"
          aria-invalid
        />
        <p id="fruit-error">Choose a fruit.</p>
      </div>
      <div className="flex flex-col gap-1">
        <span id="search-fruit-label">Searchable fruit</span>
        <Select
          searchable
          label="Fruit"
          id="search-fruit"
          options={fruitOptions}
          aria-labelledby="search-fruit-label"
          aria-describedby="search-fruit-hint"
        />
        <p id="search-fruit-hint">Type to filter.</p>
      </div>
      <div className="flex flex-col gap-1">
        <span id="fruits-label">Fruits</span>
        <Select
          searchable
          multiple
          label="Fruits"
          id="fruits"
          options={fruitOptions}
          aria-labelledby="fruits-label"
          aria-describedby="fruits-hint"
          aria-invalid
        />
        <p id="fruits-hint">Choose one or more.</p>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const staticTrigger = canvas.getByRole('combobox', { name: 'Fruit' });

    await expect(staticTrigger).toHaveAttribute('id', 'fruit');
    await expect(staticTrigger).toHaveAccessibleDescription('Choose a fruit.');
    await expect(staticTrigger).toHaveAttribute('aria-invalid', 'true');

    const searchableTrigger = canvas.getByRole('combobox', {
      name: 'Searchable fruit',
    });

    await expect(searchableTrigger).toHaveAttribute('id', 'search-fruit');
    await expect(searchableTrigger).toHaveAccessibleDescription(
      'Type to filter.',
    );

    const multipleInput = canvas.getByRole('combobox', { name: 'Fruits' });

    await expect(multipleInput).toHaveAttribute('id', 'fruits');
    await expect(multipleInput).toHaveAccessibleDescription(
      'Choose one or more.',
    );
    await expect(multipleInput).toHaveAttribute('aria-invalid', 'true');
  },
};
