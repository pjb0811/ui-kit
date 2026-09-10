export { default, useConfig, DEFAULT_LOCALE } from './config';
export { ConfigSnapshotProvider, getRootConfigValue } from './registry';
// Internal on purpose — reachable from inside the package, but not re-exported
// by `providers/index.ts`, so it stays out of the published `./providers`
// surface until a consumer actually needs it.
export {
  resolveDark,
  useIsDarkActive,
  useSystemPrefersDark,
} from './dark-mode';
export type {
  Props,
  ComponentSize,
  DefaultProps,
  Locale,
  ThemeConfig,
  ThemeToken,
} from './config';
