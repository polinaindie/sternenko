import { cn } from "@workspace/ui/lib/utils"

// Insight UA `.container__wr` — inner reading column inside the outer Container.
// Caps at --container-content-max (1300px) with optional --content-inner-padding.
function ContentContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="content-container"
      className={cn(
        "mx-auto w-full max-w-[var(--container-content-max)] px-[var(--content-inner-padding,0px)]",
        className
      )}
      {...props}
    />
  )
}

export { ContentContainer }
