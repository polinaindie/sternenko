# New client checklist

How to turn a brandbook into a themed site without forking components. The
skeleton (`@workspace/ui` + Storybook) stays untouched — a client is **one theme
file plus one app**.

## 1. Map the brandbook to tokens

Pull these from the brandbook and note the target token:

| Brandbook value         | Token                      |
| ----------------------- | -------------------------- |
| Primary color           | `--primary`                |
| Text color on primary   | `--primary-foreground`     |
| Secondary surface       | `--secondary` / `-foreground` |
| Accent surface          | `--accent` / `-foreground` |
| Error/danger color      | `--destructive`            |
| Primary font            | `--font-sans`              |
| Corner rounding         | `--radius`                 |
| Border thickness        | `--border-width`           |
| Card shadow style       | `--shadow-card`            |

Colors are written as `oklch()`; converting a hex value is fine. Everything
else (spacing, breakpoints, layout) lives in `base.css` and never changes per
brand.

## 2. Create the theme

```bash
pnpm create-theme <client-slug>
```

This copies `packages/tokens/themes/_template.css` to
`packages/tokens/themes/<client-slug>.css` and registers the export. Fill in the
values from step 1.

## 3. Add the brand font

If the brandbook uses a specific font, add it once:

- A Fontsource package: `pnpm --filter @workspace/ui add @fontsource-variable/<font>`,
  then `@import` it in `packages/ui/src/styles/globals.css`.
- Or self-hosted files via an `@font-face` rule.

Then reference the family in the theme's `--font-sans`.

## 4. Register the brand for previews

- Add the slug to the **Brand** toolbar in
  `packages/ui/.storybook/preview.tsx` and import its CSS there.
- Run `pnpm validate-themes` — it fails if any required token is missing.

## 5. Verify in Storybook before building pages

```bash
pnpm --filter @workspace/ui storybook
```

Switch **Brand** to the new client and check Light and Dark across Components
and Blocks. Anything that looks off is a theme fix, never a component edit.

## 6. Scaffold the site

```bash
pnpm new-site <client-slug> --theme <client-slug>
```

This creates `apps/<client-slug>/` with the theme already wired. Then:

```bash
pnpm --filter <client-slug> dev
```

## 7. Build pages from the kit

Add screens under `apps/<client-slug>/src/pages/`. Compose them with
`@workspace/ui/components/*`, `@workspace/ui/blocks/*` and the layout primitives
(`PageShell`, `Container`, `Stack`, `Grid`). Use Storybook as the component
reference — do not add client pages to Storybook or `packages/ui`.

Follow the Responsive rules in Storybook (mobile-first, escalate at breakpoints).

## What stays in the theme vs the app

| Customize via theme       | Customize in the app          |
| ------------------------- | ----------------------------- |
| Color, font, radius       | Page layout and column counts |
| Shadow, border width      | Which sections appear where   |
| Light/dark brand values   | Content, copy, images         |

Do not edit component source or hardcode colors inline in a page — that breaks
the "one skeleton, many brands" model.
