import { useEffect, useId, useState } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

type ReportPaginationProps = {
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

function pageRange(page: number, pageSize: number, total: number) {
  if (total === 0) return { from: 0, to: 0 }
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return { from, to }
}

export function ReportPagination({
  page,
  pageSize,
  total,
  pageSizeOptions = [15, 30, 50],
  onPageChange,
  onPageSizeChange,
}: ReportPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount)
  const { from, to } = pageRange(safePage, pageSize, total)
  const [jumpValue, setJumpValue] = useState(String(safePage))
  const pageSizeId = useId()
  const pageJumpId = useId()
  const statusId = useId()
  const prevDisabled = safePage <= 1
  const nextDisabled = safePage >= pageCount

  useEffect(() => {
    setJumpValue(String(safePage))
  }, [safePage])

  const goToPage = (value: string) => {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isFinite(parsed)) {
      setJumpValue(String(safePage))
      return
    }
    const next = Math.min(pageCount, Math.max(1, parsed))
    onPageChange(next)
    setJumpValue(String(next))
  }

  const statusMessage =
    total === 0
      ? "Записів не знайдено"
      : `Показано записи ${from}–${to} з ${total.toLocaleString("uk-UA")}. Сторінка ${safePage} з ${pageCount}.`

  if (total === 0) {
    return (
      <p id={statusId} className="text-muted-foreground text-sm">
        Записів не знайдено
      </p>
    )
  }

  return (
    <div
      className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
      role="region"
      aria-labelledby={statusId}
      aria-label="Пагінація таблиці"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
        <p
          id={statusId}
          aria-live="polite"
          aria-atomic="true"
          className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm sm:justify-start"
        >
          <span>
            Показано записи{" "}
            <span className="tabular-nums">{from}–{to}</span> з{" "}
            <span className="tabular-nums">
              {total.toLocaleString("uk-UA")}
            </span>
          </span>

          {onPageSizeChange ? (
            <>
              <span aria-hidden className="text-muted-foreground/60">
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <label htmlFor={pageSizeId} className="whitespace-nowrap">
                  по
                </label>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    onPageSizeChange(Number(value))
                    onPageChange(1)
                  }}
                >
                  <SelectTrigger
                    id={pageSizeId}
                    className="bg-background h-8 w-[4.25rem]"
                    aria-label="Кількість записів на одній сторінці"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="whitespace-nowrap">на сторінці</span>
              </span>
            </>
          ) : null}
        </p>
      </div>

      {pageCount > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <Pagination
            className="mx-0 w-auto justify-start"
            aria-label={statusMessage}
          >
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Попередня"
                  onClick={(event) => {
                    event.preventDefault()
                    if (!prevDisabled) onPageChange(safePage - 1)
                  }}
                  aria-disabled={prevDisabled}
                  tabIndex={prevDisabled ? -1 : undefined}
                  className={cn(
                    "h-9",
                    prevDisabled && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              <PaginationItem>
                <div className="flex items-center gap-1.5 px-1">
                  <label htmlFor={pageJumpId} className="text-foreground sr-only">
                    Номер сторінки, всього {pageCount}
                  </label>
                  <Input
                    id={pageJumpId}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={pageCount}
                    value={jumpValue}
                    onChange={(event) => setJumpValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") goToPage(jumpValue)
                    }}
                    onBlur={() => goToPage(jumpValue)}
                    className="bg-background h-9 w-14 px-2 text-center text-sm tabular-nums"
                    aria-describedby={`${pageJumpId}-hint`}
                  />
                  <span
                    id={`${pageJumpId}-hint`}
                    className="text-muted-foreground text-sm whitespace-nowrap tabular-nums"
                  >
                    з {pageCount}
                  </span>
                </div>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Наступна"
                  onClick={(event) => {
                    event.preventDefault()
                    if (!nextDisabled) onPageChange(safePage + 1)
                  }}
                  aria-disabled={nextDisabled}
                  tabIndex={nextDisabled ? -1 : undefined}
                  className={cn(
                    "h-9",
                    nextDisabled && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  )
}

export function EmptyReportState({ message }: { message: string }) {
  return (
    <div className="text-muted-foreground flex min-h-32 flex-col items-center justify-center gap-2 rounded-[var(--radius-report)] border border-dashed border-border bg-card p-8 text-center text-sm">
      <p>{message}</p>
    </div>
  )
}
