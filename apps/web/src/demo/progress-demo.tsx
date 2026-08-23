import { Progress, Space, Typography } from '@repo/ui';

const VALUES = [25, 50, 75, 100] as const;

export default function ProgressDemo() {
  return (
    <Space
      orientation="vertical"
      align="start"
      size="middle"
      className="w-full"
    >
      {VALUES.map(value => (
        <Space key={value} align="center" size="small" className="w-full">
          <Progress value={value} />
          <Typography.Text
            className="text-muted-foreground w-10 text-right text-sm"
          >
            {value}%
          </Typography.Text>
        </Space>
      ))}
      <Space align="end" size="middle">
        {VALUES.map(value => (
          <div key={value} className="h-32">
            <Progress value={value} direction="vertical" />
          </div>
        ))}
      </Space>
    </Space>
  );
}
