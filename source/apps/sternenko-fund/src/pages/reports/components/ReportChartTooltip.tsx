import {
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"

import { cn } from "@workspace/ui/lib/utils"

/**
 * Рамка нейтральна, а не в кольорі серії: серію називає заголовок,
 * тож колір не має лишатись єдиним носієм цієї інформації.
 */
export const reportChartTooltipContentClass = cn(
  "rounded-[var(--radius-report)] border-2 border-background/15 bg-foreground px-3 py-2 text-background shadow-none"
)

type ReportChartTooltipRow = {
  label: string
  value: string
}

type ReportChartTooltipBodyProps = {
  title: string
  rows: ReportChartTooltipRow[]
}

export function ReportChartTooltipBody({
  title,
  rows,
}: ReportChartTooltipBodyProps) {
  return (
    <div className="grid min-w-32 items-start gap-1.5">
      <div className="[font-family:var(--font-display-black)] text-sm">
        {title}
      </div>
      <div className="grid gap-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex w-full items-baseline gap-1.5">
            <span className="text-sm text-background/70">{row.label}</span>
            <span
              aria-hidden="true"
              className="min-w-6 flex-1 border-b-2 border-dotted border-background/40"
            />
            <span className="text-sm tabular-nums">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const CURSOR_GAP = 14
const VIEWPORT_PADDING = 8

type Anchor = { x: number; y: number }

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

type ChartCursorTooltipProps = {
  body: ReactNode
  children: ReactElement<HTMLAttributes<HTMLElement>>
}

/**
 * Підказка над курсором. Radix кріпить контент до елемента, а тут потрібна
 * прив'язка до вказівника; з клавіатури якорем стає верх самого елемента.
 */
export function ChartCursorTooltip({
  body,
  children,
}: ChartCursorTooltipProps) {
  const id = useId()
  const [anchor, setAnchor] = useState<Anchor | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!anchor || !box) return

    const { width, height } = box.getBoundingClientRect()
    const above = anchor.y - CURSOR_GAP - height
    box.style.left = `${clamp(
      anchor.x - width / 2,
      VIEWPORT_PADDING,
      window.innerWidth - width - VIEWPORT_PADDING
    )}px`
    box.style.top = `${above >= VIEWPORT_PADDING ? above : anchor.y + CURSOR_GAP}px`
  }, [anchor])

  useEffect(() => {
    if (!anchor) return
    const hide = () => setAnchor(null)
    window.addEventListener("scroll", hide, true)
    return () => window.removeEventListener("scroll", hide, true)
  }, [anchor])

  const trackPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return
    setAnchor({ x: event.clientX, y: event.clientY })
  }

  const anchorToElement = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    setAnchor({ x: rect.left + rect.width / 2, y: rect.top })
  }

  const trigger = cloneElement(children, {
    "aria-describedby": anchor ? id : undefined,
    onPointerEnter: trackPointer,
    onPointerMove: trackPointer,
    onPointerLeave: () => setAnchor(null),
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") return
      anchorToElement(event.currentTarget)
    },
    onFocus: (event: { currentTarget: HTMLElement }) =>
      anchorToElement(event.currentTarget),
    onBlur: () => setAnchor(null),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Escape" || !anchor) return
      event.stopPropagation()
      setAnchor(null)
    },
  } as Partial<HTMLAttributes<HTMLElement>>)

  return (
    <>
      {trigger}
      {anchor
        ? createPortal(
            <div
              ref={boxRef}
              id={id}
              role="tooltip"
              className={cn(
                "pointer-events-none fixed z-50 w-max max-w-xs",
                reportChartTooltipContentClass
              )}
              style={{ left: anchor.x, top: anchor.y }}
            >
              {body}
            </div>,
            document.body
          )
        : null}
    </>
  )
}
