import { Space, Statistic } from '@repo/ui';

export default function StatisticDemo() {
  return (
    <Space wrap size="large" align="start">
      <Statistic title="Active accounts" value={12345} />
      <Statistic title="Completion" value={94.5} precision={1} suffix="%" />
      <Statistic title="Pending requests" value={0} />
    </Space>
  );
}
