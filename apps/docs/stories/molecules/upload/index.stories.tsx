'use client';

import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test';

import { Upload, type UploadFile } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Upload> = {
  title: 'Data Entry/Upload',
  component: Upload,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    multiple: {
      description: '여러 파일 업로드 허용 여부',
    },
    maxCount: {
      description: '최대 업로드 파일 수 (생략 시 무제한)',
    },
    accept: {
      description: '업로드 허용 MIME 타입',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: props => (
    <div className={cn('w-96')}>
      <Upload {...props} />
    </div>
  ),
};

export const SingleFile: Story = {
  args: {
    multiple: false,
    maxCount: 1,
  },
  render: props => (
    <div className={cn('w-96')}>
      <Upload {...props} />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [files, setFiles] = useState<UploadFile[]>([]);

    return (
      <div className={cn('w-96')}>
        <Upload value={files} onChange={setFiles} />
      </div>
    );
  },
};

const pngFile = (name: string, size: number) =>
  new File([new Uint8Array(size)], name, { type: 'image/png' });

// Fires the input's change event without awaiting anything in between, so
// each batch is added while the batches before it are still being read.
const addBatches = (input: HTMLInputElement, batches: File[][]) => {
  for (const batch of batches) {
    const transfer = new DataTransfer();

    batch.forEach(file => transfer.items.add(file));
    input.files = transfer.files;
    fireEvent.change(input);
  }
};

const listedNames = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll('[data-slot="upload"] li span'),
    span => span.textContent,
  );

export const OverlappingReads: Story = {
  name: 'Overlapping reads keep every file',
  render: () => (
    <div className={cn('w-96')}>
      <Upload />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;

    addBatches(input, [
      [pngFile('big.png', 8 * 1024 * 1024)],
      [pngFile('small.png', 8)],
    ]);

    await waitFor(() =>
      expect(listedNames(canvasElement)).toEqual(['big.png', 'small.png']),
    );

    // Removing a file while another read is in flight keeps the removal.
    addBatches(input, [[pngFile('late.png', 8 * 1024 * 1024)]]);
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Remove big.png' }),
    );
    await waitFor(() =>
      expect(listedNames(canvasElement)).toEqual(['small.png', 'late.png']),
    );
  },
};

export const OverlappingMaxCount: Story = {
  name: 'Overlapping reads respect maxCount',
  args: { maxCount: 3, onReject: fn() },
  render: props => (
    <div className={cn('w-96')}>
      <Upload {...props} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;

    addBatches(input, [
      [pngFile('a.png', 1024 * 1024), pngFile('b.png', 8)],
      [pngFile('c.png', 8), pngFile('d.png', 8)],
    ]);

    await waitFor(() =>
      expect(listedNames(canvasElement)).toEqual(['a.png', 'b.png', 'c.png']),
    );
    await expect(args.onReject).toHaveBeenCalledTimes(1);
    await expect(args.onReject).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'max-count' }),
    );
  },
};

export const Keyboard: Story = {
  name: 'Keyboard reaches the dropzone',
  render: () => (
    <div className={cn('w-96')}>
      <button type="button">Before</button>
      <Upload />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector('input[type="file"]')!;

    await userEvent.click(canvas.getByRole('button', { name: 'Before' }));
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(getComputedStyle(input).display).not.toBe('none');
  },
};

export const Disabled: Story = {
  name: 'Disabled blocks removal',
  args: {
    disabled: true,
    defaultValue: [{ uid: '1', name: 'a.png', url: '' }],
  },
  render: props => (
    <div className={cn('w-96')}>
      <Upload {...props} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Remove a.png' }),
    ).toBeDisabled();
  },
};

export const ExposesFile: Story = {
  name: 'Entries carry the original File',
  args: {
    onChange: fn(),
    defaultValue: [{ uid: 'existing', name: 'existing.png', url: '' }],
  },
  render: props => (
    <div className={cn('w-96')}>
      <Upload {...props} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
    const picked = pngFile('picked.png', 8);

    addBatches(input, [[picked]]);
    await waitFor(() => expect(args.onChange).toHaveBeenCalledTimes(1));

    const [files] = (args.onChange as ReturnType<typeof fn>).mock.calls[0]!;

    await expect(files).toHaveLength(2);
    await expect(files[0].file).toBeUndefined();
    await expect(files[1].file).toBe(picked);

    // An entry without a file still renders and can be removed.
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Remove existing.png',
      }),
    );
    await expect(listedNames(canvasElement)).toEqual(['picked.png']);
  },
};
