import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';

import { Button, Config, ContextMenu, Drawer, Modal } from '@repo/ui';

const meta: Meta<typeof ContextMenu> = {
  title: 'Navigation/ContextMenu',
  component: ContextMenu,
  args: {
    children: 'Right click here or use Shift+F10',
    actionLabel: 'Actions',
    triggerProps: { 'aria-label': 'File actions' },
    onSelect: fn(),
    items: [
      { key: 'open', label: 'Open' },
      { key: 'copy', label: 'Copy' },
      { key: 'line', type: 'separator' },
      { key: 'delete', label: 'Delete', disabled: true },
    ],
  },
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
export const Disabled: Story = { args: { disabled: true } };
export const RTL: Story = { args: { triggerProps: { dir: 'rtl' } } };
export const LongLabels: Story = {
  args: {
    items: [
      {
        key: 'long',
        label:
          'A very long action label that should wrap within the viewport without overflowing the screen',
      },
    ],
  },
};
export const Dark: Story = {
  render: props => (
    <Config theme={{ dark: 'dark' }}>
      <ContextMenu {...props} />
    </Config>
  ),
};
export const Controlled: Story = {
  render: function Render(props) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <ContextMenu {...props} open={open} onOpenChange={setOpen} />
        <output>{String(open)}</output>
      </>
    );
  },
};
export const Multiple: Story = {
  render: props => (
    <>
      <ContextMenu {...props}>First file</ContextMenu>
      <ContextMenu {...props}>Second file</ContextMenu>
    </>
  ),
};
export const ImperativeClose: Story = {
  args: { onOpenChange: fn() },
  render: function Render(props) {
    const actionsRef = useRef<{
      close: () => void;
      unmount: () => void;
    } | null>(null);

    return (
      <>
        <ContextMenu {...props} actionsRef={actionsRef} />
        <Button onClick={() => actionsRef.current?.close()}>
          Close programmatically
        </Button>
      </>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
    await expect(await page.findByRole('menu')).toBeVisible();
    fireEvent.click(
      canvas.getByRole('button', { name: 'Close programmatically' }),
    );
    await expect(page.queryByRole('menu')).not.toBeInTheDocument();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'imperative-action' }),
    );
  },
};
export const InOverlays: Story = {
  render: function Render(props) {
    const [modal, setModal] = useState(false);
    const [drawer, setDrawer] = useState(false);
    return (
      <>
        <Button onClick={() => setModal(true)}>Modal</Button>
        <Button onClick={() => setDrawer(true)}>Drawer</Button>
        <Modal open={modal} onCancel={() => setModal(false)} title="File">
          <ContextMenu {...props} />
        </Modal>
        <Drawer open={drawer} onClose={() => setDrawer(false)} title="File">
          <ContextMenu {...props} />
        </Drawer>
      </>
    );
  },
};
export const Keyboard: Story = {
  args: { actionLabel: undefined, onOpenChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByLabelText('File actions');
    trigger.focus();
    await userEvent.keyboard('{Shift>}{F10}{/Shift}');
    // userEvent does not dispatch the browser's native contextmenu event.
    fireEvent.contextMenu(trigger, { button: 2 });
    await expect(await page.findByRole('menu')).toBeVisible();
    await userEvent.click(page.getByRole('menuitem', { name: 'Open' }));
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
    await expect(args.onSelect).toHaveBeenCalledWith('open', expect.anything());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
  },
};
export const ActionButton: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByLabelText('File actions');
    const action = canvas.getByRole('button', { name: 'Actions' });

    await expect(trigger).toHaveAttribute('tabindex', '-1');
    await expect(action).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(action);
    await expect(await page.findByRole('menu')).toBeVisible();
    await expect(action).toHaveAttribute('aria-expanded', 'true');
    await expect(action).toHaveAttribute(
      'aria-controls',
      page.getByRole('menu').id,
    );
    await userEvent.click(action);
    await expect(page.queryByRole('menu')).not.toBeInTheDocument();
    await expect(action).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(action);
    await expect(
      await page.findByRole('menuitem', { name: 'Delete' }),
    ).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Escape}');
    await expect(action).toHaveFocus();
    await userEvent.click(action);
    await userEvent.click(await page.findByRole('menuitem', { name: 'Open' }));
    await expect(args.onSelect).toHaveBeenCalledWith('open', expect.anything());
    await expect(action).toHaveFocus();
  },
};
export const ConfigRTL: Story = {
  render: props => (
    <Config direction="rtl">
      <ContextMenu {...props} />
    </Config>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Actions' }),
    );
    await expect(
      await within(canvasElement.ownerDocument.body).findByRole('menu'),
    ).toHaveAttribute('dir', 'rtl');
  },
};
