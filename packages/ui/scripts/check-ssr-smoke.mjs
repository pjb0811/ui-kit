#!/usr/bin/env node
// SSR smoke test + rendered-output contracts (Phase 3 regression net,
// ui-kit#294; extended for #301).
//
// Server-renders every exported component (wrapped in <Config>) with minimal
// valid props, then asserts three things on the result:
//
//   1. It renders without throwing. Catches the "works in the browser,
//      explodes / diverges on the server" class (ui-kit#228) — a `'use client'`
//      component touching `window`/`document` at render, an SSR-unsafe hook, an
//      unguarded portal — none of which type-check or lint catch.
//
//   2. data-slot contract (#301): every `[data-slot='X']` selector in
//      globals.css must have a matching `data-slot="X"` in some component's
//      rendered output. globals.css keys 20+ style rules (button colors, the
//      non-Tailwind-host reset) off these attributes; if an atom stops emitting
//      one — e.g. the Button/Tag absorb in Phase 4 (#278 ③) drops it — those
//      rules silently no-op (danger stops being red, presets lose their fill)
//      and nothing else in CI notices. Derived from globals.css, so a new
//      `[data-slot='…']` rule is covered automatically.
//
//   3. a11y/state chassis (#301): Button and Tag must keep their focus-ring /
//      aria-invalid (and, for Button, disabled) classes in the rendered markup.
//      That chassis lives in core's cva base string today; the Phase 4 absorb
//      must carry it into the atom. Asserted per-component because Tag's chassis
//      is a strict subset of Button's (a Tag isn't disableable) — a single
//      shared list would false-positive on Tag.
//
// Run after `build`, via the css-stub loader (Swiper imports `.css`):
//   node --import ./scripts/loaders/css-stub.mjs scripts/check-ssr-smoke.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import * as ui from '../dist/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GLOBALS_CSS = path.join(__dirname, '..', 'src', 'globals.css');

const { Config } = ui;

// a11y/state chassis that must survive the core→atom absorption (#301). The
// six focus/aria classes are shared; Button additionally disables. Tag's set is
// a strict subset — do NOT push disabled:* onto it. Update deliberately if the
// design of these states changes.
const COMMON_CHASSIS = [
  'focus-visible:border-ring',
  'focus-visible:ring-ring/50',
  'focus-visible:ring-[3px]',
  'aria-invalid:border-destructive',
  'aria-invalid:ring-destructive/20',
  'dark:aria-invalid:ring-destructive/40',
];
const CHASSIS = {
  Button: [...COMMON_CHASSIS, 'disabled:opacity-50', 'disabled:pointer-events-none'],
  Tag: [...COMMON_CHASSIS],
};

// Minimal valid props per component that needs them. Anything not listed is
// rendered with no props. Keep entries tiny — just enough to render.
const fixtures = {
  Button: { children: 'Button' },
  Tag: { children: 'Tag' },
  Typography: { children: 'Text' },
  Space: { children: 'x' },
  Card: { children: 'x' },
  Collapse: { items: [{ key: '1', label: 'L', children: 'C' }] },
  Container: { children: 'x' },
  PageHeader: { title: 'Title' },
  Empty: {},
  Result: { title: 'Done' },
  List: { data: [1, 2], renderItem: item => h('div', null, String(item)) },
  Marquees: { children: h('span', null, 'scrolling') },
  Reveals: { children: h('div', null, 'reveal') },
  Menu: { items: [{ key: '1', label: 'Item' }] },
  Dropdown: { menu: { items: [{ key: '1', label: 'Item' }] }, children: h('button', null, 'trigger') },
  Popover: { content: 'hi', children: h('button', null, 'trigger') },
  Drawer: { open: false, onClose: () => {}, children: 'x' },
  Modal: { open: false, onCancel: () => {} },
  Swiper: { data: [1, 2], renderItem: item => h(ui.Swiper.Slide, { key: item }, String(item)) },
  Layout: { children: h(ui.Layout.Content, null, 'content') },
  Row: { children: h(ui.Col, { span: 12 }, 'col') },
  Col: { span: 12, children: 'col' },
  Splitter: {
    children: [
      h(ui.Splitter.Panel, { key: 'a' }, 'A'),
      h(ui.Splitter.Panel, { key: 'b' }, 'B'),
    ],
  },
  Upload: {},
  Select: { options: [{ label: 'A', value: 'a' }] },
  Toast: { title: 'hi' },
};

// Exports that aren't renderable components (providers-as-values, hooks,
// constants). Providers still render fine but carry no smoke value on their own.
const NON_COMPONENTS = new Set([
  'DEFAULT_LOCALE',
  'getRootConfigValue',
  'useConfig',
  'ConfigSnapshotProvider',
  'Config',
]);

function isComponent(v) {
  if (typeof v === 'function') return true;
  // forwardRef / memo objects
  return v && typeof v === 'object' && '$$typeof' in v;
}

const results = [];
const markupByName = {};
for (const name of Object.keys(ui).sort()) {
  if (NON_COMPONENTS.has(name)) continue;
  const Comp = ui[name];
  if (!isComponent(Comp)) continue;

  const { children, ...props } = fixtures[name] ?? {};
  try {
    const markup = renderToStaticMarkup(
      h(Config, null, h(Comp, props, children ?? undefined)),
    );
    markupByName[name] = markup;
    results.push({ name, ok: true });
  } catch (err) {
    results.push({ name, ok: false, err });
  }
}

const errors = [];

// 1. Render throws.
const failed = results.filter(r => !r.ok);
if (failed.length) {
  const lines = failed.map(({ name, err }) => {
    const msg = ((err && (err.message || String(err))) || '').split('\n')[0];
    return `    - ${name}: ${msg}`;
  });
  errors.push(
    `SSR render threw for ${failed.length} component(s):\n${lines.join('\n')}\n` +
      '    A component must server-render without throwing. Guard browser-only\n' +
      '    access (`typeof window`/`useEffect`), or add minimal props to the\n' +
      '    fixtures map in this script if the throw is just a missing required prop.',
  );
}

// 2. data-slot contract, derived from globals.css.
const cssSlots = new Set(
  [...fs.readFileSync(GLOBALS_CSS, 'utf8').matchAll(/\[data-slot='([a-z-]+)'\]/g)].map(
    m => m[1],
  ),
);
const allMarkup = Object.values(markupByName).join('');
const renderedSlots = new Set(
  [...allMarkup.matchAll(/data-slot="([a-z-]+)"/g)].map(m => m[1]),
);
const missingSlots = [...cssSlots].filter(s => !renderedSlots.has(s)).sort();
if (missingSlots.length) {
  errors.push(
    `data-slot contract: globals.css styles [data-slot='${missingSlots.join("'], [data-slot='")}']\n` +
      `    but no exported component renders data-slot="${missingSlots.join('" / "')}".\n` +
      '    Those CSS rules (button colors, the non-Tailwind-host reset) silently\n' +
      '    no-op without the attribute. The owning component must emit it.',
  );
}

// 3. a11y/state chassis for Button and Tag.
for (const [name, expected] of Object.entries(CHASSIS)) {
  const markup = markupByName[name];
  if (markup == null) continue; // a render failure is already reported above
  const missing = expected.filter(cls => !markup.includes(cls));
  if (missing.length) {
    errors.push(
      `${name} a11y/state chassis: rendered output is missing ${missing.length} ` +
        `class(es):\n    ${missing.join(' ')}\n` +
        '    These focus-ring / aria-invalid / disabled treatments must survive\n' +
        '    in the rendered markup (e.g. after absorbing the core primitive).',
    );
  }
}

if (errors.length) {
  console.error('✘ SSR smoke / rendered-output contract failed:\n');
  for (const e of errors) console.error('  - ' + e + '\n');
  process.exit(1);
}

const passed = results.filter(r => r.ok);
console.log(
  `✓ SSR smoke + contracts passed: ${passed.length} components render, ` +
    `data-slot [${[...cssSlots].sort().join(', ')}] present, Button/Tag chassis intact.`,
);
