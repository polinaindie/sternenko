import { XIcon } from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { siteControlClass } from "./report-ui"

export type FilterChip = {
  id: string
  label: string
  /** Частка застосованого фільтра в поточному результаті — нуль пояснює порожню таблицю. */
  count: number
}

type FilterChipsProps = {
  chips: FilterChip[]
  onRemove: (chip: FilterChip) => void
  onClear?: () => void
  clearLabel?: string
  className?: string
}

export function FilterChips({
  chips,
  onRemove,
  onClear,
  clearLabel = "Очистити всі",
  className,
}: FilterChipsProps) {
  if (chips.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => (
        <Badge
          key={chip.id}
          variant="outline"
          className="h-7 gap-1 border-primary bg-background pr-1 text-foreground"
        >
          <span className="max-w-[240px] truncate">{chip.label}</span>
          <span className="shrink-0 tabular-nums">
            (<span className="sr-only">записів: </span>
            {chip.count.toLocaleString("uk-UA")})
          </span>
          <button
            type="button"
            aria-label={`Прибрати фільтр «${chip.label}»`}
            onClick={() => onRemove(chip)}
            className="text-muted-foreground hover:text-foreground focus-visible:text-foreground inline-flex size-6 shrink-0 items-center justify-center rounded-none transition-colors hover:bg-primary/15"
          >
            <XIcon className="size-3.5" aria-hidden />
          </button>
        </Badge>
      ))}
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
  )
}
