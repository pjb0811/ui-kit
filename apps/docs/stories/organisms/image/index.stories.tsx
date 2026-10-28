import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Button, Image, Skeleton } from '@repo/ui';

const svg = (fill: string, label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="${fill}"/><text x="320" y="190" font-family="sans-serif" font-size="32" text-anchor="middle" fill="#fff">${label}</text></svg>`,
  )}`;

const screenshot = svg('#3b5871', 'Dashboard');
const largeScreenshot = svg('#1f3446', 'Dashboard (large)');
const brokenSource = 'data:image/png;base64,invalid';

const meta: Meta<typeof Image> = {
  title: 'Data Display/Image',
  component: Image,
  parameters: { layout: 'centered' },
  args: {
    src: screenshot,
    alt: 'Dashboard screenshot',
    width: 320,
    height: 180,
  },
  argTypes: {
    loading: { control: 'select', options: ['eager', 'lazy'] },
    classNames: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const rootOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="image"]')!;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(rootOf(canvasElement)).toHaveAttribute('data-status', 'loaded'),
    );
    await expect(
      canvas.getByRole('img', { name: 'Dashboard screenshot' }),
    ).toBeVisible();
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

export const Preview: Story = {
  args: { preview: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', {
      name: '미리보기: Dashboard screenshot',
    });

    await userEvent.click(trigger);

    const dialog = await body.findByRole('dialog', {
      name: 'Dashboard screenshot',
    });

    await expect(
      within(dialog).getByRole('img', { name: 'Dashboard screenshot' }),
    ).toHaveAttribute('src', screenshot);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await body.findByRole('dialog');
    await userEvent.click(body.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
};

export const PreviewSource: Story = {
  args: {
    preview: {
      src: largeScreenshot,
      title: 'Dashboard, October release',
      label: 'Enlarge the dashboard screenshot',
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Enlarge the dashboard screenshot',
      }),
    );

    const dialog = await body.findByRole('dialog', {
      name: 'Dashboard, October release',
    });

    await expect(within(dialog).getByRole('img')).toHaveAttribute(
      'src',
      largeScreenshot,
    );
    await userEvent.keyboard('{Escape}');
  },
};

export const Failed: Story = {
  args: { src: brokenSource, preview: true, onError: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(rootOf(canvasElement)).toHaveAttribute('data-status', 'error'),
    );
    await expect(
      canvas.getByRole('img', { name: 'Dashboard screenshot' }),
    ).toBeVisible();
    await expect(canvasElement.querySelector('img')).toBeNull();
    // The fallback keeps the size given to the image.
    await expect(
      canvas.getByRole('img', { name: 'Dashboard screenshot' }),
    ).toHaveStyle({ width: '320px', height: '180px' });
    // A failed image offers no preview.
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(args.onError).toHaveBeenCalledTimes(1);
  },
};

export const CustomFallback: Story = {
  args: {
    src: brokenSource,
    fallback: <span className="text-sm">Screenshot unavailable</span>,
  },
};

export const Placeholder: Story = {
  args: {
    src: 'https://example.invalid/slow-image.png',
    placeholder: <Skeleton className="size-full" />,
  },
};

export const Decorative: Story = {
  args: { alt: '', preview: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // A decorative image is hidden from assistive technology and gets no
    // preview control without an explicit label.
    await expect(canvas.queryByRole('img')).toBeNull();
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

export const DecorativeWithLabel: Story = {
  args: { alt: '', preview: { label: 'Open the background image' } },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Open the background image',
      }),
    );
    const dialog = await body.findByRole('dialog', {
      name: 'Open the background image',
    });

    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard('{Escape}');
  },
};

export const Controlled: Story = {
  render: function Render(props) {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-start gap-3">
        <Button onClick={() => setOpen(true)}>Open from outside</Button>
        <span data-testid="open-state">{open ? 'open' : 'closed'}</span>
        <Image {...props} preview={{ open, onOpenChange: setOpen }} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Open from outside' }),
    );
    await body.findByRole('dialog', { name: 'Dashboard screenshot' });
    await expect(canvas.getByTestId('open-state')).toHaveTextContent('open');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByTestId('open-state')).toHaveTextContent('closed');
  },
};

export const ResponsiveSource: Story = {
  args: {
    srcSet: `${screenshot} 1x, ${largeScreenshot} 2x`,
    loading: 'lazy',
    decoding: 'async',
  },
  play: async ({ canvasElement }) => {
    const image = within(canvasElement).getByRole('img');

    await expect(image).toHaveAttribute('loading', 'lazy');
    await expect(image).toHaveAttribute('decoding', 'async');
    await expect(image.getAttribute('srcset')).toContain('2x');
  },
};
