import { type ReactNode, useEffect } from 'react';

import { useColorMode } from '@docusaurus/theme-common';

// Mirrors Docusaurus' color mode onto <html> as ui-kit's own `.dark` marker.
//
// Redundant on this site as it stands: ui-kit's dark variant is defined as
// `&:is(.dark *, [data-theme='dark'] *)` and its token block keys off
// `.dark, [data-theme='dark']`, so Docusaurus' own `data-theme` attribute
// already drives every ui-kit component here. Kept as an explicit bridge so
// the site doesn't silently depend on ui-kit continuing to recognise
// Docusaurus' attribute — `.dark` is the library's documented marker.
//
// When it does apply, it has to go on <html>, not on a wrapper: ui-kit's
// selectors match *descendants* of the marked element, and <Config
// theme={{ dark }}> would only mark a div rendered inside these children.
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
