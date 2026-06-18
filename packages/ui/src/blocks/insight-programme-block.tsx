import { InsightButton } from "@workspace/ui/blocks/insight-button"
import { InsightEventCard } from "@workspace/ui/blocks/insight-event-card"
import { Container } from "@workspace/ui/layout/container"
import { ContentContainer } from "@workspace/ui/layout/content-container"
import { PageShell } from "@workspace/ui/layout/page-shell"
import {
  SplitSection,
  SplitSectionCaption,
  SplitSectionTitle,
} from "@workspace/ui/layout/split-section"
import { Stack } from "@workspace/ui/layout/stack"
import { InsightIcon } from "@workspace/ui/icons/insight-icon"
import { cn } from "@workspace/ui/lib/utils"

function InsightBreadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-12 mt-3.5 hidden items-center md:flex"
    >
      <ol className="flex flex-wrap items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className="flex items-center">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="text-[length:var(--font-size-breadcrumb,0.625rem)] font-bold uppercase tracking-[0.15px] text-foreground/40 hover:text-foreground/60"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="text-[length:var(--font-size-breadcrumb,0.625rem)] font-bold uppercase tracking-[0.15px] text-foreground/40"
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span
                  aria-hidden
                  className="mx-1.5 text-[length:var(--font-size-breadcrumb,0.625rem)] font-bold text-foreground/40"
                >
                  /
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function TopicTag({ color, label }: { color: string; label: string }) {
  return (
    <div className="mb-7 flex items-center">
      <span
        aria-hidden
        className="size-[var(--topic-indicator-size,1.5rem)] shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="ml-3 truncate text-sm leading-6 md:text-lg">{label}</span>
    </div>
  )
}

function ProgrammeDivider({ className }: { className?: string }) {
  return (
    <hr
      className={cn(
        "border-0 border-t border-[color:var(--border-divider)]",
        className
      )}
    />
  )
}

function ProgrammeProse({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "text-[length:var(--font-size-lead,1.25rem)] leading-6 tracking-[-0.02em] [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-4",
        className
      )}
    >
      {children}
    </div>
  )
}

function ProgrammeQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="rounded-[var(--product-radius,4px)] bg-foreground/[0.04] px-7 py-5 text-xl leading-7 font-bold tracking-[-0.02em] [&_p+p]:mt-2">
      {children}
    </blockquote>
  )
}

function ProgrammeGallery({
  images,
}: {
  images: { src: string; alt: string }[]
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {images.map((image) => (
        <div
          key={image.src}
          className="overflow-hidden rounded-[var(--product-radius,4px)]"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      ))}
    </div>
  )
}

function ProgrammeVideo({ src, title }: { src: string; title: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-[var(--product-radius,4px)]">
      <iframe
        src={src}
        title={title}
        className="size-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function RecommendedPanel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-16 max-w-[88.5rem] overflow-hidden rounded-[var(--product-radius,4px)] bg-black px-3.5 pt-16 pb-8 text-white md:px-14 md:pt-[4.5rem] md:pb-8">
      <h2 className="mb-6 text-4xl font-bold tracking-[-0.04em] md:mb-12 md:text-[length:var(--font-size-recommended-title,3rem)] md:tracking-[-0.04em]">
        {title}
      </h2>
      {children}
    </section>
  )
}

const recommendedEvents = [
  {
    href: "/programmes-and-projects",
    title: "Ukrainian avant-garde: voices of the 1920s",
    topicColor: "#A6CCC3",
    topics: "Performing Arts",
    imageSrc:
      "https://a.storyblok.com/f/237261/800x549/ced390e327/_-_-_.jpg/m/",
    imageAlt: "Performing arts event poster",
  },
  {
    href: "/programmes-and-projects",
    title: "Cinema of independence: new Ukrainian film",
    topicColor: "#7D94E6",
    topics: "Film",
    imageSrc:
      "https://a.storyblok.com/f/237261/1280x843/f1159c7a34/1280px-kharkiv_map_-1876.jpg/m/",
    imageAlt: "Film programme cover",
  },
  {
    href: "/programmes-and-projects",
    title: "Literary Kyiv: authors and places",
    topicColor: "#F4EBC2",
    topics: "Literature",
    imageSrc:
      "https://a.storyblok.com/f/237261/472x280/2cb1cc94a7/dbs.jpg/m/",
    imageAlt: "Literature event artwork",
  },
] as const

function MorePanel({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="flex flex-col items-start justify-between gap-8 rounded-[var(--product-radius,4px)] bg-[color:var(--surface-panel)] px-6 py-8 md:flex-row md:items-center md:px-10 md:py-[2.875rem] max-md:bg-black max-md:text-white">
      <p className="max-w-xs text-[1.75rem] font-bold leading-8 tracking-[-0.04em]">
        {title}
      </p>
      <InsightButton
        asChild
        variant="solid-black"
        className="max-md:border-white max-md:bg-white max-md:text-black max-md:hover:bg-white/90 max-md:hover:text-black"
      >
        <a href={href}>
          {label}
          <InsightIcon name="external-link" />
        </a>
      </InsightButton>
    </div>
  )
}

export function InsightProgrammeBlock() {
  return (
    <PageShell>
      <Container className="pb-16 pt-6 md:pt-0">
        <InsightBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Programmes and projects", href: "/programmes-and-projects" },
            { label: "Fedir yakymenko" },
          ]}
        />

        <ContentContainer>
          <header className="pb-4 md:pt-0">
            <TopicTag color="#F4EBC2" label="Music / Discover Ukraine Online" />

            <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
              <h1 className="max-w-[59rem] text-[3.375rem] font-bold leading-none tracking-[-0.04em] md:text-[4rem] md:leading-[4rem] lg:text-[5rem] lg:leading-[5rem]">
                Fedir Yakymenko
              </h1>
              <InsightButton asChild className="shrink-0">
                <a
                  href="https://www.youtube.com/playlist?list=PLYajOoO6tyBayAMrXk6Ew_sBAd7R0a03z"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tap to listen
                  <InsightIcon name="external-link" />
                </a>
              </InsightButton>
            </div>
          </header>

          <ProgrammeDivider className="mb-8 mt-0" />
        </ContentContainer>

        <div className="w-full">
          <img
            src="https://a.storyblok.com/f/237261/4248x1851/db771cca74/insight-ua.png/m/"
            alt="Fedir Yakymenko portrait collage"
            className="h-auto w-full object-cover"
          />
        </div>

        <ContentContainer className="pt-12">
          <ProgrammeDivider className="mb-8 mt-0" />

          <Stack className="gap-0">
            <SplitSection
              aside={
                <>
                  <SplitSectionTitle className="sr-only">Introduction</SplitSectionTitle>
                  <SplitSectionCaption>
                    Read the article to find out his biography and inspirations
                  </SplitSectionCaption>
                </>
              }
            >
              <ProgrammeProse>
                <p>
                  <strong>
                    Fedir Yakymenko was a Ukrainian composer of the early 20th
                    century whose music works with images of space, nature, and
                    dreams. In this article you can find what his world sounds
                    like and why it is worth returning to it today.
                  </strong>
                </p>
              </ProgrammeProse>
            </SplitSection>

            <div className="my-8">
              <ProgrammeDivider />
            </div>

            <SplitSection
              aside={<SplitSectionTitle>Childhood and Youth</SplitSectionTitle>}
            >
              <ProgrammeProse>
                <p>
                  <strong>Fedir Yakymenko</strong> was born on 20 February 1876
                  in the village of Pisky near Kharkiv. At the age of ten, he
                  joined the St. Petersburg Court Choir, where he received a
                  thorough musical education.
                </p>
              </ProgrammeProse>
            </SplitSection>

            <div className="my-8">
              <ProgrammeDivider />
            </div>

            <SplitSection
              aside={
                <SplitSectionTitle>The aesthetics of creativity</SplitSectionTitle>
              }
            >
              <Stack className="gap-8">
                <ProgrammeProse>
                  <p>
                    Yakymenko&apos;s modernist style was shaped at the
                    intersection of cosmogony, mysticism, symbolism, and
                    impressionism.
                  </p>
                </ProgrammeProse>
                <ProgrammeQuote>
                  <p>&quot;My name,&quot; said the first of them, &quot;is Love.&quot;</p>
                  <p>&quot;My name,&quot; said the second, &quot;is Science.&quot;</p>
                  <p>&quot;My name,&quot; replied the third, &quot;is Art...&quot;</p>
                </ProgrammeQuote>
              </Stack>
            </SplitSection>

            <div className="my-8">
              <ProgrammeDivider />
            </div>

            <SplitSection
              aside={
                <SplitSectionCaption>
                  From left to right: Claude Debussy, Michel Dimitri
                  Calvocoressi, and Maurice Ravel
                </SplitSectionCaption>
              }
            >
              <ProgrammeGallery
                images={[
                  {
                    src: "https://a.storyblok.com/f/237261/472x280/2cb1cc94a7/dbs.jpg/m/",
                    alt: "Claude Debussy",
                  },
                  {
                    src: "https://a.storyblok.com/f/237261/550x550/20109aea00/ravel.jpg/m/",
                    alt: "Maurice Ravel",
                  },
                  {
                    src: "https://a.storyblok.com/f/237261/404x640/cce6100d16/michel-calvocoressi-1.jpg/m/",
                    alt: "Michel Calvocoressi",
                  },
                ]}
              />
            </SplitSection>

            <div className="my-8">
              <ProgrammeDivider />
            </div>

            <SplitSection aside={<SplitSectionTitle>Kharkiv period</SplitSectionTitle>}>
              <ProgrammeVideo
                src="https://www.youtube.com/embed/19MBWSj0GwA?rel=0"
                title="Fedir Yakymenko — musical excerpt"
              />
            </SplitSection>
          </Stack>

          <div className="mt-12">
            <MorePanel
              title="Explore more Ukrainian composers"
              href="/programmes-and-projects"
              label="See all programmes"
            />
          </div>

          <RecommendedPanel title="Recommended events">
            <div className="grid grid-cols-1 gap-x-3.5 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
              {recommendedEvents.map((event) => (
                <InsightEventCard key={event.title} {...event} />
              ))}
            </div>
          </RecommendedPanel>
        </ContentContainer>
      </Container>
    </PageShell>
  )
}
