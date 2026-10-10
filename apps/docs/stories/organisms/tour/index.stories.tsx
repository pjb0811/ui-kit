import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Button, Config, Tour, type TourProps } from '@repo/ui';

function Demo(props: TourProps) {
  const first = useRef<HTMLButtonElement>(null);
  const second = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  return (
    <div className="space-y-4">
      <Button data-testid="start" onClick={() => setOpen(true)}>
        Start tour
      </Button>
      <div className="flex flex-wrap gap-4">
        <Button ref={first} data-testid="first">
          Create document
        </Button>
        {!hidden && (
          <Button ref={second} data-testid="second">
            Share document
          </Button>
        )}
        <Button onClick={() => setHidden(value => !value)}>
          Toggle second target
        </Button>
      </div>
      <Tour
        {...props}
        open={open}
        onOpenChange={value => {
          props.onOpenChange?.(value);
          setOpen(value);
        }}
        steps={
          props.steps.length
            ? props.steps
            : [
                {
                  key: 'create',
                  title: 'Create a document',
                  description: 'Start with a new document.',
                  target: () => first.current,
                },
                {
                  key: 'share',
                  title: 'Share your work',
                  description: 'Invite others to collaborate.',
                  target: () => second.current,
                  placement: 'top',
                },
                {
                  key: 'finish',
                  title: 'Ready to go',
                  description:
                    'This step has no target and appears in the center.',
                },
              ]
        }
      />
    </div>
  );
}

const meta: Meta<typeof Tour> = {
  title: 'Feedback/Tour',
  component: Tour,
  args: {
    steps: [],
    onChange: fn(),
    onClose: fn(),
    onFinish: fn(),
    onOpenChange: fn(),
  },
  render: props => <Demo {...props} />,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NavigationInteractions: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Start tour' }));
    await page.findByRole('dialog', { name: 'Create a document' });
    await userEvent.click(page.getByRole('button', { name: 'Next' }));
    expect(args.onChange).toHaveBeenLastCalledWith(1);
    await page.findByRole('dialog', { name: 'Share your work' });
    await userEvent.click(page.getByRole('button', { name: 'Previous' }));
    expect(args.onChange).toHaveBeenLastCalledWith(0);
    expect(page.getByRole('button', { name: 'Previous' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(args.onChange).toHaveBeenCalledTimes(2);
    await userEvent.click(page.getByRole('button', { name: 'Next' }));
    await userEvent.click(page.getByRole('button', { name: 'Next' }));
    await page.findByRole('dialog', { name: 'Ready to go' });
    await userEvent.click(page.getByRole('button', { name: 'Finish' }));
    expect(args.onFinish).toHaveBeenCalledOnce();
    expect(args.onClose).not.toHaveBeenCalled();
    expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() =>
      expect(page.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(canvas.getByRole('button', { name: 'Start tour' })).toHaveFocus();
  },
};
export const InitialStep: Story = { args: { defaultCurrent: 1 } };
export const Controlled: Story = {
  render: function Render(props) {
    const [current, setCurrent] = useState(0);

    return (
      <>
        <Demo
          {...props}
          current={current}
          onChange={value => {
            props.onChange?.(value);
            setCurrent(value);
          }}
        />
        <output>{current}</output>
      </>
    );
  },
};
export const ControlledUnchanged: Story = { args: { current: 0 } };
export const MissingTarget: Story = {
  args: {
    steps: [
      {
        key: 'missing',
        title: 'Missing target',
        description: 'A missing element uses a centered popup.',
        target: () => null,
      },
    ],
  },
};
export const HiddenTarget: Story = {
  render: props => (
    <>
      <div id="tour-hidden" hidden>
        Hidden element
      </div>
      <Demo
        {...props}
        steps={[
          {
            key: 'hidden',
            title: 'Hidden target',
            target: () => document.getElementById('tour-hidden'),
          },
        ]}
      />
    </>
  ),
};
export const Empty: Story = {
  render: props => <Tour {...props} defaultOpen />,
};
export const ScrolledTarget: Story = {
  render: props => (
    <>
      <Demo
        {...props}
        steps={[
          {
            key: 'far',
            title: 'Scrolled target',
            target: () => document.getElementById('tour-offscreen'),
          },
        ]}
      />
      <div id="tour-offscreen" className="mt-[1200px]">
        Far-away target
      </div>
    </>
  ),
};
export const LongContent: Story = {
  args: {
    steps: [
      {
        key: 'long',
        title: 'Long title '.repeat(12),
        description: 'Long description '.repeat(100),
      },
    ],
  },
};
export const RTL: Story = {
  render: props => (
    <Config direction="rtl">
      <Demo {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <Demo {...props} />
    </Config>
  ),
};
export const Localized: Story = {
  args: {
    previousLabel: '이전',
    nextLabel: '다음',
    finishLabel: '완료',
    closeLabel: '닫기',
    formatProgress: (current, total) => `${total}단계 중 ${current}단계`,
  },
};
