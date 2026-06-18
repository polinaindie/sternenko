import * as React from "react"
import type { Decorator, Preview } from "@storybook/react-vite"

import "../src/styles/globals.css"
import "../src/styles/sternenko-fund-fonts.css"
import "../../tokens/themes/base.css"
import "../../tokens/themes/default.css"
import "../../tokens/themes/acme.css"
import "../../tokens/themes/sharp.css"
import "../../tokens/themes/sternenko-fund.css"

const BRAND_ONLY = process.env.STORYBOOK_BRAND_ONLY
const DEFAULT_BRAND = BRAND_ONLY ?? "sternenko-fund"

// Apply brand (data-theme) + appearance (.dark) from the toolbar globals.
function ThemeWrapper({
  brand,
  mode,
  fullscreen,
  children,
}: {
  brand: string
  mode: string
  fullscreen?: boolean
  children: React.ReactNode
}) {
  React.useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-theme", brand)
    root.classList.toggle("dark", mode === "dark")
  }, [brand, mode])

  if (fullscreen) {
    return (
      <div className="bg-background text-foreground min-h-svh w-full">
        {children}
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground flex min-h-32 items-center justify-center rounded-[var(--radius-lg)] p-[var(--page-gutter)] md:p-[var(--page-gutter-md)] lg:p-[var(--page-gutter-lg)]">
      {children}
    </div>
  )
}

const withTheme: Decorator = (Story, context) => (
  <ThemeWrapper
    brand={String(context.globals.brand ?? DEFAULT_BRAND)}
    mode={String(context.globals.mode ?? "light")}
    fullscreen={context.parameters.layout === "fullscreen"}
  >
    <Story />
  </ThemeWrapper>
)

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
  globalTypes: {
    ...(BRAND_ONLY
      ? {}
      : {
          brand: {
            description: "Brand re-skin (data-theme)",
            defaultValue: DEFAULT_BRAND,
            toolbar: {
              title: "Brand",
              icon: "paintbrush",
              dynamicTitle: true,
              items: [
                { value: "default", title: "Default" },
                { value: "acme", title: "Acme" },
                { value: "sharp", title: "Sharp" },
                { value: "sternenko-fund", title: "Спільнота Стерненка" },
              ],
            },
          },
        }),
    mode: {
      description: "Light / dark appearance",
      defaultValue: "light",
      toolbar: {
        title: "Mode",
        icon: "circlehollow",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
      },
    },
  },
  decorators: [withTheme],
}

export default preview
