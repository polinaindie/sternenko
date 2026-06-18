import { cn } from "@workspace/ui/lib/utils"

// Vertical flow with a consistent gap. Override the gap via className when a
// section needs tighter or looser rhythm.
function Stack({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stack"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  )
}

export { Stack }
