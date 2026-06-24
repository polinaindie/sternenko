# Спільнота Стерненка

Storybook дизайн-системи з темою **БФ «Спільнота Стерненка»**.

## Запуск

```bash
pnpm install
pnpm dev
```

→ http://localhost:6006/?path=/docs/introduction--docs

## Вміст

- `dist/` — статичний Storybook (компоненти, блоки, тема)
- Тема: жовтий `#FFD62E`, чорний `#1E1E1E`, шрифт Murs Gothic
- Light / Dark у toolbar

## Оновлення Storybook

Після змін у монорепо `DesignSystemExample`:

```bash
pnpm sync
# або вручну:
cd ~/DesignSystemExample
pnpm --filter spilnota-sternenka build
cp -R apps/spilnota-sternenka/dist ~/sternenko/
```
