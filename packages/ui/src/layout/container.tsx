import { cn } from "@workspace/ui/lib/utils"

// Centers content, caps width at --container-max, and applies the shared page
// gutters (--page-gutter → --page-gutter-md → --page-gutter-lg).
function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-[var(--page-gutter)] md:px-[var(--page-gutter-md)] lg:px-[var(--page-gutter-lg)]",
        className
      )}
      {...props}
    />
  )
}

export { Container }
