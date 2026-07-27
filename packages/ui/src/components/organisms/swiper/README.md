# Swiper

A thin wrapper around [Swiper](https://swiperjs.com/)'s React component that
adds `loading` / `loader` handling and a `data` + `renderItem` rendering API.

## Modules are opt-in

`Swiper` ships **only the Swiper core** — `import 'swiper/css'` and nothing
else. Feature modules (`Autoplay`, `Navigation`, `Scrollbar`, `EffectCards`, …)
and their stylesheets are **not** bundled by the library.

Why: previously every consumer paid for all four modules and their CSS in the
bundle, whether or not their carousel used them. Making modules an explicit
consumer-side injection (the same pattern shadcn/Radix-style libraries use)
keeps the baseline bundle small and lets each call site pay only for what it
actually renders.

## Usage

Import the modules you need from `swiper/modules`, import their stylesheets
from `swiper/css/<module>`, and pass the modules through the `modules` prop:

```tsx
import { Swiper } from '@jbpark/ui-kit';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';

<Swiper
  modules={[Autoplay, Navigation]}
  options={{
    navigation: true,
    autoplay: { delay: 2500, disableOnInteraction: false },
  }}
  data={items}
  renderItem={item => <Swiper.Slide key={item.id}>{item.title}</Swiper.Slide>}
/>;
```

`swiper` is a direct dependency of `@jbpark/ui-kit`, but add it to your own
`package.json` as well so that `swiper/modules` and `swiper/css/*` resolve
under strict package managers such as pnpm.

Available modules and their option keys are documented in the
[Swiper modules reference](https://swiperjs.com/swiper-api#modules). Common
pairings:

| Module        | Import           | Stylesheet                | Option key   |
| ------------- | ---------------- | ------------------------- | ------------ |
| `Autoplay`    | `swiper/modules` | `swiper/css/autoplay`     | `autoplay`   |
| `Navigation`  | `swiper/modules` | `swiper/css/navigation`   | `navigation` |
| `Scrollbar`   | `swiper/modules` | `swiper/css/scrollbar`    | `scrollbar`  |
| `EffectCards` | `swiper/modules` | `swiper/css/effect-cards` | `effect`     |

## Migrating from an older version

Before this change, `Swiper` always imported and activated `Autoplay`,
`EffectCards`, `Navigation` and `Scrollbar`, plus all of their CSS. Because the
built-in `initialOptions` sets `autoplay: { delay: 2500, disableOnInteraction: false }`,
**every carousel autoplayed by default**.

After this change nothing is active unless it is explicitly passed via
`modules`. Concretely:

- Carousels that relied on the implicit default autoplay will stop autoplaying.
  Add `modules={[Autoplay]}` (plus `import 'swiper/css/autoplay'`) to keep it.
- `navigation: true`, `scrollbar`, and `effect: 'cards'` in `options` become
  inert no-ops until the matching module is passed.
- If you did not want autoplay in the first place, no action is needed — you now
  get the smaller bundle for free.
