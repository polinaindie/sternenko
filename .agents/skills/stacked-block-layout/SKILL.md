---
name: stacked-block-layout
description: >-
  Builds and edits merged report metric clusters — stacked colored blocks joined
  by SVG connector bars with concave quarter-circle bites, 15px gutters, and
  empty cross-cells. Use when the user asks for злитні блоки, merged blocks,
  stacked block layout, connector bars, Rusoriz-style report tiles, KPI clusters,
  or changes to IncomeMetricsCluster / StackedBlockLayout.
---

# Злитні блоки (Stacked Block Layout)

Патерн для звітів БФ «Спільнота Стерненка»: кілька карток **одного кольору**,
візуально з'єднаних **конекторами** — не окремі `ReportCard` з `gap` між ними.

## Джерело правди в коді

| Що | Де |
|----|-----|
| Layout-компонент | `DesignSystemExample/packages/ui/src/components/stacked-block-layout.tsx` |
| Storybook | `stacked-block-layout.stories.tsx` → Report/Stacked Block Layout |
| Референс-імплементація | `DesignSystemExample/apps/sternenko-fund/src/pages/reports/components/IncomeMetricsCluster.tsx` |
| Палітри звіту | `DesignSystemExample/packages/tokens/palettes/sternenko-fund-report-palettes.css` |
| Метрики | `@workspace/ui/components/report-metric` (`CurrencyMetric`, `DisplayMetric`) |

Перед змінами **прочитай** `stacked-block-layout.tsx` і наявний cluster — не
вигадуй gutter/connector з нуля і не повертайся до `MergedReportCluster`, якщо
користувач явно не просить.

## Візуальна логіка

```
┌──────── hero (full width, max ~390px) ────────┐
│  велике число + підпис                         │
└────────────────────────────────────────────────┘
   ╭────╮ 15px row   ╭────╮ 15px row   ╭────╮
┌─────────┐   ░   ┌─────────┐   ░   ┌─────────┐
│ block 1 │ 15px │ block 2 │ 15px │ block 3 │  ← ~160px
└─────────┘   ░   └─────────┘   ░   └─────────┘
```

- **Блоки** — `border-radius: 12px`, колір через `blockColor` (напр. `var(--primary)`).
- **Вертикальні проміжки** між колонками — 15px, **порожні** (фон сторінки).
- **Перетини** 15×15px — теж порожні (`GutterCrossCell`).
- **Конектори** — SVG-планка 15px висотою, **70% ширини колонки**, по центру;
  concave bites radius 7.5px на краях. Деталі — [reference.md](reference.md).

Hero може бути **зверху** (`heroPosition="top"`) або **знизу** (`"bottom"`).

## API `StackedBlockLayout`

### Три колонки + hero (основний кейс звітів)

```tsx
<section data-report-palette="donations" className="w-full min-w-0 text-primary-foreground">
  <StackedBlockLayout
    heroPosition="top"
    blockColor="var(--primary)"
    backgroundColor="transparent"
    heroClassName="flex h-full min-h-0 flex-col justify-end gap-2 text-primary-foreground"
    blockClassName="flex h-full min-h-0 flex-col justify-end gap-1.5 text-primary-foreground"
    hero={<CurrencyMetric amount={...} label="..." size="lg" />}
    metricRow={[
      <CurrencyMetric key="a" ... size="sm" />,
      <DisplayMetric key="b" ... size="sm" />,
      <DisplayMetric key="c" value="1 ₴ донату = $1,91" label="збитків окупанту" size="sm" />,
    ]}
  />
</section>
```

- `metricRow` — **рівно 3** React-вузли; ряд протилежний hero.
- `backgroundColor="transparent"` — проміжки показують фон сторінки.

### Два стовпці (4 блоки + hero)

Без `metricRow` — props `row1Left`, `row1Right`, `row2Left`, опційно `row2Right`.
Сітка `3fr · 15px · 5fr` (37.5% / 62.5%). Якщо `row2Right` відсутній — правий
слот лишається порожнім.

## Темізація

1. Обгорни cluster у `<section data-report-palette="donations">` (або іншу палітру).
2. `blockColor="var(--primary)"` — блоки й конектори одного кольору.
3. Текст — `text-primary-foreground` на обгортці або className блоків.
4. **Не** хардкодь `#FE6A34` у prod — семантичні токени палітри.

## Контент метрик

| Роль | Компонент | size |
|------|-----------|------|
| Hero (головна цифра) | `CurrencyMetric` | `lg` |
| Другорядні KPI | `CurrencyMetric` / `DisplayMetric` | `sm` |

- Контент вирівнюй **до низу** блоку: `flex h-full flex-col justify-end`.
- Підписи метрик — через `label` prop (`DisplayMetric` / `CurrencyMetric`).
- Додатковий текст під hero — `children` у `CurrencyMetric`.
- Для «1 ₴ донату = $X» використовуй `formatUsdPerUah` з `apps/sternenko-fund/.../lib/roi.ts` (uk-UA кома).

## Workflow для нового cluster

1. Визнач **hero** (1 full-width блок) і **metricRow** (3 блоки) або 2×2 сітку.
2. Перевір, чи вистачає існуючого API — **не розширюй** layout без потреби.
3. Створи/онови wrapper (на кшталт `IncomeMetricsCluster`) — тільки дані + метрики.
4. Додай/онови Storybook story, якщо змінювався загальний компонент.
5. `pnpm --filter sternenko-fund typecheck` після змін у app.

## Анти-пatterns

- ❌ Окремі `ReportCard` з `gap-4` замість злиття — втрачається патерн.
- ❌ Чорні internal gutters (`MergedReportCluster`) для donations KPI — застарілий підхід.
- ❌ `border` або `margin` між блоками одного кластера.
- ❌ Конектор іншого кольору, ніж блоки.
- ❌ Заповнювати порожній слот «заглушкою» того ж кольору — cross-cell має лишатися прозорим.
- ❌ Дублювати hero-метрику в малих блоках без запиту.

## Розширення layout

Якщо потрібна **інша** кількість колонок або рядів:

1. Читай `ThreeColumnStackedBlockLayout` / `TwoColumnStackedBlockLayout` у source.
2. Зберігай константи з [reference.md](reference.md) — не міняй ad hoc.
3. Експортуй `ConnectorBar` окремо, якщо потрібен кастомний ряд.
4. Додай `data-layout` атрибут і story для регресії.

## Додатково

- Повна специфікація розмірів, SVG path, grid templates → [reference.md](reference.md)
- Приклади stories → `HeroWithThreeMetricsBelow`, `ThreeBlocksAboveHero`
