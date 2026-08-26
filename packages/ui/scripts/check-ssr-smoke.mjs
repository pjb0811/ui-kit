#!/usr/bin/env node
// SSR smoke test (Phase 3 regression net, ui-kit#294).
//
// Server-renders every exported component (wrapped in <Config>) with minimal
// valid props and fails on throw. This catches the "works in the browser,
// explodes / diverges on the server" class (ui-kit#228) — a `'use client'`
// component touching `window`/`document` at render, an SSR-unsafe hook, an
// unguarded portal — none of which type-check or lint catch. Broad crash net,
// not a snapshot: we only assert it renders without throwing.
//
// Run after `build`, via the css-stub loader (Swiper imports `.css`):
//   node --import ./scripts/loaders/css-stub.mjs scripts/check-ssr-smoke.mjs

import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import * as ui from '../dist/index.mjs';

const { Config } = ui;

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
for (const name of Object.keys(ui).sort()) {
  if (NON_COMPONENTS.has(name)) continue;
  const Comp = ui[name];
  if (!isComponent(Comp)) continue;

  const { children, ...props } = fixtures[name] ?? {};
  try {
    renderToStaticMarkup(
      h(Config, null, h(Comp, props, children ?? undefined)),
    );
    results.push({ name, ok: true });
  } catch (err) {
    results.push({ name, ok: false, err });
  }
}

const failed = results.filter(r => !r.ok);
const passed = results.filter(r => r.ok);

if (failed.length) {
  console.error(`✘ SSR smoke render threw for ${failed.length} component(s):\n`);
  for (const { name, err } of failed) {
    const msg = (err && (err.message || String(err)) || '').split('\n')[0];
    console.error(`  - ${name}: ${msg}`);
  }
  console.error(
    '\n  A component must server-render without throwing. Guard browser-only\n' +
      '  access (`typeof window`/`useEffect`), or add minimal props to the\n' +
      '  fixtures map in this script if the throw is just a missing required prop.',
  );
  process.exit(1);
}

console.log(`✓ SSR smoke render passed for ${passed.length} components.`);
