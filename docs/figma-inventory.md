# Figma Kit Inventory

Maps the [shadcn/ui Figma kit](https://www.figma.com/design/QbrZMpnpDjla1QhoU5tTQL/shadcn-ui-components-with-variables---Tailwind-classes---Updated-January-2026--Community-?node-id=72-2591) (`fileKey: QbrZMpnpDjla1QhoU5tTQL`) to code components in `@workspace/ui`.

Status legend:

- **done** — implemented in `packages/ui/src/components/`
- **planned** — scheduled for the phased ~80% rollout
- **skip** — low ROI for now (prototype-only frames, marketing blocks, charts)

> Note: This kit mirrors the standard shadcn/ui registry. The Figma MCP only exposes the page currently open in Figma Desktop, so this inventory is keyed to the shadcn registry rather than a live page dump. When the file is open in Desktop, confirm each row against the matching Figma page.

## Coverage summary

| Wave | Count | Status |
|------|-------|--------|
| P0 (foundation) | 14 | done |
| P1 (next wave) | 7 | done |
| P2 (high value) | 8 | done |
| P3 (rounding) | 9 | done |
| Skip (low ROI) | — | skip |

Shipped: 40 component files ≈ 80%+ of the practical kit.

## Component map

| Figma component | shadcn component | Wave | Status |
|-----------------|------------------|------|--------|
| Button | `button` | P0 | done |
| Input | `input` | P0 | done |
| Label | `label` | P0 | done |
| Checkbox | `checkbox` | P0 | done |
| Accordion | `accordion` | P0 | done |
| Badge | `badge` | P0 | done |
| Avatar | `avatar` | P0 | done |
| Card | `card` | P0 | done |
| Dialog | `dialog` | P0 | done |
| Tabs | `tabs` | P0 | done |
| Tooltip | `tooltip` | P0 | done |
| Select | `select` | P0 | done |
| Dropdown Menu | `dropdown-menu` | P0 | done |
| Separator | `separator` | P0 | done |
| Radio Group | `radio-group` | P1 | done |
| Switch | `switch` | P1 | done |
| Textarea | `textarea` | P1 | done |
| Popover | `popover` | P1 | done |
| Toast / Sonner | `sonner` | P1 | done |
| Sheet | `sheet` | P1 | done |
| Breadcrumb | `breadcrumb` | P1 | done |
| Table | `table` | P2 | done |
| Pagination | `pagination` | P2 | done |
| Form | `field` | P2 | done |
| Calendar | `calendar` | P2 | done |
| Date Picker | `calendar` + `popover` | P2 | done |
| Command | `command` | P2 | done |
| Sidebar | `sidebar` | P2 | done |
| Alert / Alert Dialog | `alert`, `alert-dialog` | P2 | done |
| Progress | `progress` | P3 | done |
| Slider | `slider` | P3 | done |
| Toggle | `toggle` | P3 | done |
| Toggle Group | `toggle-group` | P3 | done |
| Collapsible | `collapsible` | P3 | done |
| Scroll Area | `scroll-area` | P3 | done |
| Hover Card | `hover-card` | P3 | done |
| Aspect Ratio | `aspect-ratio` | P3 | done |
| Input OTP | `input-otp` | P3 | done |
| Carousel | `carousel` | — | skip |
| Chart | `chart` | — | skip |
| Marketing blocks | n/a | — | skip |

## Token inventory

| Figma variable | CSS variable | Status |
|----------------|--------------|--------|
| `--foreground` | `--foreground` | done |
| `--border` | `--border` | done |
| `family/sans` | `--font-sans` | done |
| `border-width` | `--border-width` | done |
| (elevation) | `--shadow-card` | done |
| `size/sm` | `--font-size-sm` | done |
| `leading/5` | `--line-height-sm` | done |
| `weight/medium` | `--font-weight-medium` | done |
| `py-4` | `--spacing-4` | done |
| `mr-2,5` | `--spacing-2-5` | done |
| `stroke-1` / `stroke-2` | `--stroke-1` / `--stroke-2` | done |

Typography, spacing and stroke primitives live in `packages/tokens/themes/base.css` (shared across brands); per-brand re-skin tokens live in each theme file.

Raw Tailwind palette (`gray-500`, ...) is intentionally **not** imported — shadcn already provides the semantic layer, and duplicating primitives would cause drift.

> Registry note: shadcn's classic `form` item is now empty in the registry — forms are built with the newer `field` primitive, which is what this kit ships.
