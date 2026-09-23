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
//      That chassis lives in core's cva base string, so an atom that stops
//      wrapping its primitive has to carry it itself. Asserted per-component
//      because Tag's chassis is a strict subset of Button's (a Tag isn't
//      disableable) — a single shared list would false-positive on Tag.
//
//   4. generic preflight-reset slot (#301 follow-up): the non-Tailwind-host
//      reset in globals.css is scoped generically to
//      :where([data-slot], [data-slot] *) — it fires for ANY data-slot value,
//      not just the color-keyed ones in contract #2. So an atom can drop its
//      data-slot, keep every globals.css-keyed slot present elsewhere, PASS
//      contract #2, and still regress bare-element UA defaults on hosts without
//      their own preflight (Docusaurus etc. — the #253/#256 class). Asserted
//      per named component. Tag was the original entry, back when it emitted
//      data-slot="badge"; its slot is keyed by name now, so the registry is
//      empty and waiting for the next component in that position.
//
//   5. render composition (#375): Button, Container, and Layout.Content must
//      merge their props/classes/children onto a replacement element without
//      leaking button-only attributes onto a non-button host.
//
//   6. preflight-reset coverage: contract #4 asks "does this named component
//      still emit its data-slot?", which only protects components someone
//      thought to register. This asks the question from the other end — walk
//      the rendered markup and assert every bare <button>/<input>/<select>/
//      <textarea> is actually inside the reset's selector, i.e. carries
//      data-slot itself or has an ancestor that does. A whole component family
//      that never emitted a data-slot passes #2 and #4 vacuously (nothing is
//      registered, no globals.css rule keys it) while its bare elements sit
//      there with UA defaults — which is exactly how Layout's Sider trigger
//      shipped as a 2px-outset UA button on the docs site, and how
//      Input.Search's clear button did too.
//
// Run after `build`, via the css-stub loader (Swiper imports `.css`):
//   node --import ./scripts/loaders/css-stub.mjs scripts/check-ssr-smoke.mjs
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Subpath-only entries (#346). CodeEditor is published at ./CodeEditor and is
// deliberately NOT in the root barrel — CodeMirror is an optional peer, and an
// eager re-export would break `import { Button }` for consumers without it. The
// loop over `ui` below therefore can't see it, so it's rendered explicitly:
// otherwise the newest component would be the one component with no SSR gate.
import * as codeEditor from '../dist/CodeEditor.mjs';
import * as ui from '../dist/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GLOBALS_CSS = path.join(__dirname, '..', 'src', 'globals.css');

const { Config } = ui;

// a11y/state chassis that must survive however the atom gets it (#301). The
// six focus/aria classes are shared; Button additionally disables. Tag's set is
// a strict subset — do NOT push disabled:* onto it. Both atoms wrap their core
// primitive again, so these classes come from the cva base string; this check
// is what makes that sourcing swappable without a silent regression. Update
// deliberately if the design of these states changes.
const COMMON_CHASSIS = [
  'focus-visible:border-ring',
  'focus-visible:ring-ring/50',
  'focus-visible:ring-[3px]',
  'aria-invalid:border-destructive',
  'aria-invalid:ring-destructive/20',
  'dark:aria-invalid:ring-destructive/40',
];
const CHASSIS = {
  Button: [
    ...COMMON_CHASSIS,
    'disabled:opacity-50',
    'disabled:pointer-events-none',
  ],
  Tag: [...COMMON_CHASSIS],
};

// Components whose root data-slot is load-bearing ONLY via the generic
// non-Tailwind-host reset (:where([data-slot], [data-slot] *)) and is NOT
// individually keyed in globals.css — so contract #2 can't see it (#301
// follow-up). Button's data-slot="button" IS keyed, so #2 already covers it;
// don't list it here or it double-reports. Add a component here if it grows a
// generic-reset dependency without a keyed selector.
//
// Tag used to live here: its slot was "badge", which the generic reset matched
// but no globals.css rule keyed by name. Now that Tag emits data-slot="tag" and
// globals.css keys its colour rules off [data-slot='tag'], contract #2 covers
// it and listing it here would double-report.
const RESET_SLOTS = {};

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
  Dropdown: {
    menu: { items: [{ key: '1', label: 'Item' }] },
    // A `Button` rather than a bare `<button>`: the trigger these take is the
    // caller's own element, and a bare one makes contract #6 flag the fixture
    // instead of the library. This is also what the docs actually pass.
    children: h(ui.Button, null, 'trigger'),
  },
  Popover: { content: 'hi', children: h(ui.Button, null, 'trigger') },
  Drawer: { open: false, onClose: () => {}, children: 'x' },
  Modal: { open: false, onCancel: () => {} },
  Swiper: {
    data: [1, 2],
    renderItem: item => h(ui.Swiper.Slide, { key: item }, String(item)),
  },
  // The full shell, not a lone Content: Sider is the only part that renders a
  // control of its own (the collapse trigger), and `collapsible` is what emits
  // it. With a bare Content fixture the contracts below never see that button —
  // which is how it shipped as a UA-default button on the docs site.
  Layout: {
    children: [
      h(ui.Layout.Header, { key: 'header' }, 'header'),
      h(
        ui.Layout,
        { key: 'body' },
        h(ui.Layout.Sider, { collapsible: true }, 'sider'),
        h(ui.Layout.Content, null, 'content'),
      ),
      h(ui.Layout.Footer, { key: 'footer' }, 'footer'),
    ],
  },
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

// Components reachable only through their own export subpath, with the module
// they live in. Same contracts as the barrel exports — they just have to be
// named here because nothing enumerates them for us.
const SUBPATH_COMPONENTS = {
  CodeEditor: { module: codeEditor, props: { value: 'const a = 1;\n' } },
};

// Compound parts (`Input.Search`, `Layout.Sider`, …). The loop over `ui` only
// sees the barrel's own keys, so a part is exercised only when some parent's
// fixture happens to render it — `Input.Search`'s clear button was never
// rendered here at all, and it shipped as a UA-default button on the docs
// site. Render each part on its own so the contracts see the whole public
// surface, not just the roots. Keep props minimal, as in `fixtures`.
const COMPOUND_COMPONENTS = {
  'Checkbox.Group': [
    ui.Checkbox.Group,
    { options: [{ label: 'A', value: 'a' }] },
  ],
  'FloatButton.BackTop': [ui.FloatButton.BackTop, {}],
  // `defaultValue` on purpose: the clear button carries `hidden` until the
  // field has a value, and contract #6 skips hidden controls — so an empty
  // Search would render the button in the one state where nothing checks it.
  'Input.Search': [ui.Input.Search, { defaultValue: 'q' }],
  'Input.TextArea': [ui.Input.TextArea, {}],
  'Layout.Content': [ui.Layout.Content, { children: 'content' }],
  'Layout.Footer': [ui.Layout.Footer, { children: 'footer' }],
  'Layout.Header': [ui.Layout.Header, { children: 'header' }],
  'Layout.Sider': [ui.Layout.Sider, { collapsible: true, children: 'sider' }],
  'List.Item': [ui.List.Item, { children: 'item' }],
  'Marquees.Item': [ui.Marquees.Item, { children: 'item' }],
  'Radio.Group': [ui.Radio.Group, { options: [{ label: 'A', value: 'a' }] }],
  'Reveals.Item': [ui.Reveals.Item, { children: 'item' }],
  'Skeleton.Button': [ui.Skeleton.Button, {}],
  'Skeleton.Node': [ui.Skeleton.Node, {}],
  // Splitter.Panel is deliberately absent: react-resizable-panels throws
  // ("Group Context not found") on a Panel rendered outside its Group, so it
  // can only be exercised through the `Splitter` fixture above — which does.
  'Swiper.Slide': [ui.Swiper.Slide, { children: 'slide' }],
  'Typography.Link': [ui.Typography.Link, { children: 'link' }],
  'Typography.Paragraph': [ui.Typography.Paragraph, { children: 'paragraph' }],
  'Typography.Text': [ui.Typography.Text, { children: 'text' }],
  'Typography.Title': [ui.Typography.Title, { children: 'title' }],
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

for (const [name, { module: mod, props }] of Object.entries(
  SUBPATH_COMPONENTS,
)) {
  const Comp = mod.default;
  try {
    if (!isComponent(Comp)) {
      throw new Error('subpath module has no default-exported component');
    }
    markupByName[name] = renderToStaticMarkup(h(Config, null, h(Comp, props)));
    results.push({ name, ok: true });
  } catch (err) {
    results.push({ name, ok: false, err });
  }
}

for (const [name, [Comp, fixture]] of Object.entries(COMPOUND_COMPONENTS)) {
  const { children, ...props } = fixture;
  try {
    if (!isComponent(Comp)) {
      throw new Error('compound part is not a component');
    }
    markupByName[name] = renderToStaticMarkup(
      h(Config, null, h(Comp, props, children ?? undefined)),
    );
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
  [
    ...fs
      .readFileSync(GLOBALS_CSS, 'utf8')
      .matchAll(/\[data-slot='([a-z-]+)'\]/g),
  ].map(m => m[1]),
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

// 4. generic preflight-reset slot for components not keyed in globals.css.
for (const [name, slot] of Object.entries(RESET_SLOTS)) {
  const markup = markupByName[name];
  if (markup == null) continue; // a render failure is already reported above
  if (!markup.includes(`data-slot="${slot}"`)) {
    errors.push(
      `${name} preflight-reset slot: rendered output no longer has ` +
        `data-slot="${slot}".\n` +
        '    globals.css scopes the non-Tailwind-host reset generically to\n' +
        '    :where([data-slot], [data-slot] *); dropping the attribute leaves the\n' +
        '    bare element with UA defaults (2px outset border, UA font) on hosts\n' +
        '    without their own preflight (#253/#256). This slot is not color-keyed\n' +
        '    in globals.css, so contract #2 does not cover it — keep a data-slot on\n' +
        '    the root through the Phase 4 absorb.',
    );
  }
}

// 5. Base UI render composition contracts.
const compositionCases = [
  {
    name: 'Button',
    markup: renderToStaticMarkup(
      h(
        ui.Button,
        {
          render: h('div', { className: 'custom-button' }),
          nativeButton: false,
        },
        'Composed button',
      ),
    ),
    expected: [
      '<div',
      'class="custom-button ',
      'role="button"',
      'Composed button',
    ],
    forbidden: ['type="button"'],
  },
  {
    name: 'Container',
    markup: renderToStaticMarkup(
      h(
        ui.Container,
        {
          render: h('section', {
            'aria-label': 'Results',
            className: 'custom-container',
          }),
        },
        'Composed container',
      ),
    ),
    expected: [
      '<section',
      'aria-label="Results"',
      'class="custom-container ',
      'mx-auto',
      'Composed container',
    ],
    forbidden: [],
  },
  {
    name: 'Layout.Content',
    markup: renderToStaticMarkup(
      h(
        ui.Layout.Content,
        { render: h('section', { className: 'custom-content' }) },
        'Composed content',
      ),
    ),
    expected: [
      '<section',
      'class="custom-content ',
      'min-w-0',
      'Composed content',
    ],
    forbidden: [],
  },
];

for (const { name, markup, expected, forbidden } of compositionCases) {
  const missing = expected.filter(value => !markup.includes(value));
  const leaked = forbidden.filter(value => markup.includes(value));

  if (missing.length || leaked.length) {
    errors.push(
      `${name} render composition:` +
        (missing.length ? `\n    missing: ${missing.join(', ')}` : '') +
        (leaked.length ? `\n    leaked: ${leaked.join(', ')}` : ''),
    );
  }
}

// 6. preflight-reset coverage over the rendered markup.
//
// globals.css resets bare form controls with
// `:where([data-slot], [data-slot] *):where(button, input, select, textarea)`,
// so a control is covered iff it carries data-slot itself or descends from an
// element that does. Walk the tags rather than string-matching: coverage is an
// ancestor relationship, which substring checks can't see.
const RESET_CONTROLS = new Set(['button', 'input', 'select', 'textarea']);
// Emitted without a closing tag, so they never open a scope to pop.
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;

// A control nobody can see can't leak UA chrome, so it needs no reset. Base UI
// pairs Select/Switch with a visually-hidden sibling <input> for form value —
// rendered *outside* the slot root and already neutered inline
// (`clip-path: inset(50%)`, `border: 0`), and Upload/Checkbox/Radio keep their
// own `hidden` proxy inputs. Flagging those would be noise that trains people
// to sprinkle data-slot at random.
function isVisuallyHidden(attrs) {
  if (/\shidden(?=[\s/>=])/.test(attrs)) {
    return true;
  }

  if (/\sstyle="[^"]*clip-path:\s*inset\(50%\)/.test(attrs)) {
    return true;
  }

  const className = /\sclass="([^"]*)"/.exec(attrs);

  return !!className && className[1].split(/\s+/).includes('hidden');
}

function findUncoveredControls(markup) {
  // Each entry is "is this element, or any ancestor, inside a data-slot?".
  const coverageStack = [false];
  const uncovered = new Set();

  for (const [, closing, rawTag, attrs] of markup.matchAll(TAG_RE)) {
    const tag = rawTag.toLowerCase();

    if (closing) {
      if (coverageStack.length > 1) {
        coverageStack.pop();
      }

      continue;
    }

    const covered =
      coverageStack[coverageStack.length - 1] || /\sdata-slot=/.test(attrs);

    if (!covered && RESET_CONTROLS.has(tag) && !isVisuallyHidden(attrs)) {
      uncovered.add(tag);
    }

    if (!VOID_ELEMENTS.has(tag) && !attrs.trimEnd().endsWith('/')) {
      coverageStack.push(covered);
    }
  }

  return [...uncovered].sort();
}

for (const [name, markup] of Object.entries(markupByName)) {
  const uncovered = findUncoveredControls(markup);

  if (uncovered.length) {
    errors.push(
      `${name} preflight-reset coverage: renders <${uncovered.join('> / <')}> ` +
        'with no data-slot on the element or any ancestor.\n' +
        '    globals.css scopes the non-Tailwind-host reset to\n' +
        '    :where([data-slot], [data-slot] *):where(button, input, select, textarea),\n' +
        '    so an uncovered control keeps the UA defaults (2px outset border, UA\n' +
        '    font) on hosts without their own preflight — Docusaurus, plain Vite,\n' +
        '    any consumer that only imports our stylesheet (#253/#256).\n' +
        "    Put a data-slot on the control or on the component's root element.",
    );
  }
}

if (errors.length) {
  console.error('✘ SSR smoke / rendered-output contract failed:\n');
  for (const e of errors) console.error('  - ' + e + '\n');
  process.exit(1);
}

const passed = results.filter(r => r.ok);
const resetSlots = Object.values(RESET_SLOTS).sort();
console.log(
  `✓ SSR smoke + contracts passed: ${passed.length} components render, ` +
    `data-slot [${[...cssSlots].sort().join(', ')}] present, Button/Tag chassis intact, ` +
    `reset-slot ${resetSlots.length ? `[${resetSlots.join(', ')}] present` : 'registry empty'}, ` +
    'render composition intact, every rendered form control covered by the ' +
    'preflight reset.',
);
