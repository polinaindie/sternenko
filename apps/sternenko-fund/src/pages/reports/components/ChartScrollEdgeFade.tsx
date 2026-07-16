import { useEffect, useState, type RefObject } from "react"

/** Допуск у пікселях, щоб субпіксельні значення не лишали градієнт на самому краї. */
const SCROLL_EDGE_THRESHOLD = 4

type ChartScrollEdgeFadeProps = {
  scrollRef: RefObject<HTMLDivElement | null>
  /** needsScroll — plot ширший за viewport. */
  enabled: boolean
}

/**
 * Постійні градієнти на обрізаних краях scroll-контейнера. Декоративні
 * (`aria-hidden`), показуються динамічно за позицією скролу: правий — поки є
 * контент праворуч, лівий — після прокрутки від початку.
 */
export function ChartScrollEdgeFade({
  scrollRef,
  enabled,
}: ChartScrollEdgeFadeProps) {
  const [edges, setEdges] = useState({ left: false, right: false })

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !enabled) {
      setEdges({ left: false, right: false })
      return
    }

    const update = () => {
      const { scrollLeft, clientWidth, scrollWidth } = el
      setEdges({
        left: scrollLeft > SCROLL_EDGE_THRESHOLD,
        right: scrollLeft + clientWidth < scrollWidth - SCROLL_EDGE_THRESHOLD,
      })
    }

    update()
    el.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)

    return () => {
      el.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [scrollRef, enabled])

  if (!enabled) return null

  return (
    <>
      {edges.left ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-foreground via-foreground/85 to-transparent"
        />
      ) : null}
      {edges.right ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-foreground via-foreground/85 to-transparent"
        />
      ) : null}
    </>
  )
}
