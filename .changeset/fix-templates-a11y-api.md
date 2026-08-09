---
'@repo/ui': major
---

**Breaking:** `packages/ui`'s `peerDependencies` now require `react`/`react-dom` `^19.0.0` (React 18 support dropped). This is needed so `Layout`/`Header`/`Content`/`Footer`/`Sider` can forward `ref` to their root DOM element via React 19's automatic ref-as-prop (no `forwardRef` needed) — under React 18, a plain function component silently drops `ref` without `forwardRef`, so supporting both would have meant either shipping broken ref support on React 18 or wrapping every component in `forwardRef`.

Also in this release:

- `Sider`'s collapse trigger now has `aria-expanded`/`aria-controls` for assistive tech
- `Header` gains a `position?: 'sticky' | 'static' | 'fixed'` prop (defaults to the previous `sticky` behavior)
- `templates/index.ts` now re-exports `LayoutProps`/`ContentProps`/`FooterProps`/`HeaderProps`/`SiderProps`
