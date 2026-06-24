# Запущені dev-сервери

Збережено перед оновленням Cursor. Після перезапуску IDE ці процеси зупиняться — запустіть їх знову командами нижче.

## Активні сервери (на момент збереження)

| Що | URL | Папка | Команда |
|---|---|---|---|
| Storybook (статичний preview) | http://localhost:6006/ | `~/sternenko` | `pnpm dev` |
| Storybook UI (монорепо) | http://localhost:6007/ | `~/DesignSystemExample/packages/ui` | `pnpm exec storybook dev -p 6007 --ci` |
| Сайт фонду (sternenko-fund) | http://localhost:5173/ | `~/DesignSystemExample/apps/sternenko-fund` | `pnpm dev` |
| Дублікат sternenko-fund | http://localhost:5174/ | `~/DesignSystemExample/apps/sternenko-fund` | `pnpm dev` |

> Два процеси `sternenko-fund` — достатньо одного. Якщо порт 5173 зайнятий, Vite автоматично підніме 5174.

## Швидкий перезапуск (3 термінали)

**Термінал 1 — Storybook preview (sternenko):**
```bash
cd ~/sternenko && pnpm dev
```

**Термінал 2 — Storybook UI (дизайн-система):**
```bash
cd ~/DesignSystemExample/packages/ui && pnpm exec storybook dev -p 6007 --ci
```

**Термінал 3 — сайт фонду (звіти, проєкти):**
```bash
cd ~/DesignSystemExample/apps/sternenko-fund && pnpm dev
```

## Корисні посилання

- Storybook тема Стерненка: http://localhost:6006/?path=/docs/introduction--docs
- Звіти фонду (локально): http://localhost:5173/ (або :5174)

## Останні зміни в коді

- Фільтр **«Проєкт»**, placeholder **«Усі проєкти»**
- Список проєктів з https://www.sternenkofund.org/fundraisings
- Файли: `DesignSystemExample/apps/sternenko-fund/src/pages/reports/`
