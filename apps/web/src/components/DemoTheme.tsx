import { type ReactNode, useEffect } from 'react';

import { useColorMode } from '@docusaurus/theme-common';

// Bridges Docusaurus' color mode into ui-kit's own dark-mode mechanism (a
// `.dark` class ancestor) so components on this page — and the page
// background itself — follow the navbar's light/dark toggle instead of
// defaulting to light.
//
// Deliberately toggles `.dark` on <html> directly rather than wrapping
// children in ui-kit's <Config theme={{ dark }}>: Config only applies
// `.dark` to a div it renders *inside* this component's children, which is
// a descendant of <body> — too low for custom.css, which resolves
// `--background`/`--foreground` on <html> (via `--ifm-background-color`)
// and on <body>. Both rules need `.dark` on <html> itself or above.
// Toggling <html> covers the page chrome and every ui-kit component under
// it in one place.
//
// Must be used from inside page content, not from `@theme/Root`: Root
// renders above Docusaurus' ColorModeProvider, so useColorMode() throws
// there.
export default function DemoTheme({ children }: { children: ReactNode }) {
  const { colorMode } = useColorMode();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', colorMode === 'dark');
  }, [colorMode]);

  return children;
}
