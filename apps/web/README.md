# Web App

Next.js demo app for the UI-Kit monorepo. It consumes `@repo/ui` as a workspace package.

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
