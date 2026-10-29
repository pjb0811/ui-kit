import { Image, Space } from '@repo/ui';

const svg = (fill: string, label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="${fill}"/><text x="320" y="190" font-family="sans-serif" font-size="32" text-anchor="middle" fill="#fff">${label}</text></svg>`,
  )}`;

export default function ImageDemo() {
  return (
    <Space align="start" wrap>
      <Image
        src={svg('#3b5871', 'Dashboard')}
        alt="Dashboard screenshot"
        width={240}
        height={135}
        preview={{ src: svg('#1f3446', 'Dashboard (large)') }}
      />
      <Image
        src="data:image/png;base64,invalid"
        alt="Missing attachment"
        width={240}
        height={135}
        preview
      />
    </Space>
  );
}
