import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@workspace/ui/globals.css"
import "@workspace/tokens/themes/base.css"
import "@workspace/tokens/themes/default.css"
import "@workspace/tokens/themes/acme.css"
import "@workspace/tokens/themes/sharp.css"
import { BrandThemeProvider } from "@workspace/ui/providers/brand-theme-provider"
import { ThemeProvider } from "@workspace/ui/providers/theme-provider"

import { App } from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrandThemeProvider>
        <App />
      </BrandThemeProvider>
    </ThemeProvider>
  </StrictMode>
)
