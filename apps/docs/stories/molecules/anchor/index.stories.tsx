import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  expect,
  fireEvent,
  fn,
  spyOn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test';

import { Anchor, type AnchorItem, Config } from '@repo/ui';

const meta: Meta<typeof Anchor> = {
  title: 'UI/Anchor',
  component: Anchor,
  args: {
    current: '#details',
    onChange: fn(),
    onSelect: fn(),
    items: [
      { key: 'intro', href: '#intro', title: 'Introduction' },
      { key: 'details', href: '#details', title: 'Details' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole('navigation', { name: 'On this page' }),
    ).toBeVisible();
    expect(canvas.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(canvas.getByRole('link', { name: 'Introduction' })).toHaveAttribute(
      'href',
      '#intro',
    );
  },
};
export const Nested: Story = {
  args: {
    items: [
      {
        key: 'intro',
        href: '#intro',
        title: 'Introduction',
        children: [{ key: 'details', href: '#details', title: 'Details' }],
      },
    ],
  },
};

const HEADER_HEIGHT = 40;

const sectionItems = [
  { key: 'intro', href: '#sc-intro', title: 'Introduction' },
  {
    key: 'usage',
    href: '#sc-usage',
    title: 'Usage',
    children: [{ key: 'usage-props', href: '#sc-usage-props', title: 'Props' }],
  },
  { key: 'api', href: '#sc-api', title: 'API' },
  { key: 'missing', href: '#sc-missing', title: 'Missing section' },
] as const;

// A scroll container with a sticky header; `offset` keeps sections clear of it.
function ScrollingPage(args: React.ComponentProps<typeof Anchor>) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex gap-4">
      <Anchor
        {...args}
        container={container}
        offset={HEADER_HEIGHT}
        items={sectionItems}
      />
      <div
        ref={setContainer}
        data-testid="scroller"
        className="relative h-52 w-72 overflow-y-auto border"
      >
        <div
          className="sticky top-0 z-10 border-b bg-background"
          style={{ height: HEADER_HEIGHT }}
        >
          Header
        </div>
        {['intro', 'usage', 'usage-props', 'api'].map(id => (
          <section key={id} id={`sc-${id}`} className="h-72 p-2">
            {id}
          </section>
        ))}
      </div>
    </div>
  );
}

const linkFor = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('link', { name });

const expectCurrent = (canvasElement: HTMLElement, name: string) =>
  waitFor(() =>
    expect(linkFor(canvasElement, name)).toHaveAttribute(
      'aria-current',
      'location',
    ),
  );

const sectionOffset = (canvasElement: HTMLElement, id: string) => {
  const scroller = within(canvasElement).getByTestId('scroller');
  const section = canvasElement.ownerDocument.getElementById(id)!;

  return (
    section.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top -
    scroller.clientTop
  );
};

export const ScrollContainer: Story = {
  args: { current: undefined, updateHash: false },
  render: args => <ScrollingPage {...args} />,
  play: async ({ args, canvasElement }) => {
    const scroller = within(canvasElement).getByTestId('scroller');

    await expectCurrent(canvasElement, 'Introduction');

    // Manual scrolling highlights the last section whose top passed the header.
    scroller.scrollTop =
      sectionOffset(canvasElement, 'sc-usage-props') - HEADER_HEIGHT;
    await expectCurrent(canvasElement, 'Props');
    await expect(args.onChange).toHaveBeenLastCalledWith('#sc-usage-props');

    scroller.scrollTop = 0;
    await expectCurrent(canvasElement, 'Introduction');
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
};

export const LinkActivation: Story = {
  args: { current: undefined, updateHash: false },
  render: args => <ScrollingPage {...args} />,
  play: async ({ args, canvasElement }) => {
    const onChange = args.onChange as ReturnType<typeof fn>;
    const onSelect = args.onSelect as ReturnType<typeof fn>;

    await userEvent.click(linkFor(canvasElement, 'API'));
    await expectCurrent(canvasElement, 'API');
    // The section lands right below the sticky header.
    await expect(Math.round(sectionOffset(canvasElement, 'sc-api'))).toBe(
      HEADER_HEIGHT,
    );
    await expect(onChange).toHaveBeenCalledWith('#sc-api');
    await expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ href: '#sc-api' }),
    );
    // onChange reports the new location before onSelect reports the activation.
    const apiChange = onChange.mock.calls.findIndex(
      ([href]) => href === '#sc-api',
    );

    await expect(
      onChange.mock.invocationCallOrder[apiChange] ?? Infinity,
    ).toBeLessThan(onSelect.mock.invocationCallOrder[0] ?? -Infinity);

    linkFor(canvasElement, 'Usage').focus();
    await userEvent.keyboard('{Enter}');
    await expectCurrent(canvasElement, 'Usage');
    await expect(Math.round(sectionOffset(canvasElement, 'sc-usage'))).toBe(
      HEADER_HEIGHT,
    );
    await expect(onSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ href: '#sc-usage' }),
    );
  },
};

export const MissingTarget: Story = {
  args: { current: undefined, updateHash: false },
  render: args => <ScrollingPage {...args} />,
  play: async ({ args, canvasElement }) => {
    const view = canvasElement.ownerDocument.defaultView!;
    const scroller = within(canvasElement).getByTestId('scroller');
    let defaultPrevented: boolean | undefined;
    // Runs after Anchor's handler: record whether it took over the click, then
    // stop the test page from following the link.
    const stopNavigation = (event: MouseEvent) => {
      defaultPrevented = event.defaultPrevented;
      event.preventDefault();
    };

    await expectCurrent(canvasElement, 'Introduction');
    view.addEventListener('click', stopNavigation);

    try {
      await userEvent.click(linkFor(canvasElement, 'Missing section'));
    } finally {
      view.removeEventListener('click', stopNavigation);
    }

    // A link without a target keeps native link behavior and changes nothing.
    await expect(defaultPrevented).toBe(false);
    await expect(scroller.scrollTop).toBe(0);
    await expect(args.onSelect).not.toHaveBeenCalled();
    await expect(linkFor(canvasElement, 'Introduction')).toHaveAttribute(
      'aria-current',
      'location',
    );
  },
};

export const HashUpdate: Story = {
  args: { current: undefined },
  render: args => <ScrollingPage {...args} />,
  play: async ({ canvasElement }) => {
    const { history, location } = canvasElement.ownerDocument.defaultView!;
    const initialUrl = location.href;
    const initialLength = history.length;

    await userEvent.click(linkFor(canvasElement, 'API'));
    await expect(location.hash).toBe('#sc-api');
    await expect(history.length).toBe(initialLength + 1);

    // Activating the current link again doesn't add another history entry.
    await userEvent.click(linkFor(canvasElement, 'API'));
    await expect(history.length).toBe(initialLength + 1);
    history.replaceState(history.state, '', initialUrl);
  },
};

export const ReducedMotion: Story = {
  args: { current: undefined, updateHash: false, smooth: true },
  render: args => <ScrollingPage {...args} />,
  play: async ({ canvasElement }) => {
    const view = canvasElement.ownerDocument.defaultView!;
    const scroller = within(canvasElement).getByTestId('scroller');
    const scrollTo = spyOn(scroller, 'scrollTo');
    const matchMedia = spyOn(view, 'matchMedia');

    try {
      matchMedia.mockImplementation(
        query =>
          ({ matches: false, media: query }) as unknown as MediaQueryList,
      );
      await userEvent.click(linkFor(canvasElement, 'API'));
      await expect(scrollTo).toHaveBeenLastCalledWith(
        expect.objectContaining({ behavior: 'smooth' }),
      );

      matchMedia.mockImplementation(
        query =>
          ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
          }) as unknown as MediaQueryList,
      );
      await userEvent.click(linkFor(canvasElement, 'Usage'));
      await expect(scrollTo).toHaveBeenLastCalledWith(
        expect.objectContaining({ behavior: 'auto' }),
      );
    } finally {
      matchMedia.mockRestore();
      scrollTo.mockRestore();
    }
  },
};

export const ListenerCleanup: Story = {
  args: { current: undefined },
  render: function Render(args) {
    const [mounted, setMounted] = useState(false);

    return (
      <div className="flex flex-col items-start gap-2">
        <button type="button" onClick={() => setMounted(value => !value)}>
          {mounted ? 'Unmount' : 'Mount'}
        </button>
        {mounted && <Anchor {...args} />}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const view = canvasElement.ownerDocument.defaultView!;
    const add = spyOn(view, 'addEventListener');
    const remove = spyOn(view, 'removeEventListener');

    try {
      await userEvent.click(canvas.getByRole('button', { name: 'Mount' }));
      await expect(canvas.getByRole('navigation')).toBeVisible();

      const added = add.mock.calls.filter(([type]) =>
        ['scroll', 'resize'].includes(type),
      );

      await expect(added.map(([type]) => type).sort()).toEqual([
        'resize',
        'scroll',
      ]);

      await userEvent.click(canvas.getByRole('button', { name: 'Unmount' }));
      await expect(canvas.queryByRole('navigation')).not.toBeInTheDocument();

      // Effect cleanup can run after the click resolves.
      await waitFor(() =>
        expect(
          added.map(([type, listener]) =>
            remove.mock.calls.some(
              ([removedType, removedListener]) =>
                removedType === type && removedListener === listener,
            ),
          ),
        ).toEqual([true, true]),
      );
    } finally {
      add.mockRestore();
      remove.mockRestore();
    }
  },
};

const nestedItems: AnchorItem[] = [
  {
    key: 'intro',
    href: '#intro',
    title: 'Introduction',
    children: [{ key: 'details', href: '#details', title: 'Details' }],
  },
  { key: 'api', href: '#api', title: 'API' },
];

export const RTL: Story = {
  args: { items: nestedItems },
  render: props => (
    <Config direction="rtl">
      <Anchor {...props} />
    </Config>
  ),
};
export const Dark: Story = {
  args: { items: nestedItems },
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <div className="bg-background p-4 text-foreground">
        <Anchor {...props} />
      </div>
    </Config>
  ),
};

const shortItems: AnchorItem[] = [
  { key: 'one', href: '#short-one', title: 'One' },
  { key: 'two', href: '#short-two', title: 'Two' },
  { key: 'three', href: '#short-three', title: 'Three' },
];

// The last section is shorter than the scroller, so its top can never reach
// the scroller's top edge.
const ShortLastSection = (args: React.ComponentProps<typeof Anchor>) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex gap-4">
      <Anchor {...args} items={shortItems} container={container} />
      <div
        ref={setContainer}
        data-testid="short-scroller"
        className="h-64 flex-1 overflow-auto border"
      >
        {shortItems.map((item, index) => (
          <section
            key={item.key}
            id={item.href.slice(1)}
            style={{ height: index === 2 ? 80 : 400 }}
          >
            {item.title}
          </section>
        ))}
      </div>
    </div>
  );
};

const expectThreeStaysCurrent = async (canvasElement: HTMLElement) => {
  const three = linkFor(canvasElement, 'Three');

  await userEvent.click(three);

  // Sample through the scroll and after it settles.
  for (const delay of [0, 50, 250, 1250]) {
    await new Promise(resolve => setTimeout(resolve, delay));
    await expect(three).toHaveAttribute('aria-current', 'location');
  }
};

export const ShortLastSectionClick: Story = {
  args: { current: undefined, updateHash: false },
  render: args => <ShortLastSection {...args} />,
  play: async ({ args, canvasElement }) => {
    await expectThreeStaysCurrent(canvasElement);
    await expect(args.onChange).toHaveBeenLastCalledWith('#short-three');
    await expect(args.onChange).not.toHaveBeenCalledWith('#short-two');
    // The click reports its link once.
    await expect(
      (args.onChange as ReturnType<typeof fn>).mock.calls.filter(
        ([href]) => href === '#short-three',
      ),
    ).toHaveLength(1);

    // Scrolling back up by hand tracks the scroll position again.
    within(canvasElement).getByTestId('short-scroller').scrollTop = 0;
    await expectCurrent(canvasElement, 'One');
  },
};

export const ShortLastSectionSmoothClick: Story = {
  args: { current: undefined, updateHash: false, smooth: true },
  render: args => <ShortLastSection {...args} />,
  play: async ({ args, canvasElement }) => {
    await expectThreeStaysCurrent(canvasElement);
    await expect(args.onChange).toHaveBeenLastCalledWith('#short-three');
    await expect(args.onChange).not.toHaveBeenCalledWith('#short-two');
  },
};

export const ShortLastSectionManualScroll: Story = {
  args: { current: undefined, updateHash: false },
  render: args => <ShortLastSection {...args} />,
  play: async ({ canvasElement }) => {
    const scroller = within(canvasElement).getByTestId('short-scroller');

    scroller.scrollTop = scroller.scrollHeight;
    await expectCurrent(canvasElement, 'Three');
  },
};

export const SmoothClickThenWheel: Story = {
  args: { current: undefined, updateHash: false, smooth: true },
  render: args => <ShortLastSection {...args} />,
  play: async ({ canvasElement }) => {
    const scroller = within(canvasElement).getByTestId('short-scroller');

    await userEvent.click(linkFor(canvasElement, 'Three'));
    // The wheel hands scrolling back to the user before the smooth scroll ends.
    fireEvent.wheel(scroller, { deltaY: -100 });
    scroller.scrollTo({ top: 0, behavior: 'instant' });
    await expectCurrent(canvasElement, 'One');
  },
};
