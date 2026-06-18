import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@workspace/ui/lib/utils"

// Insight UA `.ui-button-*` — product buttons use 6px radius and 12×32px padding,
// separate from the brandbook `--radius: 0` on generic kit components.
const insightButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--product-button-radius,6px)] border px-8 py-3 text-base font-bold leading-6 tracking-[-0.04em] transition-all duration-300 outline-none select-none [&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0 [&_svg]:text-primary",
  {
    variants: {
      variant: {
        "outline-black":
          "border-foreground bg-transparent text-foreground hover:bg-[rgba(102,90,62,0.1)] active:bg-foreground active:text-background",
        "solid-black":
          "border-foreground bg-foreground text-background hover:bg-[rgba(102,90,62,0.1)] hover:text-foreground active:border-foreground active:bg-transparent active:text-foreground",
        "solid-white":
          "border-white bg-white text-black hover:bg-white/90 active:bg-white/80",
        "glass":
          "border-transparent bg-white/20 text-white hover:bg-white/[0.48] active:bg-white active:text-black",
      },
    },
    defaultVariants: {
      variant: "outline-black",
    },
  }
)

function InsightButton({
  className,
  variant = "outline-black",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof insightButtonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="insight-button"
      className={cn(insightButtonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { InsightButton, insightButtonVariants }
