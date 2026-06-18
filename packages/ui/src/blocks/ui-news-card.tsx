import { cn } from "@workspace/ui/lib/utils"

type UiNewsCardProps = {
  title: string
  href: string
  imageSrc: string
  date: string
  className?: string
}

function UiNewsCard({
  title,
  href,
  imageSrc,
  date,
  className,
}: UiNewsCardProps) {
  return (
    <article
      data-slot="ui-news-card"
      className={cn("group flex flex-col", className)}
    >
      <a href={href} className="block">
        <figure className="mb-4 overflow-hidden rounded-[var(--product-radius,4px)]">
          <img
            src={imageSrc}
            alt=""
            className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </figure>
        <h3 className="mb-2 text-lg font-bold leading-snug tracking-[-0.02em] md:text-xl">
          {title}
        </h3>
        <time
          dateTime={date.split(".").reverse().join("-")}
          className="text-sm text-muted-foreground"
        >
          {date}
        </time>
      </a>
    </article>
  )
}

export { UiNewsCard }
