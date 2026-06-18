/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

export const BRAND_THEMES = ["default", "acme", "sharp"] as const
export type BrandTheme = (typeof BRAND_THEMES)[number]

const STORAGE_KEY = "brand-theme"

function isBrandTheme(value: string | null): value is BrandTheme {
  return value !== null && BRAND_THEMES.includes(value as BrandTheme)
}

type BrandThemeContextValue = {
  brandTheme: BrandTheme
  setBrandTheme: (theme: BrandTheme) => void
}

const BrandThemeContext = React.createContext<
  BrandThemeContextValue | undefined
>(undefined)

function applyBrandTheme(theme: BrandTheme) {
  document.documentElement.setAttribute("data-theme", theme)
}

export function BrandThemeProvider({
  children,
  defaultTheme = "default",
}: {
  children: React.ReactNode
  defaultTheme?: BrandTheme
}) {
  const [brandTheme, setBrandThemeState] = React.useState<BrandTheme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isBrandTheme(stored) ? stored : defaultTheme
  })

  const setBrandTheme = React.useCallback((theme: BrandTheme) => {
    localStorage.setItem(STORAGE_KEY, theme)
    setBrandThemeState(theme)
  }, [])

  React.useEffect(() => {
    applyBrandTheme(brandTheme)
  }, [brandTheme])

  const value = React.useMemo(
    () => ({ brandTheme, setBrandTheme }),
    [brandTheme, setBrandTheme]
  )

  return (
    <BrandThemeContext.Provider value={value}>
      {children}
    </BrandThemeContext.Provider>
  )
}

export function useBrandTheme() {
  const context = React.useContext(BrandThemeContext)
  if (!context) {
    throw new Error("useBrandTheme must be used within BrandThemeProvider")
  }
  return context
}
