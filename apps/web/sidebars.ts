import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// Pages are added one component at a time — see AGENTS.md. Grouped by the
// same functional categories Storybook stories use (each story's `title`
// prefix, e.g. 'Data Entry/Select') and the landing page's own CATEGORIES
// list (General/Data Entry/Data Display/Feedback/Navigation/Layout), not
// by atomic-design tier — a category only appears here once it has a page.
// File paths under docs/components/ still mirror packages/ui/src/components'
// tier structure (atoms/molecules/organisms/templates); only this sidebar's
// grouping/labels differ from that.
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'General',
      collapsed: false,
      items: [
        'components/atoms/tag',
        'components/atoms/typography',
        'components/atoms/button',
      ],
    },
    {
      type: 'category',
      label: 'Data Entry',
      collapsed: false,
      items: [
        'components/atoms/select',
        'components/atoms/date-picker',
        'components/atoms/color-picker',
        'components/atoms/switch',
        'components/atoms/input',
      ],
    },
    {
      type: 'category',
      label: 'Data Display',
      collapsed: false,
      items: ['components/atoms/popover'],
    },
    {
      type: 'category',
      label: 'Feedback',
      collapsed: false,
      items: [
        'components/atoms/progress',
        'components/atoms/spin',
        'components/atoms/skeleton',
      ],
    },
    {
      type: 'category',
      label: 'Navigation',
      collapsed: false,
      items: ['components/atoms/float-button'],
    },
  ],
};

export default sidebars;
