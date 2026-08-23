import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// Pages are added one component at a time — see AGENTS.md. Grouped by the
// same atomic-design tiers as packages/ui/src/components (atoms/molecules/
// organisms/templates), so a new page's place in the sidebar matches where
// its source lives.
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Atoms',
      collapsed: false,
      items: ['components/atoms/tag'],
    },
  ],
};

export default sidebars;
