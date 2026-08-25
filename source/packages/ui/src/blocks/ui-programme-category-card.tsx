import { cn } from "@workspace/ui/lib/utils"

type UiProgrammeCategoryCardProps = {
  title: string
  href: string
  imageSrc: string
  className?: string
}

function UiProgrammeCategoryCard({
  title,
  href,
  imageSrc,
  className,
}: UiProgrammeCategoryCardProps) {
  return (
    <article
      data-slot="ui-programme-category-card"
      className={cn("group text-center", className)}
    >
      <a href={href} className="block">
        <figure className="mb-3 overflow-hidden">
          <img
            src={imageSrc}
            alt=""
            className="mx-auto aspect-square w-full max-w-[12.5rem] object-cover transition-transform duration-300 group-hover:scale-105 md:max-w-none"
          />
        </figure>
        <h3 className="text-base font-bold leading-snug tracking-[-0.04em] md:text-xl">
          {title}
        </h3>
      </a>
    </article>
  )
}

export { UiProgrammeCategoryCard }
