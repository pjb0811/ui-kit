import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Splitter, Typography } from '@repo/ui';
import { cn } from '@repo/ui/utils';

const meta: Meta<typeof Splitter> = {
  title: 'UI/Splitter',
  component: Splitter,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    withHandle: {
      control: { type: 'boolean' },
    },
    children: {
      table: { disable: true },
    },
    onResize: {
      action: 'resize',
    },
    onResizeEnd: {
      action: 'resizeEnd',
    },
  },
  render: props => (
    <div className="h-105 w-full bg-neutral-50 p-6">
      <Splitter {...props}>
        <Splitter.Panel defaultSize="28%" minSize="20%">
          <DemoPanel
            title="Navigator"
            description="탐색 패널은 최소 너비를 유지하면서도 자유롭게 리사이즈할 수 있습니다."
            tone="sand"
          />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="44%" minSize="30%">
          <DemoPanel
            title="Canvas"
            description="중앙 작업 영역은 여유 있는 기본 비율을 갖도록 설정했습니다."
            tone="white"
          />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="28%" minSize="20%">
          <DemoPanel
            title="Inspector"
            description="우측 패널은 속성 편집이나 미리보기 같은 보조 영역에 적합합니다."
            tone="slate"
          />
        </Splitter.Panel>
      </Splitter>
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

type DemoPanelProps = {
  title: string;
  description: string;
  tone?: 'white' | 'sand' | 'slate';
};

const panelToneClassName: Record<
  NonNullable<DemoPanelProps['tone']>,
  string
> = {
  white: 'border-white/80 bg-white',
  sand: 'border-amber-200/80 bg-amber-50',
  slate: 'border-slate-200/80 bg-slate-100',
};

const DemoPanel = ({ title, description, tone = 'white' }: DemoPanelProps) => {
  return (
    <div
      className={cn(
        `flex h-full flex-col justify-between
        rounded-[calc(var(--radius-lg)-2px)] border p-5`,
        panelToneClassName[tone],
      )}
    >
      <div className="space-y-3">
        <Typography.Text
          className="text-xs font-semibold tracking-[0.24em] text-neutral-500
            uppercase"
        >
          Workspace
        </Typography.Text>
        <Typography.Title className="text-2xl font-semibold text-neutral-900">
          {title}
        </Typography.Title>
        <Typography.Paragraph className="text-sm leading-6 text-neutral-600">
          {description}
        </Typography.Paragraph>
      </div>
      <div className="grid gap-2">
        <div className="h-3 rounded-full bg-neutral-900/10" />
        <div className="h-3 w-4/5 rounded-full bg-neutral-900/10" />
        <div className="h-3 w-3/5 rounded-full bg-neutral-900/10" />
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    withHandle: true,
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    withHandle: true,
  },
  render: props => (
    <div className="h-130 w-full bg-neutral-50 p-6">
      <Splitter {...props}>
        <Splitter.Panel defaultSize="24%" minSize="18%">
          <DemoPanel
            title="Toolbar"
            description="상단 패널은 빠른 액션과 필터를 배치하기 좋은 얕은 영역입니다."
            tone="sand"
          />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="50%" minSize="32%">
          <DemoPanel
            title="Preview"
            description="세로 방향 분할은 미리보기와 에디터를 위아래로 배치할 때 유용합니다."
            tone="white"
          />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="26%" minSize="18%">
          <DemoPanel
            title="Console"
            description="하단 패널에는 로그나 디버그 출력을 두기 좋습니다."
            tone="slate"
          />
        </Splitter.Panel>
      </Splitter>
    </div>
  ),
};

export const Collapsible: Story = {
  args: {
    orientation: 'horizontal',
    withHandle: true,
  },
  render: props => (
    <div className="h-105 w-full bg-neutral-50 p-6">
      <Splitter {...props}>
        <Splitter.Panel
          collapsible
          defaultSize="22%"
          minSize="12%"
          collapsedSize="0%"
        >
          <DemoPanel
            title="Sidebar"
            description="좌측 패널은 접기 가능한 보조 영역으로 두어 작업 영역을 넓힐 수 있습니다."
            tone="sand"
          />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="56%" minSize="36%">
          <DemoPanel
            title="Editor"
            description="중앙 패널은 기본 작업 공간으로 상대적으로 큰 비율을 갖습니다."
            tone="white"
          />
        </Splitter.Panel>
        <Splitter.Panel
          collapsible
          defaultSize="22%"
          minSize="12%"
          collapsedSize="0%"
        >
          <DemoPanel
            title="Outline"
            description="우측 패널도 접을 수 있게 두면 작은 화면에서 더 유연하게 쓸 수 있습니다."
            tone="slate"
          />
        </Splitter.Panel>
      </Splitter>
    </div>
  ),
};
