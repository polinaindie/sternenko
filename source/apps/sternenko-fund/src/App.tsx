import { ReloadSplash } from "./components/ReloadSplash"
import { SkipToContentLink } from "./components/SkipToContentLink"
import { SiteHeader } from "./components/site-header/SiteHeader"
import { ReportsPage } from "./pages/reports/ReportsPage"
import { Toaster } from "@workspace/ui/components/sonner"

export function App() {
  return (
    <>
      <SkipToContentLink />
      <SiteHeader />
      <div style={{ paddingTop: "var(--site-header-offset, 4.75rem)" }}>
        <ReportsPage />
      </div>
      <Toaster position="top-right" closeButton={false} offset="16px" />
      <ReloadSplash />
    </>
  )
}
