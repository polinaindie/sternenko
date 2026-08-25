import { useEffect, type RefObject } from "react"

/** Висота хедера до першого заміру ResizeObserver у SiteHeader. */
const FALLBACK_OFFSET_PX = 62

/** Tailwind-клас для sticky-елемента, що стає одразу під хедером. */
export const siteHeaderOffsetTopClass = "top-[var(--site-header-offset,4.75rem)]"

/** Те саме, але лише з lg — на вужчих екранах під хедером липнуть заголовки дат. */
export const siteHeaderOffsetTopLgClass =
  "lg:top-[var(--site-header-offset,4.75rem)]"

/** Висота липкого рядка вкладок — панель фільтрів стає під ним. */
export const stickyTabsHeightVar = "--report-sticky-tabs-height"

/** Хедер + вкладки + 16px повітря; поза липким рядком вкладок змінна дорівнює 0. */
export const stickyBelowTabsTop = `calc(var(--site-header-offset, 4.75rem) + var(${stickyTabsHeightVar}, 0px) + 1rem)`

/** Поточне значення --site-header-offset у пікселях (для rootMargin спостерігачів). */
export function readSiteHeaderOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--site-header-offset")
    .trim()
  if (!raw) return FALLBACK_OFFSET_PX
  if (raw.endsWith("rem")) {
    const rem = parseFloat(raw)
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
    return Number.isFinite(rem) && Number.isFinite(root)
      ? rem * root
      : FALLBACK_OFFSET_PX
  }
  const px = parseFloat(raw)
  return Number.isFinite(px) ? px : FALLBACK_OFFSET_PX
}

/** Тримає --report-sticky-tabs-height у синхроні з реальною висотою рядка вкладок. */
export function useStickyTabsHeightVar(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const syncHeight = () => {
      const height = Math.ceil(element.getBoundingClientRect().height)
      document.documentElement.style.setProperty(
        stickyTabsHeightVar,
        `${height}px`
      )
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(element)

    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty(stickyTabsHeightVar)
    }
  }, [ref])
}
