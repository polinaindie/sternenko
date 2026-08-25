import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@workspace/ui/globals.css"
import "@workspace/ui/ukrainian-institute-fonts.css"
import "@workspace/tokens/themes/base.css"
import "@workspace/tokens/themes/ukrainian-institute.css"

import { ThemeProvider } from "@workspace/ui/providers/theme-provider"

import { App } from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
