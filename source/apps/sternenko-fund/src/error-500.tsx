import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@workspace/ui/globals.css"
import "@workspace/ui/sternenko-fund-fonts.css"
import "@workspace/tokens/themes/base.css"
import "@workspace/tokens/themes/sternenko-fund.css"

import { ThemeProvider } from "@workspace/ui/providers/theme-provider"

import { ServerErrorPage } from "./pages/error/ServerErrorPage.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <ServerErrorPage />
    </ThemeProvider>
  </StrictMode>
)
