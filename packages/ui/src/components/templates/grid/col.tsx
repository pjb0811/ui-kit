'use client';

import { cn } from '@repo/ui/utils';

import { type Breakpoint, useRowContext } from './row-context';

const TOTAL_COLUMNS = 24;

const BREAKPOINT_ORDER: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

interface ResponsiveColSpan {
  span?: number;
  offset?: number;
}

type ColSpanProp = number | ResponsiveColSpan;

export interface Props extends React.ComponentProps<'div'> {
  span?: number;
  offset?: number;
  xs?: ColSpanProp;
  sm?: ColSpanProp;
  md?: ColSpanProp;
  lg?: ColSpanProp;
  xl?: ColSpanProp;
  '2xl'?: ColSpanProp;
}

const resolveColSpan = (value: ColSpanProp | undefined) =>
  typeof value === 'number' ? { span: value } : value;

// 24-column system (matches Ant Design's Row/Col, a familiar mental model
// for anyone coming from it) implemented with plain percentage widths
// rather than Tailwind's col-span-* utilities — those utilities need a
// literal, statically-scannable class per (breakpoint, span) combination,
// and 6 breakpoints x 24 spans is 144 combinations, most of which would
// never be used. Percentage math scales to any span/breakpoint
// combination with one code path instead.
const Col = ({
  span = TOTAL_COLUMNS,
  offset = 0,
  xs,
  sm,
  md,
  lg,
  xl,
  '2xl': xxl,
  className,
  style,
  children,
  ...props
}: Props) => {
  const { gutterX, breakpoint } = useRowContext();

  const responsiveProps: Partial<Record<Breakpoint, ColSpanProp | undefined>> =
    { xs, sm, md, lg, xl, '2xl': xxl };

  let effectiveSpan = span;
  let effectiveOffset = offset;

  // Mobile-first cascade: walk breakpoints up to (and including) the
  // current one, letting each defined prop override the last — so
  // `<Col span={24} md={12} />` is 24 below md and 12 from md upward, with
  // no need to also specify lg/xl/2xl for the value to keep applying.
  for (const bp of BREAKPOINT_ORDER) {
    if (BREAKPOINT_ORDER.indexOf(bp) > BREAKPOINT_ORDER.indexOf(breakpoint)) {
      break;
    }

    const resolved = resolveColSpan(responsiveProps[bp]);

    if (resolved?.span !== undefined) {
      effectiveSpan = resolved.span;
    }
    if (resolved?.offset !== undefined) {
      effectiveOffset = resolved.offset;
    }
  }

  const widthPercent = (effectiveSpan / TOTAL_COLUMNS) * 100;
  const offsetPercent = (effectiveOffset / TOTAL_COLUMNS) * 100;

  return (
    <div
      className={cn('box-border shrink-0 grow-0', className)}
      style={{
        flexBasis: `${widthPercent}%`,
        maxWidth: `${widthPercent}%`,
        marginLeft: offsetPercent ? `${offsetPercent}%` : undefined,
        paddingLeft: gutterX ? gutterX / 2 : undefined,
        paddingRight: gutterX ? gutterX / 2 : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Col;
