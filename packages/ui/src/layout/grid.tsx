import { cn } from "@workspace/ui/lib/utils"

// Mobile-first grid: one column by default, escalate columns at breakpoints via
// className (e.g. "md:grid-cols-2 lg:grid-cols-3").
function Grid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid"
      className={cn("grid grid-cols-1 gap-4", className)}
      {...props}
    />
  )
}

export { Grid }
