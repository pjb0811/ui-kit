import type * as Preset from '@docusaurus/preset-classic';
import type { Config, Plugin } from '@docusaurus/types';

import tailwindcss from '@tailwindcss/postcss';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// `@repo/ui/style.css` resolves to the library's *source* CSS (Tailwind
// theme tokens + `@import`s, not pre-built utility classes) inside this
// workspace, so this app must run its own Tailwind build over its own
// pages — same as apps/docs' Storybook build and the old Next.js app did.
// Docusaurus doesn't read a `postcss.config.*` file itself, so the plugin
// hooks it in via `configurePostCss`.
const tailwindPlugin = (): Plugin => ({
  name: 'tailwind-postcss-plugin',
  configurePostCss(postcssOptions) {
    postcssOptions.plugins.push(tailwindcss);
    return postcssOptions;
  },
});

const config: Config = {
  title: 'ui-kit',
  tagline:
    'A React UI component library built with TypeScript, Tailwind CSS, and Radix UI',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Vercel is the deploy target (see vercel.json). `url` + `baseUrl` must
  // match it, since canonical <link> tags, sitemap.xml, and Open Graph URLs
  // are all derived from them.
  // TODO: confirm this matches the actual Vercel production domain for
  // this app once deployed.
  url: 'https://ui-kit-web-lab.vercel.app',
  baseUrl: '/',

  organizationName: 'pjb0811',
  projectName: 'ui-kit',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [tailwindPlugin],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'ui-kit',
      items: [
        {
          href: 'https://ui-kit-docs-lab.vercel.app',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/pjb0811/ui-kit',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@jbpark/ui-kit',
          label: 'npm',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            { label: 'Docs', href: 'https://ui-kit-docs-lab.vercel.app' },
            { label: 'GitHub', href: 'https://github.com/pjb0811/ui-kit' },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@jbpark/ui-kit',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} jbpark · ui-kit · MIT License`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
