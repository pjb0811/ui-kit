'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { BookOpen, Check, Copy, Moon, Package, Sun } from 'lucide-react';

import { Button, Card, Tag, Typography } from '@repo/ui';

// lucide-react removed all brand icons (including GitHub) in v1 — its own
// migration guide recommends a custom SVG in their place.
const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.42-5.27 5.7.41.36.78 1.07.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .3.2.66.79.55A10.53 10.53 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const GITHUB_URL = 'https://github.com/pjb0811/ui-kit';
const NPM_URL = 'https://www.npmjs.com/package/@jbpark/ui-kit';
const DOCS_URL = 'https://ui-kit-docs-lab.vercel.app';
const INSTALL_COMMAND = 'npm install @jbpark/ui-kit';

type Theme = 'light' | 'dark';

const FEATURES = [
  {
    title: 'TypeScript-first',
    description:
      'Every component ships with full type definitions, so props and variants are checked and autocompleted as you write.',
  },
  {
    title: 'Radix UI primitives',
    description:
      'Interactive components (Dialog, Popover, Dropdown, Drawer, and more) are built on accessible, unstyled Radix primitives.',
  },
  {
    title: 'Tailwind CSS 4',
    description:
      'Styled with utility classes and CSS variables, so themes and one-off overrides are easy to customize.',
  },
  {
    title: 'Dark mode built in',
    description:
      'Every component reads from a shared set of CSS variables — flip one class on the root element to theme the whole app.',
  },
  {
    title: 'Tree-shakeable',
    description:
      'Import only the components you use. Nothing else is bundled into your app.',
  },
  {
    title: 'Atomic Design structure',
    description:
      'Atoms, molecules, organisms, and page templates — organized so it stays easy to navigate as it grows.',
  },
] as const;

const CATEGORIES = [
  {
    name: 'General',
    components: 'Button, Typography, Tag, Space',
  },
  {
    name: 'Data Entry',
    components: 'Input, Checkbox, Radio, Select, Switch, DatePicker, Upload',
  },
  {
    name: 'Data Display',
    components: 'Card, Collapse, List, Marquees, Popover, Swiper',
  },
  {
    name: 'Feedback',
    components: 'Modal, Drawer, Progress, Skeleton, Spin',
  },
  {
    name: 'Navigation',
    components: 'Menu, Dropdown, FloatButton',
  },
  {
    name: 'Layout',
    components: 'Layout, Splitter',
  },
] as const;

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Reading localStorage (unavailable during SSR) to sync client state
    // with a persisted value after mount is exactly what effects are for
    // — there's no prop/state to derive this from during render, so the
    // "adjust state during render" pattern doesn't apply here.
    const stored = window.localStorage.getItem('ui-kit-web-theme');
    const initial: Theme = stored ? JSON.parse(stored) : 'dark';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('ui-kit-web-theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <Button
      type="text"
      shape="circle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      icon={theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
      onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
    />
  );
};

const InstallCommand = () => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable, ignore
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy install command"
      className="border-border bg-muted text-foreground hover:bg-accent flex
        w-full max-w-md items-center justify-between gap-4 rounded-lg border
        px-4 py-3 text-left font-mono text-sm transition-colors sm:w-auto"
    >
      <span>{INSTALL_COMMAND}</span>
      {copied ? (
        <Check size={16} className="shrink-0 text-green-500" />
      ) : (
        <Copy size={16} className="text-muted-foreground shrink-0" />
      )}
    </button>
  );
};

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <Typography.Text strong className="text-lg">
          ui-kit
        </Typography.Text>
        <div className="flex items-center gap-2">
          <Button
            type="text"
            shape="circle"
            aria-label="GitHub repository"
            icon={<GithubIcon size={16} />}
            onClick={() => window.open(GITHUB_URL, '_blank')}
          />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-24 py-16">
        <section className="flex flex-col items-center gap-6 text-center">
          <Image
            src="https://img.shields.io/npm/v/@jbpark/ui-kit.svg?style=flat-square&color=white&labelColor=262626"
            alt="npm version"
            width={92}
            height={20}
            unoptimized
            className="h-5 w-auto"
          />
          <Typography.Title level={1} className="max-w-2xl">
            A React UI kit built on TypeScript, Tailwind, and Radix
          </Typography.Title>
          <Typography.Paragraph className="text-muted-foreground max-w-xl">
            Atoms, molecules, organisms, and page templates for building
            accessible, themeable interfaces — install one package and go.
          </Typography.Paragraph>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <InstallCommand />
            <div className="flex gap-3">
              <Button
                type="primary"
                icon={<BookOpen size={16} />}
                onClick={() => window.open(DOCS_URL, '_blank')}
              >
                View Docs
              </Button>
              <Button
                icon={<Package size={16} />}
                onClick={() => window.open(NPM_URL, '_blank')}
              >
                npm
              </Button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <Typography.Title level={2} className="text-center">
            Why ui-kit
          </Typography.Title>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(feature => (
              <Card key={feature.title}>
                <Typography.Title level={5} className="mb-2">
                  {feature.title}
                </Typography.Title>
                <Typography.Paragraph className="text-muted-foreground">
                  {feature.description}
                </Typography.Paragraph>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <Typography.Title level={2} className="text-center">
            Component categories
          </Typography.Title>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CATEGORIES.map(category => (
              <a
                key={category.name}
                href={DOCS_URL}
                target="_blank"
                rel="noreferrer"
              >
                <Card className="hover:border-primary/40 transition-colors">
                  <div className="mb-2 flex items-center gap-2">
                    <Tag color="primary">{category.name}</Tag>
                  </div>
                  <Typography.Text className="text-muted-foreground text-sm">
                    {category.components}
                  </Typography.Text>
                </Card>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer
        className="border-border text-muted-foreground flex flex-col
          items-center gap-2 border-t py-8 text-sm"
      >
        <div className="flex gap-4">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={NPM_URL} target="_blank" rel="noreferrer">
            npm
          </a>
          <a href={DOCS_URL} target="_blank" rel="noreferrer">
            Docs
          </a>
        </div>
        <span>MIT License</span>
      </footer>
    </div>
  );
}
