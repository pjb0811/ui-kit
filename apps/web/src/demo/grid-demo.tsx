import { Col, Row } from '@repo/ui';

const cell =
  'rounded-md bg-blue-500 py-3 text-center text-white dark:bg-blue-600';

export default function GridDemo() {
  return (
    <div className="w-full space-y-3">
      <Row gutter={16}>
        <Col span={12}>
          <div className={cell}>span 12</div>
        </Col>
        <Col span={12}>
          <div className={cell}>span 12</div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24} md={8}>
          <div className={cell}>24 / md 8</div>
        </Col>
        <Col span={24} md={8}>
          <div className={cell}>24 / md 8</div>
        </Col>
        <Col span={24} md={8}>
          <div className={cell}>24 / md 8</div>
        </Col>
      </Row>
    </div>
  );
}
