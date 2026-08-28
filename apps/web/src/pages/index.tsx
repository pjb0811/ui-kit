import { useState } from 'react';

import Layout from '@theme/Layout';
import { BookOpen, Check, Copy, Package } from 'lucide-react';

import { Button, Card, Tag, Typography } from '@repo/ui';

import DemoTheme from '../components/DemoTheme';

const NPM_URL = 'https://www.npmjs.com/package/@jbpark/ui-kit';
const DOCS_URL = 'https://ui-kit-docs-lab.vercel.app';
const INSTALL_COMMAND = 'npm install @jbpark/ui-kit';

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
    components: 'Card, Collapse, List, Marquees, Popover, Swiper, Empty',
  },
  {
    name: 'Feedback',
    components: 'Modal, Drawer, Toast, Result, Progress, Skeleton, Spin',
  },
  {
    name: 'Navigation',
    components: 'Menu, Dropdown, FloatButton',
  },
  {
    name: 'Layout',
    components: 'Layout, Container, Grid, PageHeader, Splitter',
  },
] as const;

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
    <Layout
      title="ui-kit — React UI component library"
      description="Modern React UI component library built with TypeScript, Tailwind CSS, and Radix UI. Featuring atoms, molecules, organisms and layout templates for building beautiful interfaces."
    >
      <DemoTheme>
        <div className="mx-auto flex max-w-5xl flex-col gap-24 px-6 py-16">
          <section className="flex flex-col items-center gap-6 text-center">
            <img
              src="https://img.shields.io/npm/v/@jbpark/ui-kit.svg?style=flat-square&color=white&labelColor=262626"
              alt="npm version"
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
                  variant="solid"
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
            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
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
        </div>
      </DemoTheme>
    </Layout>
  );
}
