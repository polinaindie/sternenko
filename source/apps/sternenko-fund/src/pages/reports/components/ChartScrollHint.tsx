import { useCallback, useEffect, useState, type RefObject } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/** Допуск у пікселях — узгоджено з ChartScrollEdgeFade. */
const SCROLL_EDGE_THRESHOLD = 4

type ChartScrollDiscoveryHintProps = {
  /** Plot ширший за viewport — є горизонтальний скрол. */
  enabled: boolean
  scrollRef: RefObject<HTMLDivElement | null>
}

function scrollChartBy(
  scrollRef: RefObject<HTMLDivElement | null>,
  direction: "left" | "right"
) {
  const el = scrollRef.current
  if (!el) return

  const delta = Math.max(el.clientWidth * 0.75, 200)
  el.scrollBy({
    left: direction === "right" ? delta : -delta,
    behavior: "smooth",
  })
}

/**
 * Стрілки горизонтального скролу: ліва — якщо є контент ліворуч, права —
 * якщо праворуч. Клік прокручує графік. Градієнт країв — ChartScrollEdgeFade.
 */
export function ChartScrollDiscoveryHint({
  enabled,
  scrollRef,
}: ChartScrollDiscoveryHintProps) {
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

  const scrollLeft = useCallback(() => {
    scrollChartBy(scrollRef, "left")
  }, [scrollRef])

  const scrollRight = useCallback(() => {
    scrollChartBy(scrollRef, "right")
  }, [scrollRef])

  if (!enabled) return null

  const arrowButtonClass =
    "inline-flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-background/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"

  return (
    <>
      {edges.left ? (
        <div className="absolute inset-y-0 left-0 z-20 flex w-16 items-center justify-start pl-1">
          <button
            type="button"
            aria-label="Прокрутити графік ліворуч"
            onClick={scrollLeft}
            className={arrowButtonClass}
          >
            <ChevronLeftIcon
              aria-hidden="true"
              className="size-6 opacity-80 motion-safe:animate-scroll-hint-chevron"
            />
          </button>
        </div>
      ) : null}
      {edges.right ? (
        <div className="absolute inset-y-0 right-0 z-20 flex w-16 items-center justify-end pr-1">
          <button
            type="button"
            aria-label="Прокрутити графік праворуч"
            onClick={scrollRight}
            className={arrowButtonClass}
          >
            <ChevronRightIcon
              aria-hidden="true"
              className={cn(
                "size-6 opacity-80 motion-safe:animate-scroll-hint-chevron"
              )}
            />
          </button>
        </div>
      ) : null}
    </>
  )
}
