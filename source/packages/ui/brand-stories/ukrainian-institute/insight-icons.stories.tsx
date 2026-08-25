import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  InsightIcon,
  insightIconCategories,
  insightIconSources,
  type InsightIconName,
} from "@workspace/ui/icons/insight-icon"

const meta = {
  title: "Ukrainian Institute/Icons",
  tags: ["ukrainian-institute"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Icons extracted from [Insight UA](https://insight.ui.org.ua/programmes-and-projects?topic=performance) — inline UI glyphs and Storyblok brand/social assets.",
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const iconNames = Object.keys(insightIconSources) as InsightIconName[]

function IconTile({ name }: { name: InsightIconName }) {
  const category = insightIconCategories[name]
  const onDark = category === "ui" || category === "social"
  const size =
    category === "brand"
      ? "h-8 w-auto max-w-full"
      : name === "empty-state"
        ? "size-[70px]"
        : name === "search"
          ? "size-7"
          : "size-6"

  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--product-radius,4px)] border border-border bg-card p-4 text-center">
      <div
        className={`flex min-h-20 w-full items-center justify-center rounded-[var(--product-radius,4px)] p-4 ${
          onDark ? "bg-foreground text-background" : "bg-background text-foreground"
        }`}
      >
        <InsightIcon name={name} className={size} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold tracking-[-0.04em]">{name}</p>
        <p className="text-xs capitalize text-muted-foreground">{category}</p>
      </div>
    </div>
  )
}

export const Catalog: Story = {
  render: () => (
    <div className="bg-background px-6 py-10 md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[-0.04em] text-primary">
            Insight UA
          </p>
          <h1 className="text-4xl font-bold tracking-[-0.04em] md:text-5xl">
            Icon catalog
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {iconNames.length} icons from the programmes catalog page and shared
            Insight chrome — UI strokes, brand marks, and footer social links.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-[-0.04em]">UI</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {iconNames
              .filter((name) => insightIconCategories[name] === "ui")
              .map((name) => (
                <IconTile key={name} name={name} />
              ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-[-0.04em]">Brand</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {iconNames
              .filter((name) => insightIconCategories[name] === "brand")
              .map((name) => (
                <IconTile key={name} name={name} />
              ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-[-0.04em]">Social</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {iconNames
              .filter((name) => insightIconCategories[name] === "social")
              .map((name) => (
                <IconTile key={name} name={name} />
              ))}
          </div>
        </section>
      </div>
    </div>
  ),
}

export const Search: Story = {
  render: () => (
    <div className="flex items-center gap-3 bg-foreground p-6 text-background">
      <InsightIcon name="search" className="size-7" />
      <span className="font-bold tracking-[-0.04em]">Header search</span>
    </div>
  ),
}

export const ExternalLink: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-6">
      <span className="font-bold tracking-[-0.04em]">Visit website</span>
      <InsightIcon name="external-link" className="size-3 text-primary" />
    </div>
  ),
}
