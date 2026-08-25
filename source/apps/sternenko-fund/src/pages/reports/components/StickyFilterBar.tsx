import { useEffect, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import {
  readSiteHeaderOffsetPx,
  stickyBelowTabsTop,
} from "../lib/sticky-offsets"

/**
 * Тримає рядок фільтрів під хедером і вкладками, поки сторінка гортається.
 * Фон і повітря навколо живуть у ::before, щоб липкість не змінювала
 * вертикальний ритм сторінки у звичайному стані.
 */
export function StickyFilterBar({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let observer: IntersectionObserver | null = null

    const connect = () => {
      observer?.disconnect()
      // Обчислений top уже враховує хедер, вкладки та зазор між ними.
      const resolvedTop = parseFloat(getComputedStyle(bar).top)
      const offset = Number.isFinite(resolvedTop)
        ? resolvedTop
        : readSiteHeaderOffsetPx()
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) setIsStuck(entry.intersectionRatio < 1)
        },
        { threshold: [1], rootMargin: `-${offset + 1}px 0px 0px 0px` }
      )
      observer.observe(bar)
    }

    connect()
    window.addEventListener("resize", connect)
    return () => {
      window.removeEventListener("resize", connect)
      observer?.disconnect()
    }
  }, [])

  return (
    <div
      ref={barRef}
      style={{ top: stickyBelowTabsTop }}
      className={cn(
        "sticky z-30",
        // Верхній край заходить під рядок вкладок, щоб між шарами не лишалось шва.
        "before:pointer-events-none before:absolute before:inset-x-0 before:-top-5 before:-bottom-4 before:-z-10 before:bg-background before:content-['']",
        "before:transition-shadow before:duration-150",
        isStuck &&
          "before:shadow-[0_6px_16px_color-mix(in_oklch,var(--foreground)_10%,transparent)]",
        className
      )}
    >
      {children}
    </div>
  )
}
