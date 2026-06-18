import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@workspace/ui/globals.css"
__THEME_FONTS_IMPORT__
import "@workspace/tokens/themes/base.css"
import "@workspace/tokens/themes/__THEME_SLUG__.css"

import { ThemeProvider } from "@workspace/ui/providers/theme-provider"

import { App } from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
