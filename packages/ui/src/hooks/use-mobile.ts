import * as React from "react"

const FALLBACK_BREAKPOINT = 768

// Resolves the mobile breakpoint from the --breakpoint-md token so JS and CSS
// stay in sync. Falls back to 768px if the token is missing or unreadable.
function getMobileBreakpoint() {
  if (typeof window === "undefined") {
    return FALLBACK_BREAKPOINT
  }

  const root = document.documentElement
  const value = getComputedStyle(root).getPropertyValue("--breakpoint-md").trim()

  if (value.endsWith("rem")) {
    const rootFontSize = parseFloat(getComputedStyle(root).fontSize) || 16
    return parseFloat(value) * rootFontSize
  }
  if (value.endsWith("px")) {
    return parseFloat(value)
  }
  return FALLBACK_BREAKPOINT
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const breakpoint = getMobileBreakpoint()
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < breakpoint)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
