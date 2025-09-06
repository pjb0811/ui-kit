import type { Meta, StoryObj } from '@storybook/nextjs';

import { Skeleton } from '@repo/ui';

const parseValue = (
  value: string | number | (string | number)[] | undefined,
): string | number | (string | number)[] | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'number' || Array.isArray(value)) {
    return value;
  }

  // 배열 형태의 문자열인지 확인 (예: "[200,300,250]" 또는 "['200px','300px']")
  if (
    typeof value === 'string' &&
    value.startsWith('[') &&
    value.endsWith(']')
  ) {
    try {
      // JSON.parse를 사용하여 배열로 변환
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // JSON 파싱 실패시 문자열 그대로 반환
    }
  }

  // 숫자로 변환 가능한지 확인
  const numValue = Number(value);

  if (!isNaN(numValue) && isFinite(numValue)) {
    return numValue;
  }

  return value;
};

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    active: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    avatar: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
    },
    count: {
      control: { type: 'number', min: 1, max: 10 },
    },
    gap: {
      control: { type: 'number', min: 0, max: 20 },
    },
    direction: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    width: {
      control: { type: 'text' },
    },
    height: {
      control: { type: 'text' },
    },
    classNames: { table: { disable: true } },
  },
  render: props => {
    const parsedProps = {
      ...props,
      width: parseValue(props.width),
      height: parseValue(props.height),
    };

    return (
      <Skeleton {...parsedProps}>실제 콘텐츠가 여기에 표시됩니다</Skeleton>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    active: false,
    loading: true,
    count: 3,
    size: 'default',
    direction: 'vertical',
    gap: 8,
  },
};
