import { useEffect, useId, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDownIcon, SearchIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

import {
  filterPopoverContentClass,
  siteControlClass,
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
/** Дотик не має «leave», тож підказка ховається сама. */
const CURSOR_TOOLTIP_TOUCH_HIDE_MS = 4000

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
  allSelectedLabel?: string
  /** Пошук за опціями всередині дропдауну. */
  searchable?: boolean
  searchPlaceholder?: string
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
  searchable?: boolean
  searchPlaceholder?: string
  listClassName?: string
  listId?: string
  onRequestClose?: () => void
  /** @deprecated The list-level action always has its own divider. */
  showSelectAllDivider?: boolean
}

function isAllSelected(
  options: readonly string[],
  selected: string[]
): boolean {
  return (
    options.length > 0 && options.every((option) => selected.includes(option))
  )
}

function normalizeOptionText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLocaleLowerCase("uk")
}

function matchesOptionQuery(option: string, query: string): boolean {
  const needle = normalizeOptionText(query)
  if (!needle) return true
  return normalizeOptionText(option).includes(needle)
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
  placeholder: string,
  allSelectedLabel = placeholder
): string {
  if (selected.length === 0) return placeholder
  if (isAllSelected(options, selected)) return allSelectedLabel
  if (selected.length === 1) return selected[0]!
  if (selected.length <= 3) return selected.join(", ")
  return `Обрано ${selected.length.toLocaleString("uk-UA")}`
}

type FilterOptionRowProps = {
  option: string
  optionDisabled: boolean
  checked: boolean
  disabledOptionTooltip?: string
  onToggle: () => void
  onRequestClose?: () => void
  optionRef: (node: HTMLElement | null) => void
  tabIndex: number
  onFocus: () => void
}

function FilterOptionRow({
  option,
  optionDisabled,
  checked,
  disabledOptionTooltip,
  onToggle,
  onRequestClose,
  optionRef,
  tabIndex,
  onFocus,
}: FilterOptionRowProps) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const latestPointerRef = useRef({ x: 0, y: 0 })
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearShowTimer = () => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }

  useEffect(() => () => clearShowTimer(), [])

  const showTooltipAt = (clientX: number, clientY: number) => {
    clearShowTimer()
    latestPointerRef.current = { x: clientX, y: clientY }
    setCursor(latestPointerRef.current)
    hideTimerRef.current = setTimeout(
      () => setCursor(null),
      CURSOR_TOOLTIP_TOUCH_HIDE_MS
    )
  }

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
      : "cursor-pointer hover:bg-muted"
  )

  const row = (
    <>
      <Checkbox
        checked={checked}
        disabled={optionDisabled}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none"
      />
      <span className="line-clamp-2 min-w-0 flex-1 text-sm" title={option}>
        {option}
      </span>
    </>
  )

  if (!optionDisabled || !disabledOptionTooltip) {
    return (
      <div
        ref={optionRef}
        role="option"
        aria-selected={checked}
        aria-disabled={optionDisabled}
        tabIndex={tabIndex}
        className={rowClassName}
        onFocus={onFocus}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === " ") {
            event.preventDefault()
            onToggle()
          } else if (event.key === "Enter") {
            event.preventDefault()
            onRequestClose?.()
          }
        }}
      >
        {row}
      </div>
    )
  }

  return (
    <>
      <span
        ref={optionRef}
        role="option"
        aria-selected={checked}
        tabIndex={tabIndex}
        aria-disabled="true"
        aria-label={`${option}. ${disabledOptionTooltip}`}
        className={rowClassName}
        onMouseEnter={(event) =>
          handlePointerEnter(event.clientX, event.clientY)
        }
        onMouseMove={(event) => handlePointerMove(event.clientX, event.clientY)}
        onMouseLeave={handlePointerLeave}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse") return
          showTooltipAt(event.clientX, event.clientY)
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !cursor) return
          event.stopPropagation()
          handlePointerLeave()
        }}
        onFocus={(event) => {
          onFocus()
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
  searchable = false,
  searchPlaceholder = "Пошук",
  listClassName,
  listId,
  onRequestClose,
}: MultiSelectFilterPanelProps) {
  const [query, setQuery] = useState("")
  const [pinnedSelection] = useState(() => new Set(selected))
  const [activeIndex, setActiveIndex] = useState(0)
  const optionRefs = useRef<Array<HTMLElement | null>>([])
  const searchRef = useRef<HTMLInputElement | null>(null)
  const disabled = useMemo(() => new Set(disabledOptions), [disabledOptions])
  const visibleOptions = useMemo(() => {
    const matches = options.filter((option) =>
      matchesOptionQuery(option, query)
    )
    const pinned = matches.filter((option) => pinnedSelection.has(option))
    const unpinned = matches.filter((option) => !pinnedSelection.has(option))
    return [...pinned, ...unpinned]
  }, [options, pinnedSelection, query])
  const hasQuery = query.trim().length > 0
  const selectableOptions = useMemo(
    () => visibleOptions.filter((option) => !disabled.has(option)),
    [disabled, visibleOptions]
  )
  const allVisibleSelected =
    selectableOptions.length > 0 &&
    selectableOptions.every((option) => selected.includes(option))
  const pinnedVisibleCount = visibleOptions.filter((option) =>
    pinnedSelection.has(option)
  ).length

  const isDisabled = (value: string) => disabled.has(value)

  const toggleOption = (value: string) => {
    if (isDisabled(value)) return

    if (selected.includes(value)) {
      onChange(selected.filter((option) => option !== value))
      return
    }

    onChange([...selected, value])
  }

  const toggleVisible = () => {
    if (selectableOptions.length === 0) return
    if (allVisibleSelected) {
      const visible = new Set(selectableOptions)
      onChange(selected.filter((option) => !visible.has(option)))
      return
    }
    onChange([
      ...selected,
      ...selectableOptions.filter((option) => !selected.includes(option)),
    ])
  }

  const moveOptionFocus = (direction: 1 | -1) => {
    if (visibleOptions.length === 0) return
    const next =
      (activeIndex + direction + visibleOptions.length) % visibleOptions.length
    setActiveIndex(next)
    optionRefs.current[next]?.focus()
  }

  useEffect(() => {
    setActiveIndex((current) =>
      Math.min(current, Math.max(visibleOptions.length - 1, 0))
    )
  }, [visibleOptions.length])

  return (
    <div className="flex flex-col gap-1">
      {searchable ? (
        <InputGroup
          className={cn(siteControlClass, "h-8 shrink-0 rounded-none")}
        >
          <InputGroupAddon>
            <SearchIcon className="size-3.5 opacity-60" aria-hidden />
          </InputGroupAddon>
          <InputGroupInput
            ref={searchRef}
            type="search"
            autoComplete="off"
            autoFocus
            placeholder={searchPlaceholder}
            value={query}
            aria-label={searchPlaceholder}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault()
                setActiveIndex(0)
                optionRefs.current[0]?.focus()
              } else if (event.key === "ArrowUp") {
                event.preventDefault()
                const last = Math.max(visibleOptions.length - 1, 0)
                setActiveIndex(last)
                optionRefs.current[last]?.focus()
              } else if (event.key === "Enter") {
                event.preventDefault()
                onRequestClose?.()
              }
            }}
          />
        </InputGroup>
      ) : null}
      <div className="border-b border-border pb-1">
        <Button
          type="button"
          variant="ghost"
          className="h-8 w-full justify-start px-2 text-sm font-medium"
          onClick={toggleVisible}
          disabled={selectableOptions.length === 0}
        >
          {visibleOptions.length > selectableOptions.length
            ? allVisibleSelected
              ? "Зняти всі доступні"
              : "Обрати всі доступні"
            : allVisibleSelected
              ? "Зняти всі"
              : "Обрати всі"}
          {hasQuery
            ? ` (${selectableOptions.length.toLocaleString("uk-UA")})`
            : ""}
        </Button>
      </div>
      <div
        id={listId}
        role="listbox"
        aria-multiselectable="true"
        className={listClassName}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault()
            moveOptionFocus(1)
          } else if (event.key === "ArrowUp") {
            event.preventDefault()
            moveOptionFocus(-1)
          }
        }}
      >
        {options.length === 0 ? (
          <p className="px-2 py-2 text-sm text-muted-foreground">Немає даних</p>
        ) : visibleOptions.length === 0 ? (
          <p className="px-2 py-2 text-sm text-muted-foreground">
            Нічого не знайдено
          </p>
        ) : (
          visibleOptions.map((option, index) => {
            const optionDisabled = isDisabled(option)
            return (
              <div key={`${option}-${index}`} role="none">
                {index === pinnedVisibleCount && pinnedVisibleCount > 0 ? (
                  <div className="my-1 h-px bg-border" aria-hidden="true" />
                ) : null}
                <FilterOptionRow
                  option={option}
                  optionDisabled={optionDisabled}
                  checked={selected.includes(option)}
                  disabledOptionTooltip={disabledOptionTooltip}
                  onToggle={() => toggleOption(option)}
                  onRequestClose={onRequestClose}
                  optionRef={(node) => {
                    optionRefs.current[index] = node
                  }}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onFocus={() => setActiveIndex(index)}
                />
              </div>
            )
          })
        )}
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
  allSelectedLabel = placeholder,
  searchable = false,
  searchPlaceholder = "Пошук",
  className,
  id,
}: MultiSelectFilterProps) {
  const generatedId = useId()
  const controlId = useFilterControlId(id) ?? generatedId
  const listId = `${controlId}-listbox`
  const descriptionId = `${controlId}-selection-description`
  const [open, setOpen] = useState(false)
  const isActive = isFilterSelectionActive(options, selected)
  const selectedCount = selected.filter((option) =>
    options.includes(option)
  ).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={controlId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-describedby={descriptionId}
          variant="outline"
          className={cn(
            siteFilterTriggerClass,
            "justify-between",
            isActive && siteFilterTriggerActiveClass,
            className
          )}
        >
          <span className="truncate">
            {selectionLabel(options, selected, placeholder, allSelectedLabel)}
          </span>
          <ChevronDownIcon
            className="size-4 shrink-0 opacity-60"
            aria-hidden="true"
          />
          <span id={descriptionId} className="sr-only" aria-live="polite">
            {selectedCount === 0
              ? "Нічого не обрано"
              : `Обрано ${selectedCount.toLocaleString("uk-UA")}`}
          </span>
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
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          listClassName="max-h-64 overflow-y-auto"
          listId={listId}
          onRequestClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  )
}
