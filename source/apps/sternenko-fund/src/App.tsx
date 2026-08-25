import { SiteHeader } from "./components/site-header/SiteHeader"
import { ReportsPage } from "./pages/reports/ReportsPage"

export function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1100] focus:rounded-none focus:border-2 focus:border-[#FFD62E] focus:bg-[#1E1E1E] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Перейти до вмісту
      </a>
      <SiteHeader />
      <div style={{ paddingTop: "var(--site-header-offset, 4.75rem)" }}>
        <ReportsPage />
      </div>
    </>
  )
}
