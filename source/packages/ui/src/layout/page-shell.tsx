import { cn } from "@workspace/ui/lib/utils"

// Full-height page surface. Owns the background/foreground tokens so every
// screen sits on the themed canvas. Compose with Container for content width.
function PageShell({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-shell"
      className={cn("bg-background text-foreground min-h-svh w-full", className)}
      {...props}
    />
  )
}

export { PageShell }
