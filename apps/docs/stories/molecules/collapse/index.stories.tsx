import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronDown, Plus } from 'lucide-react';

import { Collapse } from '@repo/ui';

const meta: Meta<typeof Collapse> = {
  title: 'UI/Collapse',
  component: Collapse,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    accordion: {
      control: { type: 'boolean' },
    },
    expandIcon: {
      control: { type: 'boolean' },
      mapping: {
        true: <ChevronDown className="h-4 w-4" />,
        false: <Plus className="h-4 w-4" />,
      },
    },
    defaultActiveKey: {
      control: { type: 'object' },
    },
    items: {
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    accordion: false,
    expandIcon: <ChevronDown className="h-4 w-4" />,
    defaultActiveKey: ['0'],
    className: 'w-100 rounded-md border border-gray-200 p-4',
    items: [
      {
        key: '0',
        label: 'FAQ 1',
        children: (
          <div className="p-4 text-sm text-gray-600">
            자주 묻는 질문에 대한 답변입니다.
          </div>
        ),
      },
      {
        key: '1',
        label: 'FAQ 2',
        children: (
          <div className="p-4 text-sm text-gray-600">
            또 다른 자주 묻는 질문에 대한 답변입니다.
          </div>
        ),
      },
      {
        key: '2',
        label: 'FAQ 3',
        disabled: false,
        children: (
          <div className="p-4 text-sm text-gray-600">
            활성화된 FAQ 항목입니다.
          </div>
        ),
      },
    ],
  },
};

export const Controlled: Story = {
  args: {
    activeKey: ['0'],
  },
  render: function Render({ activeKey: _activeKey, ...props }) {
    const [activeKeys, setActiveKeys] = useState<string[]>([]);

    useEffect(() => {
      setActiveKeys((_activeKey || []) as string[]);
    }, [_activeKey]);

    return (
      <Collapse
        accordion={false}
        expandIcon={<ChevronDown className="h-4 w-4" />}
        activeKey={activeKeys}
        onChange={setActiveKeys}
        className="w-100 rounded-md border border-gray-200 p-4"
        items={[
          {
            key: '0',
            label: 'FAQ 1',
            children: (
              <div className="p-4 text-sm text-gray-600">
                자주 묻는 질문에 대한 답변입니다.
              </div>
            ),
          },
          {
            key: '1',
            label: 'FAQ 2',
            children: (
              <div className="p-4 text-sm text-gray-600">
                또 다른 자주 묻는 질문에 대한 답변입니다.
              </div>
            ),
          },
          {
            key: '2',
            label: 'FAQ 3',
            disabled: false,
            children: (
              <div className="p-4 text-sm text-gray-600">
                활성화된 FAQ 항목입니다.
              </div>
            ),
          },
        ]}
        {...props}
      />
    );
  },
};
