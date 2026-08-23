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
      items: [
        'components/atoms/tag',
        'components/atoms/progress',
        'components/atoms/spin',
        'components/atoms/select',
        'components/atoms/date-picker',
        'components/atoms/float-button',
        'components/atoms/color-picker',
        'components/atoms/typography',
        'components/atoms/switch',
        'components/atoms/skeleton',
      ],
    },
  ],
};

export default sidebars;
