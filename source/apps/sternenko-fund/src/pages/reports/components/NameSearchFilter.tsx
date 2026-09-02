import { useEffect, useId, useMemo, useRef, useState } from "react"

import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

import { rankNameSuggestions } from "../lib/fuzzy-text-match"
import {
  filterPopoverContentClass,
  siteControlClass,
  useFilterControlId,
} from "./report-ui"

type NameSearchFilterProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  suggestions: readonly string[]
  placeholder?: string
  id?: string
  className?: string
}

export function NameSearchFilter({
  value,
  onChange,
  onSubmit,
  suggestions,
  placeholder = "",
  id,
  className,
}: NameSearchFilterProps) {
  const generatedId = useId()
  const controlId = useFilterControlId(id) ?? generatedId
  const listId = `${controlId}-listbox`
  const statusId = `${controlId}-status`
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const matches = useMemo(
    () => rankNameSuggestions(suggestions, value),
    [suggestions, value]
  )
  const hasQuery = value.trim().length > 0
  const listOpen = open && hasQuery

  useEffect(() => {
    setActiveIndex(0)
  }, [value])

  const selectSuggestion = (name: string) => {
    onChange(name)
    setOpen(false)
    inputRef.current?.focus()
  }

  return (
    <Popover open={listOpen} onOpenChange={setOpen} modal={false}>
      <PopoverAnchor asChild>
        <InputGroup
          className={cn(siteControlClass, "h-[38px] rounded-none", className)}
        >
          <InputGroupAddon>
            <SearchIcon className="size-4 opacity-60" aria-hidden />
          </InputGroupAddon>
          <InputGroupInput
            id={controlId}
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={listOpen}
            aria-controls={listId}
            aria-activedescendant={
              listOpen && matches[activeIndex]
                ? `${listId}-option-${activeIndex}`
                : undefined
            }
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={placeholder}
            value={value}
            onChange={(event) => {
              onChange(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && listOpen) {
                event.preventDefault()
                event.stopPropagation()
                setOpen(false)
                return
              }
              if (event.key === "ArrowDown") {
                if (!hasQuery) return
                event.preventDefault()
                setOpen(true)
                if (matches.length === 0) return
                setActiveIndex((current) => (current + 1) % matches.length)
                return
              }
              if (event.key === "ArrowUp") {
                if (!listOpen || matches.length === 0) return
                event.preventDefault()
                setActiveIndex(
                  (current) => (current - 1 + matches.length) % matches.length
                )
                return
              }
              if (event.key === "Enter") {
                event.preventDefault()
                if (listOpen && matches[activeIndex]) {
                  selectSuggestion(matches[activeIndex]!)
                  return
                }
                onSubmit?.()
              }
            }}
          />
        </InputGroup>
      </PopoverAnchor>
      <PopoverContent
        className={cn(filterPopoverContentClass, "p-1")}
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div
          id={listId}
          role="listbox"
          aria-label="Підказки найменування"
          className="max-h-64 overflow-y-auto"
        >
          {matches.length === 0 ? (
            <p className="px-2 py-2 text-sm text-foreground">
              Нічого не знайдено
            </p>
          ) : (
            matches.map((name, index) => (
              <button
                key={name}
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                tabIndex={-1}
                className={cn(
                  "flex min-h-8 w-full cursor-pointer items-center rounded-md px-2 py-2 text-left text-sm",
                  index === activeIndex ? "bg-muted" : "hover:bg-muted"
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(name)}
              >
                <span className="line-clamp-2">{name}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
      <span id={statusId} className="sr-only" role="status">
        {listOpen
          ? matches.length === 0
            ? "Нічого не знайдено"
            : `Знайдено ${matches.length.toLocaleString("uk-UA")} підказок`
          : ""}
      </span>
    </Popover>
  )
}
