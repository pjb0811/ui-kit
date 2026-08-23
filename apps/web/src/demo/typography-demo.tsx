import { Space, Typography } from '@repo/ui';

export default function TypographyDemo() {
  return (
    <Space orientation="vertical" align="start" size="middle">
      <Typography.Title level={3}>Title level=3</Typography.Title>
      <Typography.Paragraph>
        A <Typography.Text strong>strong</Typography.Text>,{' '}
        <Typography.Text underline>underlined</Typography.Text>, and a{' '}
        <Typography.Link
          href="https://github.com/pjb0811/ui-kit"
          target="_blank"
        >
          link
        </Typography.Link>{' '}
        inside a paragraph.
      </Typography.Paragraph>
    </Space>
  );
}
