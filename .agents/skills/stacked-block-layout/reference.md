# Stacked Block Layout — reference

## Константи

| Token | Value | Notes |
|-------|-------|-------|
| `GUTTER_SIZE` | 15px | Вертикальний і горизонтальний проміжок між колонками |
| `BLOCK_RADIUS` | 12px | Кути блоків |
| `CONNECTOR_WIDTH_RATIO` | 0.7 | Ширина конектора = 70% ширини колонки |
| `HERO_MAX_HEIGHT` | 390px | `max-height` hero-блоку |
| `ROW_HEIGHT` | 160px | Висота рядка з KPI |
| `DEFAULT_BLOCK_COLOR` | `#7F9A6F` | Storybook default; prod → `var(--primary)` |

## SVG connector bar

```tsx
const CONNECTOR_BAR_PATH =
  "M334 0C329.858 0 326.5 3.35787 326.5 7.5C326.5 11.6421 329.858 15 334 15H0C4.14214 15 7.5 11.6421 7.5 7.5C7.5 3.35786 4.14214 0 0 0H334Z"
```

```tsx
<div className="relative size-full">
  <svg viewBox="0 0 334 15" preserveAspectRatio="none" className="size-full" aria-hidden>
    <path d={CONNECTOR_BAR_PATH} fill={blockColor} />
  </svg>
</div>
```

- `preserveAspectRatio="none"` — обов'язково, конектор тягнеться на всю ширину wrapper.
- Concave bite radius = 7.5px (= половина висоти 15px).

## Grid templates

### Three-column (hero + metricRow)

```css
grid-template-columns: minmax(0, 1fr) 15px minmax(0, 1fr) 15px minmax(0, 1fr);
```

**heroPosition="top"**

```css
grid-template-rows: minmax(0, 390px) 15px 160px;
```

| Row | Content |
|-----|---------|
| 1 | Hero, `grid-column: 1 / -1` |
| 2 | Connectors cols 1,3,5 + gutter crosses cols 2,4 |
| 3 | Blocks cols 1,3,5 + gutter crosses cols 2,4 |

**heroPosition="bottom"** — rows reversed: blocks → connectors → hero.

### Two-column (4 blocks + hero)

```css
grid-template-columns: minmax(0, 3fr) 15px minmax(0, 5fr);
```

5 rows when hero on bottom: 160 + 15 + 160 + 15 + minmax(0,390).

## Колонки (three-column)

| Column index | Role |
|--------------|------|
| 1, 3, 5 | Block or connector |
| 2, 4 | Gutter cross — always empty, `aria-hidden` |

## Report palettes (donations)

```css
[data-report-palette="donations"] {
  --primary: oklch(0.702 0.193 39.2); /* #FE6A34 orange */
  --primary-foreground: oklch(0.235 0 0);
}
```

## IncomeMetricsCluster — поточна карта контенту

| Slot | Контент |
|------|---------|
| hero | `CurrencyMetric` — загальна сума, `size="lg"`, children: «За {periodLabel}» |
| metricRow[0] | Середній донат |
| metricRow[1] | Кількість донатів |
| metricRow[2] | `1 ₴ донату = $X` / label «збитків окупанту» |

## Експорти

```tsx
import {
  StackedBlockLayout,
  ConnectorBar,
  CONNECTOR_BAR_PATH,
  GUTTER_SIZE,
  BLOCK_RADIUS,
  HERO_MAX_HEIGHT,
  ROW_HEIGHT,
} from "@workspace/ui/components/stacked-block-layout"
```
