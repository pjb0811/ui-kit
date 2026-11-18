import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import {
  Button,
  Config,
  DatePicker,
  Empty,
  Pagination,
  Switch,
  Upload,
  koKR,
} from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Config> = {
  title: 'Providers/Config',
  component: Config,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeToken: Story = {
  render: () => (
    <div className={cn('flex flex-col gap-4')}>
      <div className={cn('flex items-center gap-2')}>
        <Button>Default Theme</Button>
        <Switch />
      </div>

      <Config
        theme={{
          token: { colorPrimary: 'oklch(0.6 0.25 30)' },
        }}
      >
        <div className={cn('flex items-center gap-2')}>
          <Button>Red Primary</Button>
          <Switch />
        </div>
      </Config>

      <Config
        theme={{
          token: { colorPrimary: 'oklch(0.55 0.2 260)' },
        }}
      >
        <div className={cn('flex items-center gap-2')}>
          <Button>Blue Primary</Button>
          <Switch />
        </div>
      </Config>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className={cn('flex gap-4')}>
      <div className={cn('rounded-lg border p-4')}>
        <p className={cn('mb-2 text-sm')}>Light</p>
        <Button>Button</Button>
      </div>

      <Config theme={{ dark: 'dark' }}>
        <div
          className={cn('rounded-lg border bg-background p-4 text-foreground')}
        >
          <p className={cn('mb-2 text-sm')}>Dark</p>
          <Button>Button</Button>
        </div>
      </Config>
    </div>
  ),
};

export const SystemDarkMode: Story = {
  render: () => (
    <div className={cn('flex gap-4')}>
      <Config theme={{ dark: 'system' }}>
        <div
          className={cn('rounded-lg border bg-background p-4 text-foreground')}
        >
          <p className={cn('mb-2 text-sm')}>
            Follows prefers-color-scheme — toggle your OS/browser dark mode
            setting to see this update live.
          </p>
          <Button>Button</Button>
        </div>
      </Config>
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <Config theme={{ token: { colorPrimary: 'oklch(0.55 0.2 260)' } }}>
      <div className={cn('flex flex-col gap-4')}>
        <div className={cn('flex items-center gap-2')}>
          <Button>Blue (Parent)</Button>
          <Switch />
        </div>

        <Config theme={{ token: { colorPrimary: 'oklch(0.6 0.2 150)' } }}>
          <div className={cn('flex items-center gap-2')}>
            <Button>Green (Child)</Button>
            <Switch />
          </div>
        </Config>
      </div>
    </Config>
  ),
};

/**
 * `fontSans`/`fontMono` override the app's own font variables for everything
 * inside the `Config`. Leaving them unset keeps whatever font the host app
 * already set, so this is purely additive.
 */
export const FontToken: Story = {
  render: () => (
    <div className={cn('flex flex-col gap-4')}>
      <p className={cn('font-mono text-sm')}>Default mono (app font)</p>

      <Config theme={{ token: { fontMono: 'ui-serif, Georgia, serif' } }}>
        <p className={cn('font-mono text-sm')}>Overridden via token.fontMono</p>
      </Config>

      <p className={cn('font-mono text-sm')}>
        Sibling outside Config is unaffected
      </p>
    </div>
  ),
};

const LocaleSample = () => (
  <div className={cn('flex flex-col items-start gap-4')}>
    <Pagination total={30} />
    <Empty />
    <Upload />
    <DatePicker value={new Date(2026, 0, 5)} />
  </div>
);

export const DefaultLocale: Story = {
  render: () => <LocaleSample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Without a Config, built-in text is English.
    await expect(
      canvas.getByRole('navigation', { name: 'Pagination' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Next page' }),
    ).toBeVisible();
    await expect(canvas.getByText('No data')).toBeVisible();
    await expect(
      canvas.getByText('Click or drag files to upload'),
    ).toBeVisible();
    await expect(canvas.getByText('January 5th, 2026')).toBeVisible();
  },
};

export const KoreanLocale: Story = {
  render: () => (
    <Config locale={koKR}>
      <LocaleSample />
    </Config>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('navigation', { name: '페이지 탐색' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: '다음 페이지' }),
    ).toBeVisible();
    await expect(canvas.getByText('데이터 없음')).toBeVisible();
    await expect(
      canvas.getByText('클릭하거나 파일들을 끌어 놓아 업로드'),
    ).toBeVisible();
    // The date is formatted with koKR's date-fns locale.
    await expect(canvas.getByText('2026년 1월 5일')).toBeVisible();
  },
};

export const PartialLocaleGroup: Story = {
  render: () => (
    <Config locale={{ Pagination: { next: 'Forward' } }}>
      <Config locale={{ Pagination: { previous: 'Backward' } }}>
        <Pagination total={30} defaultPage={2} />
      </Config>
    </Config>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Nested Configs merge a group key by key; the rest stays English.
    await expect(canvas.getByRole('button', { name: 'Forward' })).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Backward' }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Page 1' })).toBeVisible();
  },
};

export const PropOverridesLocale: Story = {
  render: () => (
    <Config locale={koKR}>
      <Pagination total={30} labels={{ next: 'Custom next' }} />
    </Config>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // A component prop still wins over the locale.
    await expect(
      canvas.getByRole('button', { name: 'Custom next' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: '이전 페이지' }),
    ).toBeVisible();
  },
};
