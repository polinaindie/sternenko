import { cn } from "@workspace/ui/lib/utils"

// Insight UA `.page-event__body-wr` — aside label column + main content column.
function SplitSection({
  aside,
  children,
  className,
}: {
  aside: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="split-section"
      className={cn(
        "flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:gap-0",
        className
      )}
    >
      <aside className="w-full shrink-0 lg:mb-0 lg:w-[var(--content-aside-width)]">
        {aside}
      </aside>
      <div className="min-w-0 flex-1 lg:ml-[var(--content-column-gap)] lg:w-[calc(100%-var(--content-aside-width)-var(--content-column-gap))]">
        {children}
      </div>
    </div>
  )
}

function SplitSectionTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="split-section-title"
      className={cn(
        "font-bold tracking-[-0.04em] text-[length:var(--font-size-section-title,2.25rem)] leading-[1.11] mb-[0.875rem] lg:mb-[1.125rem]",
        className
      )}
      {...props}
    />
  )
}

function SplitSectionCaption({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="split-section-caption"
      className={cn(
        "text-[length:var(--font-size-lead,1.25rem)] leading-7 tracking-[-0.02em] text-[color:var(--text-caption)] whitespace-pre-line",
        className
      )}
      {...props}
    />
  )
}

export { SplitSection, SplitSectionCaption, SplitSectionTitle }
