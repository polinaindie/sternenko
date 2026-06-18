---
name: new-site-workflow
description: >-
  Scaffold and build client sites in apps/<name>/ using the design system.
  Use when creating a new client site, adding pages, or composing UI from
  Storybook components. Storybook is the reference; pages live in apps/.
---

# New site workflow

## Boundaries

- **Storybook** (`packages/ui/`) — component and block reference only
- **Client sites** (`apps/<name>/`) — all pages, content, routing, copy
- **Never** create `packages/ui/src/pages/` or client-specific Storybook stories

## New client site

```bash
pnpm create-theme <slug>          # if theme does not exist yet
pnpm new-site <name> --theme <slug>
pnpm --filter <name> dev
```

Pages go in `apps/<name>/src/pages/`. Data and copy stay in the app, not in
`packages/ui`.

## Building a page

1. Check the matching Storybook story for components/blocks to use
2. Import from `@workspace/ui/components/*`, `blocks/*`, `layout/*`
3. Use layout primitives: `PageShell`, `Container`, `Stack`, `Grid`
4. Colors and typography come from the theme — no hardcoded brand colors
5. Follow `packages/ui/src/stories/Responsive.mdx` for breakpoints

## File layout

```
apps/<name>/src/
├── main.tsx          # theme CSS already imported
├── App.tsx           # imports pages
└── pages/
    └── home/
        ├── HomePage.tsx
        └── home-data.ts   # optional content
```

## Theme vs app

| Theme (`packages/tokens`) | App (`apps/<name>/`) |
| ------------------------- | -------------------- |
| Colors, fonts, radius     | Page structure       |
| Shadows, borders          | Section order        |
| Light/dark values         | Text, images, links  |
