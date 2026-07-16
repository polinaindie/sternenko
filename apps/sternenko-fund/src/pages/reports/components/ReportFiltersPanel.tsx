import { useEffect } from "react"
import { ListFilterIcon, XIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

import {
  FilterApplyButton,
  FilterPopoverResetButton,
  siteControlClass,
  siteFilterTriggerClass,
} from "./report-ui"

type ReportFiltersPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeFilterCount: number
  onApply: () => void
  onCancel: () => void
  onClearAll?: () => void
  children: React.ReactNode
  title?: string
  /** Hide trigger bar from this breakpoint up (default: large screens). */
  barClassName?: string
}

export function ReportFiltersPanel({
  open,
  onOpenChange,
  activeFilterCount,
  onApply,
  onCancel,
  onClearAll,
  children,
  title = "Фільтри",
  barClassName = "lg:hidden",
}: ReportFiltersPanelProps) {
  const countLabel =
    activeFilterCount > 0 ? ` (${activeFilterCount.toLocaleString("uk-UA")})` : ""

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const closeOnDesktop = () => {
      if (mediaQuery.matches && open) onCancel()
    }
    mediaQuery.addEventListener("change", closeOnDesktop)
    return () => mediaQuery.removeEventListener("change", closeOnDesktop)
  }, [open, onCancel])

  return (
    <>
      <div className={cn("flex min-w-0 items-center gap-2", barClassName)}>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(true)}
          className={cn(
            siteFilterTriggerClass,
            "h-10 flex-1 justify-start gap-2 text-foreground"
          )}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="report-filters-sheet"
        >
          <ListFilterIcon className="size-4 shrink-0 opacity-80" aria-hidden />
          <span>
            Фільтри{countLabel}
          </span>
        </Button>
        {activeFilterCount > 0 && onClearAll ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 shrink-0 px-2"
            onClick={onClearAll}
          >
            Очистити всі
          </Button>
        ) : null}
      </div>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          id="report-filters-sheet"
          side="right"
          showCloseButton={false}
          className={cn(
            siteControlClass,
            "inset-0 flex h-dvh max-h-dvh w-full max-w-none flex-col gap-0 rounded-none border-0 p-0",
            "data-[side=right]:inset-0 data-[side=right]:h-dvh data-[side=right]:w-full data-[side=right]:max-w-none data-[side=right]:border-0 data-[side=right]:sm:max-w-none"
          )}
        >
          <SheetHeader className="relative shrink-0 border-b px-4 py-3 pr-14 pt-[max(0.75rem,env(safe-area-inset-top))] text-left">
            <SheetTitle className="[font-family:var(--font-display-dark)] text-lg leading-tight">
              {title}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Оберіть параметри фільтрації. Натисніть «Фільтрувати», щоб застосувати, або
              «Скасувати», щоб закрити без змін.
            </SheetDescription>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(siteControlClass, "absolute top-2 right-2 size-10")}
              onClick={onCancel}
              aria-label="Закрити фільтри"
            >
              <XIcon className="size-5" aria-hidden />
            </Button>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4">
              {children}
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-3 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <FilterPopoverResetButton
                type="button"
                className="h-10"
                onClick={onCancel}
              >
                Скасувати
              </FilterPopoverResetButton>
              <FilterApplyButton type="button" className="h-10 w-full" onClick={onApply}>
                Фільтрувати
              </FilterApplyButton>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
