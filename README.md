# Спільнота Стерненка

Сторінка **звітів** БФ «Спільнота Стерненка».

## Онлайн

https://polinaindie.github.io/sternenko/

## Локальний перегляд

```bash
pnpm install
pnpm dev
```

→ http://localhost:5173/

## Збірка та деплой

Після змін у монорепо `DesignSystemExample`:

```bash
pnpm build
git add dist
git commit -m "Update reports build"
git push
```

GitHub Actions автоматично опублікує `dist/` на GitHub Pages.

## Storybook (дизайн-система)

```bash
pnpm sync:storybook
pnpm dev
```

Тема: жовтий `#FFD62E`, чорний `#1E1E1E`, шрифт Murs Gothic.
