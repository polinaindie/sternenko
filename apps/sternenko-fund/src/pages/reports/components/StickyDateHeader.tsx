import { useEffect, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

const STICKY_DATE_TOP = "top-[var(--site-header-offset,4.75rem)]"

function readSiteHeaderOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--site-header-offset")
    .trim()
  if (!raw) return 62
  if (raw.endsWith("rem")) {
    const rem = parseFloat(raw)
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
    return Number.isFinite(rem) && Number.isFinite(root) ? rem * root : 62
  }
  const px = parseFloat(raw)
  return Number.isFinite(px) ? px : 62
}

/**
 * Sticky day label for responsive transaction lists.
 * Lives inside a per-date <section> so the next day's header replaces it on scroll.
 */
export function StickyDateHeader({ date }: { date: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    let observer: IntersectionObserver | null = null

    const connect = () => {
      observer?.disconnect()
      const offset = readSiteHeaderOffsetPx()
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) setIsStuck(!entry.isIntersecting)
        },
        { threshold: 0, rootMargin: `-${offset + 1}px 0px 0px 0px` }
      )
      observer.observe(sentinel)
    }

    connect()
    window.addEventListener("resize", connect)
    return () => {
      window.removeEventListener("resize", connect)
      observer?.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={sentinelRef} className="pointer-events-none h-px" aria-hidden />
      <h3
        className={cn(
          "sticky z-10 flex items-center border-b py-2.5",
          STICKY_DATE_TOP,
          "-mx-[var(--page-gutter)] px-[var(--page-gutter)]",
          "md:-mx-[var(--page-gutter-md)] md:px-[var(--page-gutter-md)]",
          "border-[var(--report-border)]",
          "bg-[color-mix(in_oklch,var(--report-surface)_88%,transparent)] backdrop-blur-md backdrop-saturate-150",
          "text-sm font-medium tracking-[0.02em] text-[var(--report-surface-foreground)] tabular-nums",
          "transition-[box-shadow,background-color,border-color] duration-150",
          isStuck && [
            "border-b-[color-mix(in_srgb,var(--primary)_28%,var(--report-border))]",
            "bg-[color-mix(in_oklch,var(--report-surface)_94%,transparent)]",
            "shadow-[0_2px_10px_color-mix(in_oklch,var(--foreground)_8%,transparent)]",
          ]
        )}
      >
        {date}
      </h3>
    </>
  )
}
