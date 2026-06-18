# Design System Example

Reusable design library based on [shadcn/ui](https://ui.shadcn.com), aligned with the [Figma shadcn kit](https://www.figma.com/design/QbrZMpnpDjla1QhoU5tTQL/shadcn-ui-components-with-variables---Tailwind-classes---Updated-January-2026--Community-?node-id=72-2591). The same components are re-skinned across projects by swapping a theme — no fork required.

## Structure

```
packages/
  ui/       @workspace/ui     — shadcn components (stable API + a11y)
  tokens/   @workspace/tokens  — Theme Contract + brand theme CSS
apps/
  web/      demo app with a live theme switcher
```

## How multi-design works

Components never hardcode colors — they read CSS variables (`--primary`, `--border`, `--radius`, `--font-sans`, ...), exactly matching the Figma kit's variable names. A brand theme is just a CSS file overriding those variables under a `[data-theme="..."]` selector.

| Theme   | `--primary` | `--radius` | font  | shadow |
|---------|-------------|------------|-------|--------|
| default | neutral     | 0.625rem   | Inter | soft   |
| acme    | red         | 1rem       | Geist | soft, tinted |
| sharp   | blue        | 0.25rem    | IBM Plex / system | flat |

Switch the active theme by setting `data-theme` on `<html>` (see `apps/web/src/components/brand-theme-provider.tsx`).

### Add a new brand (re-skin)

1. Create `packages/tokens/themes/your-brand.css` with `[data-theme="your-brand"] { ... }` overriding the brand + appearance tokens.
2. Run `pnpm validate-themes` — it checks the file provides every key in `packages/tokens/contract.json`.
3. Import it in the consumer and set `data-theme="your-brand"`.

The component package `@workspace/ui` is untouched.

## Theme Contract

`packages/tokens/contract.json` lists the tokens every theme must supply:

- `required` — semantic shadcn tokens (`--background`, `--foreground`, `--primary`, ...)
- `brand` — per-brand re-skin tokens (`--primary`, `--primary-foreground`, `--font-sans`)
- `appearance` — `--radius`, `--shadow-card`, `--border-width`
- `typography` — `--font-size-sm`, `--line-height-sm`, `--font-weight-medium`, ...
- `spacing` — `--spacing-4`, `--spacing-2-5`
- `stroke` — `--stroke-1`, `--stroke-2`

Structural primitives (`typography`, `spacing`, `stroke`) are shared across brands and live in `packages/tokens/themes/base.css`. Each brand file only overrides `brand` + `appearance`. `pnpm validate-themes` fails CI if `base.css` is missing a primitive or any brand theme is missing a brand/appearance key.

## Commands

```bash
pnpm install
pnpm dev               # demo app at http://localhost:5173
pnpm typecheck
pnpm build
pnpm validate-themes   # verify every theme satisfies the contract

pnpm --filter @workspace/ui storybook        # component explorer at http://localhost:6006
pnpm --filter @workspace/ui build-storybook   # static Storybook build
```

## Storybook

`packages/ui` ships a Storybook with two independent toolbar switches:

- **Brand** — `Default` / `Acme` / `Sharp` (sets `data-theme` on `<html>`)
- **Mode** — `Light` / `Dark` (toggles the `.dark` class)

Every story re-skins live via the token contract, so the explorer doubles as QA for theme coverage. Stories live next to components (`*.stories.tsx`); the `Introduction` page documents theming and the coverage table.

## Component coverage

The library tracks the shadcn Figma kit in phases toward ~80% practical coverage. Full mapping in [docs/figma-inventory.md](docs/figma-inventory.md).

| Wave | Components | Status |
|------|------------|--------|
| P0 — foundation | button, input, label, checkbox, accordion, badge, avatar, card, dialog, tabs, tooltip, select, dropdown-menu, separator | done |
| P1 — next wave | radio-group, switch, textarea, popover, sonner, sheet, breadcrumb | done |
| P2 — high value | table, pagination, field (forms), calendar, command, sidebar, alert, alert-dialog | done |
| P3 — rounding | progress, slider, toggle, toggle-group, collapsible, scroll-area, hover-card, aspect-ratio, input-otp | done |
| Skip — low ROI | carousel, chart, marketing blocks | deferred |

40 component files ≈ 80%+ of the kit. Every component is exercised under all three themes in the demo app.

## Add components

```bash
pnpm dlx shadcn@latest add dialog tabs select -c packages/ui
```

Components land in `packages/ui/src/components/`.

## Figma workflow

1. Design screens using the shadcn Figma kit (`fileKey: QbrZMpnpDjla1QhoU5tTQL`).
2. Use the Figma MCP `get_design_context` for design-to-code, then import from `@workspace/ui/components/*` instead of generating raw Tailwind.
3. Multi-design in Figma (optional): add a `brand` variable collection with one mode per client; the code side mirrors this with theme files.

Publishing to npm or Figma team library is optional — this repo is set up for internal reuse across projects.
