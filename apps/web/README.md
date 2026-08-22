# Web App

Docusaurus-based landing page for the ui-kit package. It consumes `@repo/ui` as a workspace package to render live components on the homepage.

## Getting Started

From the monorepo root:

```bash
pnpm dev --filter=web
```

Open http://localhost:3000.

## Useful Scripts

```bash
# Development
pnpm dev --filter=web

# Build
pnpm build --filter=web

# Type checking
pnpm check-types --filter=web

# Lint
pnpm lint --filter=web
```
