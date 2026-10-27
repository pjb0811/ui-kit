import { Button, Popover, Space, Typography } from '@repo/ui';

const PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const;

export default function PopoverDemo() {
  return (
    <Space wrap size="middle">
      {PLACEMENTS.map(placement => (
        <Popover
          key={placement}
          placement={placement}
          title="Title"
          content={
            <Typography.Paragraph
              className="m-0 max-w-48 text-sm text-muted-foreground"
            >
              Some content inside the popover.
            </Typography.Paragraph>
          }
        >
          <Button>{placement}</Button>
        </Popover>
      ))}
    </Space>
  );
}
