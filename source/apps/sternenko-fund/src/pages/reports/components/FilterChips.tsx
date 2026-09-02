import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { XIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"
import { cn } from "@workspace/ui/lib/utils"

import {
  CHIP_ROW_GAP_PX,
  resolveVisibleChipCount,
  type ChipMetrics,
} from "../lib/filter-chip-rows"
import { siteControlClass } from "./report-ui"

export type FilterChip = {
  id: string
  label: string
  /** Частка застосованого фільтра в поточному результаті — нуль пояснює порожню таблицю. */
  count: number
}

type FilterChipsProps = {
  chips: FilterChip[]
  onRemove: (chips: FilterChip[]) => void
  onClear?: () => void
  clearLabel?: string
  className?: string
}

const FILTER_REMOVE_TOAST_ID = "report-filter-remove-confirm"

export function confirmRemoveFiltersMessage(count: number): string {
  return count === 1
    ? "Ви впевнені, що хочете видалити фільтр?"
    : "Ви впевнені, що хочете видалити фільтри?"
}

export function queueFilterChip<T extends { id: string }>(
  pending: readonly T[],
  chip: T
): T[] {
  if (pending.some((item) => item.id === chip.id)) return [...pending]
  return [...pending, chip]
}

function RemoveFiltersConfirmToast({
  labels,
  onDelete,
  onDismiss,
}: {
  labels: readonly string[]
  onDelete: () => void
  onDismiss: () => void
}) {
  const titleId = useId()

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="relative w-[min(24rem,calc(100vw-2rem))] rounded-none border-0 bg-muted p-4 text-foreground shadow-none"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Закрити"
        className={cn(
          siteControlClass,
          "absolute top-2 right-2 text-foreground hover:bg-primary/15"
        )}
        onClick={onDismiss}
      >
        <XIcon className="size-3.5" aria-hidden />
      </Button>
      <p id={titleId} className="pr-8 text-sm text-foreground">
        {confirmRemoveFiltersMessage(labels.length)}
        <span className="sr-only">
          {" "}
          {labels.join(", ")}
        </span>
      </p>
      <div
        className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1.5 pr-8"
        aria-hidden="true"
      >
        {labels.map((label, index) => (
          <span key={`${label}-${index}`} className="inline-flex items-center">
            <Badge
              variant="outline"
              className="h-7 max-w-[240px] truncate border-transparent bg-primary/60 px-2 font-normal text-foreground dark:bg-primary/20"
            >
              {label}
            </Badge>
            {index < labels.length - 1 ? (
              <span className="pl-1 text-sm text-foreground">,</span>
            ) : null}
          </span>
        ))}
      </div>
      <div className="mt-4 -mx-4 flex flex-wrap gap-2 border-t border-foreground/20 px-4 pt-3 [font-family:var(--font-sans)]">
        <Button
          type="button"
          variant="outline"
          className={cn(
            siteControlClass,
            "border-destructive bg-destructive font-normal text-white hover:border-destructive hover:bg-destructive/90 hover:text-white dark:border-destructive dark:bg-destructive dark:text-[#1E1E1E] dark:hover:border-destructive dark:hover:bg-destructive/80 dark:hover:text-[#1E1E1E]"
          )}
          onClick={onDelete}
        >
          Видалити
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn(siteControlClass, "font-normal")}
          onClick={onDismiss}
        >
          Скасувати
        </Button>
      </div>
    </div>
  )
}

export type CollapsedChipsView<T> = {
  visible: T[]
  hiddenCount: number
  collapsible: boolean
}

export function pluralizeFilters(count: number): string {
  const withinHundred = Math.abs(count) % 100
  const lastDigit = withinHundred % 10

  if (withinHundred >= 11 && withinHundred <= 14) return "фільтрів"
  if (lastDigit === 1) return "фільтр"
  if (lastDigit >= 2 && lastDigit <= 4) return "фільтри"
  return "фільтрів"
}

export function expandChipsLabel(count: number): string {
  return `Ще ${count.toLocaleString("uk-UA")} ${pluralizeFilters(count)}`
}

/** `limit` нуль означає «не згортати» — інакше фільтр неможливо було б зняти. */
export function collapseFilterChips<T>(
  chips: readonly T[],
  { limit, expanded }: { limit: number; expanded: boolean }
): CollapsedChipsView<T> {
  const collapsible = limit > 0 && chips.length > limit

  if (!collapsible || expanded) {
    return { visible: [...chips], hiddenCount: 0, collapsible }
  }

  return {
    visible: chips.slice(0, limit),
    hiddenCount: chips.length - limit,
    collapsible: true,
  }
}

/** Чипи, перемикач і «Очистити всі» — сусіди одного потоку, інакше перенос рядків рахується неправильно. */
const chipFlowClass = "flex flex-wrap items-center gap-2"

function ChipBadge({
  chip,
  onRemove,
  interactive,
  measured = false,
}: {
  chip: FilterChip
  onRemove: (chip: FilterChip) => void
  interactive: boolean
  measured?: boolean
}) {
  return (
    <Badge
      variant="outline"
      data-measure-chip={measured ? "" : undefined}
      className="h-7 gap-1 border-transparent bg-primary/60 pr-1 text-foreground dark:bg-primary/20"
    >
      <span className="max-w-[240px] truncate">{chip.label}</span>
      <span className="shrink-0 tabular-nums">
        (<span className="sr-only">записів: </span>
        {chip.count.toLocaleString("uk-UA")})
      </span>
      <button
        type="button"
        tabIndex={interactive ? undefined : -1}
        aria-label={`Прибрати фільтр «${chip.label}»`}
        onClick={interactive ? () => onRemove(chip) : undefined}
        /* Сірий muted на жовтій заливці дає 1.45:1, тож хрестик тримаємо в колір тексту. */
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-none text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <XIcon className="size-3.5" aria-hidden />
      </button>
    </Badge>
  )
}

export function FilterChips({
  chips,
  onRemove,
  onClear,
  clearLabel = "Очистити всі",
  className,
}: FilterChipsProps) {
  const [expanded, setExpanded] = useState(false)
  const [rowLimit, setRowLimit] = useState(0)
  const [pendingRemove, setPendingRemove] = useState<FilterChip[]>([])
  const measureRef = useRef<HTMLDivElement>(null)
  const onRemoveRef = useRef(onRemove)
  onRemoveRef.current = onRemove

  const measure = useCallback(() => {
    const node = measureRef.current
    if (!node) return

    const items: ChipMetrics[] = Array.from(
      node.querySelectorAll<HTMLElement>("[data-measure-chip]")
    ).map((item) => ({
      top: item.offsetTop,
      left: item.offsetLeft,
      width: item.offsetWidth,
    }))

    const reservedWidth = Array.from(
      node.querySelectorAll<HTMLElement>("[data-measure-control]")
    ).reduce(
      (total, control) => total + control.offsetWidth + CHIP_ROW_GAP_PX,
      0
    )

    setRowLimit(resolveVisibleChipCount(items, node.clientWidth, reservedWidth))
  }, [])

  useLayoutEffect(() => {
    measure()
  }, [chips, measure])

  useEffect(() => {
    const node = measureRef.current
    if (!node || typeof ResizeObserver === "undefined") return

    const observer = new ResizeObserver(() => measure())
    observer.observe(node)
    return () => observer.disconnect()
  }, [measure])

  useEffect(() => {
    if (chips.length === 0) {
      toast.dismiss(FILTER_REMOVE_TOAST_ID)
    }

    const available = new Set(chips.map((chip) => chip.id))
    setPendingRemove((current) => {
      const next = current.filter((chip) => available.has(chip.id))
      if (
        next.length === current.length &&
        next.every((chip, index) => chip.id === current[index]?.id)
      ) {
        return current
      }
      return next
    })
  }, [chips])

  useEffect(() => {
    if (pendingRemove.length === 0) {
      toast.dismiss(FILTER_REMOVE_TOAST_ID)
      return
    }

    const queued = pendingRemove
    toast.custom(
      (toastId) => (
        <RemoveFiltersConfirmToast
          labels={queued.map((chip) => chip.label)}
          onDelete={() => {
            toast.dismiss(toastId)
            toast.dismiss(FILTER_REMOVE_TOAST_ID)
            setPendingRemove([])
            onRemoveRef.current(queued)
          }}
          onDismiss={() => {
            toast.dismiss(toastId)
            toast.dismiss(FILTER_REMOVE_TOAST_ID)
            setPendingRemove([])
          }}
        />
      ),
      {
        id: FILTER_REMOVE_TOAST_ID,
        duration: Number.POSITIVE_INFINITY,
        unstyled: true,
        position: "top-right",
        className: "border-0 bg-transparent p-0 shadow-none",
      }
    )
  }, [pendingRemove])

  useEffect(() => {
    if (pendingRemove.length === 0) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.preventDefault()
      setPendingRemove([])
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [pendingRemove.length])

  useEffect(
    () => () => {
      toast.dismiss(FILTER_REMOVE_TOAST_ID)
    },
    []
  )

  const requestRemove = (chip: FilterChip) => {
    setPendingRemove((current) => queueFilterChip(current, chip))
  }

  if (chips.length === 0) return null

  const view = collapseFilterChips(chips, { limit: rowLimit, expanded })

  return (
    <div className={cn("relative min-w-0", className)}>
      {/* Прихована копія повного потоку: єдиний спосіб дізнатись, де саме ляже перенос рядка. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className={cn(
          chipFlowClass,
          "pointer-events-none invisible absolute inset-x-0 top-0"
        )}
      >
        {chips.map((chip) => (
          <ChipBadge
            key={chip.id}
            chip={chip}
            onRemove={requestRemove}
            interactive={false}
            measured
          />
        ))}
        <span
          data-measure-control
          className="inline-flex h-7 items-center px-2 text-sm"
        >
          {expandChipsLabel(chips.length)}
        </span>
        {onClear ? (
          <span
            data-measure-control
            className="inline-flex h-7 items-center px-2 text-sm"
          >
            {clearLabel}
          </span>
        ) : null}
      </div>

      <div className={chipFlowClass}>
        {view.visible.map((chip) => (
          <ChipBadge
            key={chip.id}
            chip={chip}
            onRemove={requestRemove}
            interactive
          />
        ))}
        {view.collapsible ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-expanded={expanded}
            className={cn(siteControlClass, "h-7 px-2 text-sm")}
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? "Згорнути" : expandChipsLabel(view.hiddenCount)}
          </Button>
        ) : null}
        {onClear ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              siteControlClass,
              "text-muted-foreground hover:text-foreground"
            )}
            onClick={onClear}
          >
            {clearLabel}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
