import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@workspace/ui/globals.css"
import "@workspace/ui/sternenko-fund-fonts.css"
import "@workspace/tokens/themes/base.css"
import "@workspace/tokens/themes/sternenko-fund.css"

import { ThemeProvider } from "@workspace/ui/providers/theme-provider"

import { App } from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
