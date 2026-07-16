import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

// Bento-style report surface used by the Sternenko monthly report layouts.
// Tones map to semantic tokens only, so the card re-skins with the active
// brand theme. Corners use --radius-report so report modules stay rounded even
// when a brand sets sharp site corners.
const reportCardVariants = cva(
  "flex w-full min-w-0 flex-col gap-3 rounded-[var(--radius-report)]",
  {
    variants: {
      tone: {
        accent: "bg-primary text-primary-foreground",
        contrast: "bg-foreground text-background",
        card: "bg-card text-card-foreground",
        muted: "bg-muted text-muted-foreground",
        outline: "border-2 border-foreground bg-transparent text-foreground",
      },
      size: {
        default: "",
        lg: "rounded-[var(--radius-report-lg)] gap-4 p-6 md:p-8",
      },
      padding: {
        default: "p-5 md:p-6",
        none: "p-0",
      },
    },
    defaultVariants: {
      tone: "accent",
      size: "default",
      padding: "default",
    },
  }
)

function ReportCard({
  className,
  tone = "accent",
  size = "default",
  padding = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof reportCardVariants>) {
  return (
    <div
      data-slot="report-card"
      data-tone={tone}
      className={cn(reportCardVariants({ tone, size, padding }), className)}
      {...props}
    />
  )
}

export { ReportCard, reportCardVariants }
