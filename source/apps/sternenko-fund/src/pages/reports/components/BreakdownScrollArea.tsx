import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/** Допуск у пікселях — узгоджено з ChartScrollHint. */
const SCROLL_EDGE_THRESHOLD = 4
/** Висота згасання на обрізаному краї; під нею сидить стрілка. */
const FADE_SIZE = 40

type ScrollEdges = { top: boolean; bottom: boolean }

/**
 * Картка має напівпрозорий `bg-muted` над темним полотном, тож градієнт-накладка
 * кольором не збіглася б із поверхнею. Маска гасить сам вміст і не залежить
 * від фону.
 */
function edgeFadeMask(edges: ScrollEdges): string | undefined {
  if (!edges.top && !edges.bottom) return undefined

  const head = edges.top ? `transparent 0, #000 ${FADE_SIZE}px` : "#000 0"
  const tail = edges.bottom
    ? `#000 calc(100% - ${FADE_SIZE}px), transparent 100%`
    : "#000 100%"

  return `linear-gradient(to bottom, ${head}, ${tail})`
}

type BreakdownScrollAreaProps = {
  /** Висота вікна прокрутки — рівно стільки рядів, скільки лишаємо видимими. */
  viewportHeight: number
  children: ReactNode
  className?: string
}

/**
 * Вертикальний скрол для списку барів, коли проєктів більше, ніж вміщає картка.
 * Стрілка з’являється на тому краї, де ще є ряди, і прокручує список кліком —
 * як горизонтальні стрілки в надходженнях.
 */
export function BreakdownScrollArea({
  viewportHeight,
  children,
  className,
}: BreakdownScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [edges, setEdges] = useState<ScrollEdges>({
    top: false,
    bottom: false,
  })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const update = () => {
      const { scrollTop, clientHeight, scrollHeight } = el
      setEdges({
        top: scrollTop > SCROLL_EDGE_THRESHOLD,
        bottom:
          scrollTop + clientHeight < scrollHeight - SCROLL_EDGE_THRESHOLD,
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
  }, [])

  const scrollByStep = useCallback((direction: "up" | "down") => {
    const el = scrollRef.current
    if (!el) return

    const delta = Math.max(el.clientHeight * 0.75, 120)
    el.scrollBy({
      top: direction === "down" ? delta : -delta,
      behavior: "smooth",
    })
  }, [])

  const mask = edgeFadeMask(edges)
  const arrowButtonClass =
    "pointer-events-auto inline-flex size-8 items-center justify-center rounded-full text-background transition-colors hover:bg-background/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"

  return (
    // Не flex-1: інакше flex-basis переважив би задану висоту й картка
    // виросла б під усі ряди замість того, щоб їх прокручувати.
    <div
      className={cn("relative w-full min-w-0 shrink-0", className)}
      style={{ height: viewportHeight }}
    >
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {children}
      </div>
      {edges.top ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
          <button
            type="button"
            aria-label="Прокрутити список угору"
            onClick={() => scrollByStep("up")}
            className={arrowButtonClass}
          >
            <ChevronUpIcon
              aria-hidden="true"
              className="size-5 opacity-80 motion-safe:animate-scroll-hint-chevron-vertical"
            />
          </button>
        </div>
      ) : null}
      {edges.bottom ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center">
          <button
            type="button"
            aria-label="Прокрутити список вниз"
            onClick={() => scrollByStep("down")}
            className={arrowButtonClass}
          >
            <ChevronDownIcon
              aria-hidden="true"
              className="size-5 opacity-80 motion-safe:animate-scroll-hint-chevron-vertical"
            />
          </button>
        </div>
      ) : null}
    </div>
  )
}
