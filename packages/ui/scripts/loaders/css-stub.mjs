// Node ESM loader hook: stub out `.css` imports so the built component modules
// can be imported in a plain Node process for the SSR smoke test. Swiper (and
// our own dist) `import 'swiper/css'` etc., which Node can't load natively.
// Used via `node --import ./scripts/loaders/css-stub.mjs`.

import { register } from 'node:module';

register('./css-stub-hooks.mjs', import.meta.url);
