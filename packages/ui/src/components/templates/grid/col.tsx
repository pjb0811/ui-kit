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

// Mobile-first cascade, run once per breakpoint tier (not just the
// "current" one) — each tier's entry is what a `<Col span={24} md={12} />`
// effectively resolves to *at and above* that tier, letting each defined
// prop override the last. `globals.css`'s `[data-slot='col']` rules read
// one of these six values per tier, switched by a real `@media` query —
// see the comment on the returned CSS custom properties below for why.
const resolveEffectiveValuesByTier = (
  span: number,
  offset: number,
  responsiveProps: Partial<Record<Breakpoint, ColSpanProp | undefined>>,
) => {
  let effectiveSpan = span;
  let effectiveOffset = offset;
  const spans = {} as Record<Breakpoint, number>;
  const offsets = {} as Record<Breakpoint, number>;

  for (const bp of BREAKPOINT_ORDER) {
    const resolved = resolveColSpan(responsiveProps[bp]);

    if (resolved?.span !== undefined) {
      effectiveSpan = resolved.span;
    }
    if (resolved?.offset !== undefined) {
      effectiveOffset = resolved.offset;
    }

    spans[bp] = effectiveSpan;
    offsets[bp] = effectiveOffset;
  }

  return { spans, offsets };
};

// 24-column system (matches Ant Design's Row/Col, a familiar mental model
// for anyone coming from it). The actual `flex-basis`/`max-width`/
// `margin-left` math lives in `globals.css` (`[data-slot='col']`), driven
// by real `@media` queries — this component's only job is resolving each
// breakpoint tier's effective span/offset (pure prop math, no `window`
// access) and handing them over as CSS custom properties. That's what
// makes the responsive behavior work from the very first (server-rendered)
// paint: previously this picked one "current" tier via `useResponsiveSize`
// (which measures the viewport client-side, so it can't know the real
// value until after mount) and baked only *that* into an inline style,
// so SSR output — and the first client paint, before that measurement
// effect ran — was always the same-as-`useResponsiveSize`'s SSR-safe 'xs'
// guess, regardless of the real viewport. Handing over all six tiers and
// letting CSS pick lets the browser resolve the right one immediately,
// with no JS and no resize listener needed at all.
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
  const { gutterX } = useRowContext();

  const responsiveProps: Partial<Record<Breakpoint, ColSpanProp | undefined>> =
    { xs, sm, md, lg, xl, '2xl': xxl };

  const { spans, offsets } = resolveEffectiveValuesByTier(
    span,
    offset,
    responsiveProps,
  );

  const cssVars = {
    '--col-span-xs': spans.xs,
    '--col-span-sm': spans.sm,
    '--col-span-md': spans.md,
    '--col-span-lg': spans.lg,
    '--col-span-xl': spans.xl,
    '--col-span-2xl': spans['2xl'],
    '--col-offset-xs': offsets.xs,
    '--col-offset-sm': offsets.sm,
    '--col-offset-md': offsets.md,
    '--col-offset-lg': offsets.lg,
    '--col-offset-xl': offsets.xl,
    '--col-offset-2xl': offsets['2xl'],
  } as React.CSSProperties;

  return (
    <div
      data-slot="col"
      className={cn('box-border shrink-0 grow-0', className)}
      style={{
        ...cssVars,
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
