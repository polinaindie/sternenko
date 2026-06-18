import { InsightIcon } from "@workspace/ui/icons/insight-icon"
import { cn } from "@workspace/ui/lib/utils"

export type InsightEventCardProps = {
  href: string
  title: string
  topicColor: string
  topics: string
  imageSrc: string
  imageAlt?: string
  className?: string
}

// Insight UA `.event-preview` — card used in Recommended events waterfall.
function InsightEventCard({
  href,
  title,
  topicColor,
  topics,
  imageSrc,
  imageAlt = "",
  className,
}: InsightEventCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group/event-preview block border-t border-white/20 pt-5 pb-6 md:pt-6 md:pb-10",
        className
      )}
    >
      <div className="mb-5 flex items-center md:mb-6">
        <span
          aria-hidden
          className="size-7 shrink-0 rounded-full md:size-8"
          style={{ backgroundColor: topicColor }}
        />
        <span className="ml-3 truncate text-base leading-6 text-[#e9dad3]">
          {topics}
        </span>
      </div>

      <div className="relative mb-5 overflow-hidden rounded-[var(--product-radius,4px)]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-auto w-full transition-transform duration-500 group-hover/event-preview:scale-110"
        />
        <span
          aria-hidden
          className="absolute right-2.5 bottom-2.5 flex size-9 items-center justify-center rounded-full bg-black/70 text-white opacity-100 transition-all duration-500 md:size-[3.375rem] md:bg-black md:opacity-0 md:group-hover/event-preview:scale-100 md:group-hover/event-preview:opacity-100"
        >
          <InsightIcon name="external-link" className="size-[1.125rem]" />
        </span>
      </div>

      <h3 className="text-xl leading-[1.25] font-normal tracking-[-0.02em] text-white md:text-2xl md:leading-7">
        {title}
      </h3>
    </a>
  )
}

export { InsightEventCard }
