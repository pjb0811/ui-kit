import { Button, Space, Tooltip } from '@repo/ui';

const PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const;

export default function TooltipDemo() {
  return (
    <Space wrap size="middle">
      {PLACEMENTS.map(placement => (
        <Tooltip
          key={placement}
          placement={placement}
          content={`Tooltip on ${placement}`}
        >
          <Button>{placement}</Button>
        </Tooltip>
      ))}
    </Space>
  );
}
