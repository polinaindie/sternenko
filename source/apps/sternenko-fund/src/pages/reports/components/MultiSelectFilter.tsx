import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
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
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

import {
  filterPopoverContentClass,
  siteControlClass,
  siteFilterTriggerActiveClass,
  siteFilterTriggerClass,
  useFilterControlId,
} from "./report-ui"

/**
 * Коротший список браузер малює за один кадр, тож скелетони лише блимнули б.
 * Довший (126 підрозділів) відкладаємо, щоб попап відкривався одразу.
 */
const DEFERRED_ROWS_THRESHOLD = 24
/**
 * Сам рендер укладається в кілька десятків мілісекунд, тож без витримки скелетон
 * блимнув би й читався як збій, а не як «зараз буде список».
 */
const SKELETON_MIN_VISIBLE_MS = 400
/**
 * Сім смуг заповнюють max-h-64 без пустот, а різна довжина читається як список
 * назв, а не як таблиця.
 */
const SKELETON_ROW_WIDTHS = [
  "w-4/5",
  "w-3/5",
  "w-11/12",
  "w-2/3",
  "w-3/4",
  "w-1/2",
  "w-5/6",
] as const

/** Стабільна порожня опора для useDeferredValue — за нею й пізнаємо очікування. */
const PENDING_OPTIONS: readonly string[] = []

type MultiSelectFilterProps = {
  options: readonly string[]
  selected: string[]
  onChange: (selected: string[]) => void
  /** Number of matching purchases for every option. */
  optionCounts?: ReadonlyMap<string, number>
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
  optionCounts?: ReadonlyMap<string, number>
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
  count?: number
  checked: boolean
  onToggle: () => void
  onRequestClose?: () => void
  optionRef: (node: HTMLElement | null) => void
  tabIndex: number
  onFocus: () => void
}

function FilterOptionRow({
  option,
  count,
  checked,
  onToggle,
  onRequestClose,
  optionRef,
  tabIndex,
  onFocus,
}: FilterOptionRowProps) {
  const optionLabel =
    count === undefined
      ? option
      : `${option}. Закупівель: ${count.toLocaleString("uk-UA")}`

  return (
    <div
      ref={optionRef}
      role="option"
      aria-selected={checked}
      aria-label={optionLabel}
      tabIndex={tabIndex}
      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-muted"
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
      <Checkbox
        checked={checked}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none"
      />
      <span className="line-clamp-2 min-w-0 flex-1 text-sm" title={option}>
        {option}
      </span>
      {count === undefined ? null : (
        <span
          className="shrink-0 text-sm text-foreground tabular-nums"
          aria-hidden="true"
        >
          ({count.toLocaleString("uk-UA")})
        </span>
      )}
    </div>
  )
}

/** Тримає ту саму висоту рядка (36px), щоб список не стрибав при появі опцій. */
function FilterOptionsSkeleton() {
  return (
    <div aria-busy="true">
      <p className="sr-only" role="status">
        Завантажуємо опції…
      </p>
      {SKELETON_ROW_WIDTHS.map((width, index) => (
        <div
          key={index}
          className="flex h-9 items-center gap-2 px-2"
          aria-hidden="true"
        >
          <Skeleton className="size-4 shrink-0 rounded-sm motion-reduce:animate-none" />
          <Skeleton className={cn("h-3.5 motion-reduce:animate-none", width)} />
        </div>
      ))}
    </div>
  )
}

export function MultiSelectFilterPanel({
  options,
  selected,
  onChange,
  optionCounts,
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
  const visibleOptions = useMemo(() => {
    const matches = options.filter((option) =>
      matchesOptionQuery(option, query)
    )
    const pinned = matches.filter((option) => pinnedSelection.has(option))
    const unpinned = matches.filter((option) => !pinnedSelection.has(option))
    return [...pinned, ...unpinned]
  }, [options, pinnedSelection, query])
  /**
   * Рядки монтуються з нижчим пріоритетом: попап та пошук з'являються одразу,
   * а важкий список — наступним проходом, поки видно скелетони.
   */
  const [defersRows] = useState(() => options.length > DEFERRED_ROWS_THRESHOLD)
  const renderedOptions = useDeferredValue(
    visibleOptions,
    defersRows ? PENDING_OPTIONS : visibleOptions
  )
  const [skeletonHold, setSkeletonHold] = useState(defersRows)
  const rowsPending =
    options.length > 0 && (skeletonHold || renderedOptions === PENDING_OPTIONS)

  /** Витримка йде від відкриття списку й більше не повертається — пошук не блимає. */
  useEffect(() => {
    if (!skeletonHold) return

    const timer = window.setTimeout(
      () => setSkeletonHold(false),
      SKELETON_MIN_VISIBLE_MS
    )

    return () => window.clearTimeout(timer)
  }, [skeletonHold])
  const hasQuery = query.trim().length > 0
  const allVisibleSelected =
    visibleOptions.length > 0 &&
    visibleOptions.every((option) => selected.includes(option))
  const pinnedVisibleCount = renderedOptions.filter((option) =>
    pinnedSelection.has(option)
  ).length

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((option) => option !== value))
      return
    }

    onChange([...selected, value])
  }

  const toggleVisible = () => {
    if (visibleOptions.length === 0) return
    if (allVisibleSelected) {
      const visible = new Set(visibleOptions)
      onChange(selected.filter((option) => !visible.has(option)))
      return
    }
    onChange([
      ...selected,
      ...visibleOptions.filter((option) => !selected.includes(option)),
    ])
  }

  const moveOptionFocus = (direction: 1 | -1) => {
    if (rowsPending || renderedOptions.length === 0) return
    const next =
      (activeIndex + direction + renderedOptions.length) %
      renderedOptions.length
    setActiveIndex(next)
    optionRefs.current[next]?.focus()
  }

  useEffect(() => {
    setActiveIndex((current) =>
      Math.min(current, Math.max(renderedOptions.length - 1, 0))
    )
  }, [renderedOptions.length])

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
                if (rowsPending) return
                setActiveIndex(0)
                optionRefs.current[0]?.focus()
              } else if (event.key === "ArrowUp") {
                event.preventDefault()
                if (rowsPending) return
                const last = Math.max(renderedOptions.length - 1, 0)
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
          disabled={visibleOptions.length === 0}
        >
          {allVisibleSelected ? "Зняти всі" : "Обрати всі"}
          {hasQuery
            ? ` (${visibleOptions.length.toLocaleString("uk-UA")})`
            : ""}
        </Button>
      </div>
      <div
        id={listId}
        role="listbox"
        aria-multiselectable="true"
        aria-busy={rowsPending || undefined}
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
        ) : rowsPending ? (
          <FilterOptionsSkeleton />
        ) : renderedOptions.length === 0 ? (
          <p className="px-2 py-2 text-sm text-muted-foreground">
            Нічого не знайдено
          </p>
        ) : (
          renderedOptions.map((option, index) => {
            return (
              <div key={`${option}-${index}`} role="none">
                {index === pinnedVisibleCount && pinnedVisibleCount > 0 ? (
                  <div className="my-1 h-px bg-border" aria-hidden="true" />
                ) : null}
                <FilterOptionRow
                  option={option}
                  count={
                    optionCounts ? (optionCounts.get(option) ?? 0) : undefined
                  }
                  checked={selected.includes(option)}
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
  optionCounts,
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
          optionCounts={optionCounts}
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
