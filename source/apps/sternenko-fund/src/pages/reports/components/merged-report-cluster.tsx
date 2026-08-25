import type { ComponentProps, ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

import "./merged-report-cluster.css"

type MergedCompositeCardProps = ComponentProps<"div"> & {
  children: ReactNode
}

/** Одна велика картка; KPI зверху «вливаються» в hero через внутрішні gutter-лінії. */
export function MergedCompositeCard({
  className,
  children,
  ...props
}: MergedCompositeCardProps) {
  return (
    <div data-merged-composite className={cn("min-w-0", className)} {...props}>
      <div data-merged-composite-grid>
        {children}
        <MergedGutter name="h-kpi1-kpi2" />
        <MergedGutter name="h-kpi2-kpi3" />
        <MergedGutter name="h-kpi3-hero" />
        <MergedGutter name="v-after-kpi1" />
        <MergedGutter name="v-after-kpi2" />
        <MergedGutter name="j-v1-h" />
        <MergedGutter name="j-v2-h" />
        <MergedGutter name="h-main" />
      </div>
    </div>
  )
}

type MergedSectionProps = ComponentProps<"div"> & {
  section: "kpi1" | "kpi2" | "kpi3" | "hero"
}

export function MergedSection({
  section,
  className,
  children,
  ...props
}: MergedSectionProps) {
  return (
    <div
      data-merged-section={section}
      data-slot="merged-section"
      className={cn("min-w-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function MergedGutter({ name }: { name: string }) {
  return <div data-merged-gutter={name} aria-hidden className="min-h-0 min-w-0" />
}

type MergedReportClusterProps = ComponentProps<"section"> & {
  palette?: string
  children: ReactNode
}

export function MergedReportCluster({
  palette,
  className,
  children,
  ...props
}: MergedReportClusterProps) {
  return (
    <section
      data-merged-report-cluster
      data-slot="merged-report-cluster"
      data-report-palette={palette}
      className={cn("w-full min-w-0", className)}
      {...props}
    >
      {children}
    </section>
  )
}

/** @deprecated use MergedSection */
export const MergedReportBlock = MergedSection
