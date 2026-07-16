import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

import {
  filterPopoverContentClass,
  siteFilterTriggerActiveClass,
  siteFilterTriggerClass,
  useFilterControlId,
} from "./report-ui"

export const FUNDRAISER_UNAVAILABLE_TOOLTIP =
  "Цього збору немає у обраному періоді"

export const PROJECT_UNAVAILABLE_TOOLTIP =
  "Цього проєкту немає у обраному періоді"

const CURSOR_TOOLTIP_OFFSET = 12
const CURSOR_TOOLTIP_SHOW_DELAY_MS = 200

const cursorTooltipClassName =
  "pointer-events-none fixed z-[100] max-w-[13rem] rounded-md bg-foreground px-2 py-1 text-[0.6875rem] leading-snug text-background shadow-md"

type MultiSelectFilterProps = {
  options: readonly string[]
  selected: string[]
  onChange: (selected: string[]) => void
  /** Options visible but not selectable for the current date/period. */
  disabledOptions?: readonly string[]
  /** Shown on hover/focus for disabled options. */
  disabledOptionTooltip?: string
  placeholder?: string
  className?: string
  id?: string
}

export type MultiSelectFilterPanelProps = {
  options: readonly string[]
  selected: string[]
  onChange: (selected: string[]) => void
  disabledOptions?: readonly string[]
  disabledOptionTooltip?: string
  placeholder?: string
  listClassName?: string
  showSelectAllDivider?: boolean
}

function isAllSelected(options: readonly string[], selected: string[]): boolean {
  return selected.length === options.length
}

export function isFilterSelectionActive(
  options: readonly string[],
  selected: string[]
): boolean {
  return selected.length > 0 && !isAllSelected(options, selected)
}

export function selectionLabel(
  options: readonly string[],
  selected: string[],
  placeholder: string
): string {
  if (isAllSelected(options, selected)) return placeholder
  if (selected.length === 0) return placeholder
  if (selected.length === 1) return selected[0]!
  if (selected.length === 2) return `${selected[0]}, ${selected[1]}`
  return `${selected[0]} +${selected.length - 1}`
}

type FilterOptionRowProps = {
  option: string
  optionDisabled: boolean
  checked: boolean
  disabledOptionTooltip?: string
  onToggle: () => void
}

function FilterOptionRow({
  option,
  optionDisabled,
  checked,
  disabledOptionTooltip,
  onToggle,
}: FilterOptionRowProps) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const latestPointerRef = useRef({ x: 0, y: 0 })
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearShowTimer = () => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
  }

  useEffect(() => () => clearShowTimer(), [])

  const handlePointerEnter = (clientX: number, clientY: number) => {
    latestPointerRef.current = { x: clientX, y: clientY }
    clearShowTimer()
    showTimerRef.current = setTimeout(() => {
      setCursor(latestPointerRef.current)
    }, CURSOR_TOOLTIP_SHOW_DELAY_MS)
  }

  const handlePointerMove = (clientX: number, clientY: number) => {
    latestPointerRef.current = { x: clientX, y: clientY }
    setCursor((current) => (current ? latestPointerRef.current : current))
  }

  const handlePointerLeave = () => {
    clearShowTimer()
    setCursor(null)
  }

  const rowClassName = cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left",
    optionDisabled
      ? "cursor-not-allowed opacity-45"
      : "hover:bg-muted cursor-pointer"
  )

  const row = (
    <>
      <Checkbox
        checked={checked}
        disabled={optionDisabled}
        onCheckedChange={onToggle}
      />
      <span className="min-w-0 flex-1 text-sm [overflow-wrap:anywhere]">{option}</span>
    </>
  )

  if (!optionDisabled || !disabledOptionTooltip) {
    return (
      <label aria-disabled={optionDisabled} className={rowClassName}>
        {row}
      </label>
    )
  }

  return (
    <>
      <span
        tabIndex={0}
        aria-disabled="true"
        aria-label={`${option}. ${disabledOptionTooltip}`}
        className={rowClassName}
        onMouseEnter={(event) =>
          handlePointerEnter(event.clientX, event.clientY)
        }
        onMouseMove={(event) =>
          handlePointerMove(event.clientX, event.clientY)
        }
        onMouseLeave={handlePointerLeave}
        onFocus={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          handlePointerEnter(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
          )
        }}
        onBlur={handlePointerLeave}
      >
        {row}
      </span>
      {cursor
        ? createPortal(
            <div
              role="tooltip"
              className={cursorTooltipClassName}
              style={{
                left: cursor.x + CURSOR_TOOLTIP_OFFSET,
                top: cursor.y + CURSOR_TOOLTIP_OFFSET,
              }}
            >
              {disabledOptionTooltip}
            </div>,
            document.body
          )
        : null}
    </>
  )
}

export function MultiSelectFilterPanel({
  options,
  selected,
  onChange,
  disabledOptions = [],
  disabledOptionTooltip = FUNDRAISER_UNAVAILABLE_TOOLTIP,
  placeholder = "Усі",
  listClassName,
  showSelectAllDivider = true,
}: MultiSelectFilterPanelProps) {
  const allSelected = isAllSelected(options, selected)
  const disabled = useMemo(
    () => new Set(disabledOptions),
    [disabledOptions]
  )

  const isDisabled = (value: string) => disabled.has(value)

  const toggleOption = (value: string) => {
    if (isDisabled(value)) return

    if (allSelected) {
      onChange([value])
      return
    }

    if (selected.includes(value)) {
      const next = selected.filter((option) => option !== value)
      onChange(next.length === 0 ? [...options] : next)
      return
    }

    const next = [...selected, value]
    onChange(next.length === options.length ? [...options] : next)
  }

  const selectAll = () => onChange([...options])

  return (
    <div className="flex flex-col gap-1">
      <label className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-2 py-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) => {
            if (checked) selectAll()
          }}
        />
        <span className="text-sm font-medium">{placeholder}</span>
      </label>
      {showSelectAllDivider ? <div className="bg-border my-1 h-px" /> : null}
      <div className={listClassName}>
        {options.map((option) => {
          const optionDisabled = isDisabled(option)
          return (
            <FilterOptionRow
              key={option}
              option={option}
              optionDisabled={optionDisabled}
              checked={!allSelected && selected.includes(option)}
              disabledOptionTooltip={disabledOptionTooltip}
              onToggle={() => toggleOption(option)}
            />
          )
        })}
      </div>
    </div>
  )
}

export function MultiSelectFilter({
  options,
  selected,
  onChange,
  disabledOptions = [],
  disabledOptionTooltip = FUNDRAISER_UNAVAILABLE_TOOLTIP,
  placeholder = "Усі",
  className,
  id,
}: MultiSelectFilterProps) {
  const controlId = useFilterControlId(id)
  const isActive = isFilterSelectionActive(options, selected)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={controlId}
          type="button"
          variant="outline"
          className={cn(
            siteFilterTriggerClass,
            "justify-between",
            isActive && siteFilterTriggerActiveClass,
            className
          )}
        >
          <span className="truncate">
            {selectionLabel(options, selected, placeholder)}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={filterPopoverContentClass} align="start">
        <MultiSelectFilterPanel
          options={options}
          selected={selected}
          onChange={onChange}
          disabledOptions={disabledOptions}
          disabledOptionTooltip={disabledOptionTooltip}
          placeholder={placeholder}
          listClassName="max-h-64 overflow-y-auto"
        />
      </PopoverContent>
    </Popover>
  )
}
