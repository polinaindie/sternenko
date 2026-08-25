import { useMemo, useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { formatReportNumber, UAH_SUFFIX } from "@workspace/ui/components/report-metric"
import { cn } from "@workspace/ui/lib/utils"

import {
  findIncomeAmountPreset,
  INCOME_AMOUNT_PRESETS,
  type IncomeAmountPreset,
} from "../lib/income-analytics"
import {
  filterPopoverContentClass,
  FilterPopoverApplyButton,
  FilterPopoverResetButton,
  siteFilterTriggerActiveClass,
  siteFilterTriggerClass,
  useFilterControlId,
} from "./report-ui"

export type AmountRange = {
  min: number | null
  max: number | null
}

type AmountRangeFilterProps = {
  value: AmountRange
  onChange: (value: AmountRange) => void
  presets?: readonly IncomeAmountPreset[]
  defaultMin?: number
  defaultMax?: number
  placeholder?: string
  id?: string
}

function parseAmountInput(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".")
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function formatAmountLabel(
  value: AmountRange,
  placeholder: string,
  presets: readonly IncomeAmountPreset[]
): string {
  const preset = findIncomeAmountPreset(value, presets)
  if (preset) return preset.label

  const { min, max } = value
  if (min == null && max == null) return placeholder
  if (min != null && max != null) {
    return `${formatReportNumber(min)} – ${formatReportNumber(max)}${UAH_SUFFIX}`
  }
  if (min != null) return `від ${formatReportNumber(min)}${UAH_SUFFIX}`
  return `до ${formatReportNumber(max!)}${UAH_SUFFIX}`
}

function draftFromBound(bound: number | null): string {
  return bound == null ? "" : String(bound)
}

function resolveAppliedRange(min: number | null, max: number | null): AmountRange {
  if (min != null && max != null && min > max) {
    return { min: max, max: min }
  }

  return { min, max }
}

function syncDraftFromValue(value: AmountRange) {
  return {
    min: draftFromBound(value.min),
    max: draftFromBound(value.max),
  }
}

function isAmountRangeActive(value: AmountRange): boolean {
  return value.min != null || value.max != null
}

export function AmountRangeFilter({
  value,
  onChange,
  presets = INCOME_AMOUNT_PRESETS,
  defaultMin = 0,
  defaultMax = 100_000,
  placeholder = "Будь-яка сума",
  id,
}: AmountRangeFilterProps) {
  const controlId = useFilterControlId(id)
  const [open, setOpen] = useState(false)
  const [draftMin, setDraftMin] = useState("")
  const [draftMax, setDraftMax] = useState("")

  const draftRange = useMemo(
    () => ({
      min: parseAmountInput(draftMin),
      max: parseAmountInput(draftMax),
    }),
    [draftMin, draftMax]
  )

  const activePresetId = findIncomeAmountPreset(draftRange, presets)?.id
  const isActive = isAmountRangeActive(value)

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      const nextDraft = syncDraftFromValue(value)
      setDraftMin(nextDraft.min)
      setDraftMax(nextDraft.max)
    }
    setOpen(nextOpen)
  }

  const selectPreset = (preset: IncomeAmountPreset) => {
    setDraftMin(draftFromBound(preset.min))
    setDraftMax(draftFromBound(preset.max))
  }

  const apply = () => {
    onChange(resolveAppliedRange(draftRange.min, draftRange.max))
    setOpen(false)
  }

  const reset = () => {
    const anyPreset = presets[0]
    if (anyPreset) {
      selectPreset(anyPreset)
      return
    }

    setDraftMin("")
    setDraftMax("")
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={controlId}
          type="button"
          variant="outline"
          className={cn(
            siteFilterTriggerClass,
            "justify-between",
            isActive && siteFilterTriggerActiveClass
          )}
        >
          <span className="truncate">
            {formatAmountLabel(value, placeholder, presets)}
          </span>
          <ChevronDownIcon
            className={cn("size-4 shrink-0", isActive ? "opacity-80" : "opacity-60")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(filterPopoverContentClass, "gap-0")} align="start">
        <div className="flex w-full min-w-0 flex-col gap-2">
          <div className="flex w-full min-w-0 flex-col gap-0.5">
            {presets.map((preset) => {
              const isActive = activePresetId === preset.id

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={cn(
                    "w-full px-2.5 py-2 text-left text-sm font-normal transition-colors",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>

          <div className="bg-border h-px" />

          <div className="grid w-full min-w-0 grid-cols-2 gap-2">
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-muted-foreground text-xs">Від, ₴</span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder={String(defaultMin)}
                value={draftMin}
                onChange={(event) => setDraftMin(event.target.value)}
              />
            </label>
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-muted-foreground text-xs">До, ₴</span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder={String(defaultMax)}
                value={draftMax}
                onChange={(event) => setDraftMax(event.target.value)}
              />
            </label>
          </div>

          <div className="grid w-full min-w-0 grid-cols-2 gap-2">
            <FilterPopoverResetButton onClick={reset}>Скинути</FilterPopoverResetButton>
            <FilterPopoverApplyButton onClick={apply} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
