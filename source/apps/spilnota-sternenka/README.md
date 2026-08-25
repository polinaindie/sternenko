# Спільнота Стерненка — Storybook

Статичний експорт дизайн-системи з темою **БФ «Спільнота Стерненка»** (`sternenko-fund`).

Папка `dist/` містить готовий Storybook для деплою на будь-який static hosting (Netlify, Vercel, S3, nginx).

## Команди

```bash
# Зібрати Storybook і скопіювати в dist/
pnpm --filter spilnota-sternenka build

# Переглянути локально
pnpm --filter spilnota-sternenka dev
# → http://localhost:6007
```

## Що всередині

- Компоненти та блоки `@workspace/ui`
- Тема: жовтий `#FFD62E`, чорний `#1E1E1E`, шрифт Murs Gothic
- Light / Dark — перемикач у toolbar
- Без інших брендів і без матеріалів Українського інституту

## Оновлення після змін у kit

Після правок у `packages/ui` або `packages/tokens/themes/sternenko-fund.css`:

```bash
pnpm --filter spilnota-sternenka build
```

Сайт клієнта (окремо): `apps/sternenko-fund/`
