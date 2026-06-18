import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

import brights from "../assets/insight-icons/brights.svg?raw"
import chevronDown from "../assets/insight-icons/chevron-down.svg?raw"
import emptyState from "../assets/insight-icons/empty-state.svg?raw"
import externalLink from "../assets/insight-icons/external-link.svg?raw"
import gridView from "../assets/insight-icons/grid-view.svg?raw"
import hotburo from "../assets/insight-icons/hotburo.svg?raw"
import instagramHover from "../assets/insight-icons/instagram-hover.svg?raw"
import instagram from "../assets/insight-icons/instagram.svg?raw"
import listView from "../assets/insight-icons/list-view.svg?raw"
import logoDark from "../assets/insight-icons/logo-dark.svg?raw"
import logo from "../assets/insight-icons/logo.svg?raw"
import search from "../assets/insight-icons/search.svg?raw"
import twitterHover from "../assets/insight-icons/twitter-hover.svg?raw"
import twitter from "../assets/insight-icons/twitter.svg?raw"

const insightIconSources = {
  brights,
  "chevron-down": chevronDown,
  "empty-state": emptyState,
  "external-link": externalLink,
  "grid-view": gridView,
  hotburo,
  "instagram-hover": instagramHover,
  instagram,
  "list-view": listView,
  "logo-dark": logoDark,
  logo,
  search,
  "twitter-hover": twitterHover,
  twitter,
} as const

type InsightIconName = keyof typeof insightIconSources

const insightIconCategories: Record<
  InsightIconName,
  "ui" | "brand" | "social"
> = {
  search: "ui",
  "chevron-down": "ui",
  "external-link": "ui",
  "grid-view": "ui",
  "list-view": "ui",
  "empty-state": "ui",
  logo: "brand",
  "logo-dark": "brand",
  hotburo: "brand",
  brights: "brand",
  instagram: "social",
  "instagram-hover": "social",
  twitter: "social",
  "twitter-hover": "social",
}

function InsightIcon({
  name,
  className,
  label,
  ...props
}: React.ComponentProps<"span"> & {
  name: InsightIconName
  label?: string
}) {
  const svg = insightIconSources[name]
  const title = label ?? name.replace(/-/g, " ")

  return (
    <span
      role="img"
      aria-label={title}
      data-slot="insight-icon"
      data-icon={name}
      className={cn("inline-flex shrink-0 [&>svg]:size-full", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  )
}

export {
  InsightIcon,
  insightIconCategories,
  insightIconSources,
  type InsightIconName,
}
