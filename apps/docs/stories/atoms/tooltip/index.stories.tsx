import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InfoIcon } from 'lucide-react';

import { Button, Tooltip } from '@repo/ui';

const meta: Meta<typeof Tooltip> = {
  title: 'Data Display/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use Tooltip for a supplementary visual hint. Give an icon-only trigger its own accessible name (for example, `aria-label`), and keep essential information visible or use Popover for interactive content. Tooltips are unavailable to touch users.',
      },
    },
  },
  argTypes: {
    content: { control: 'text' },
    placement: {
      control: 'select',
      options: [
        'top',
        'right',
        'bottom',
        'left',
        'topLeft',
        'topRight',
        'bottomLeft',
        'bottomRight',
        'leftTop',
        'leftBottom',
        'rightTop',
        'rightBottom',
      ],
    },
    offset: { control: 'number' },
    delay: { control: 'number' },
    closeDelay: { control: 'number' },
    children: { control: false },
  },
  render: props => (
    <div className="flex min-h-40 min-w-48 items-center justify-center">
      <Tooltip {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'Save changes',
    children: <Button>Save</Button>,
  },
};

export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-12">
      {(['top', 'right', 'bottom', 'left'] as const).map(placement => (
        <Tooltip
          key={placement}
          content={`On the ${placement}`}
          placement={placement}
          delay={0}
        >
          <Button>{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const IconButton: Story = {
  args: {
    content: 'More information',
    children: <Button aria-label="More information" icon={<InfoIcon />} />,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Controlled: Story = {
  render: function ControlledTooltip() {
    const [open, setOpen] = useState(false);

    return (
      <Tooltip content="Controlled hint" open={open} onOpenChange={setOpen}>
        <Button>Hover or focus</Button>
      </Tooltip>
    );
  },
};
