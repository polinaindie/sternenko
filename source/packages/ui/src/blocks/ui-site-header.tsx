import { InsightIcon } from "@workspace/ui/icons/insight-icon"
import { Container } from "@workspace/ui/layout/container"
import { cn } from "@workspace/ui/lib/utils"

import type { UiNavItem } from "./ui-types"

type UiSiteHeaderProps = {
  logoSrc: string
  logoAlt?: string
  nav: UiNavItem[]
  social: readonly { label: string; href: string }[]
  langHref?: string
  className?: string
}

function UiSiteHeader({
  logoSrc,
  logoAlt = "Український інститут",
  nav,
  social,
  langHref = "https://ui.org.ua/en/",
  className,
}: UiSiteHeaderProps) {
  return (
    <header
      data-slot="ui-site-header"
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background",
        className
      )}
    >
      <Container className="flex h-[4.6875rem] items-center justify-between gap-4 md:h-[5.625rem]">
        <a href="https://ui.org.ua/" className="shrink-0">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-10 w-auto md:h-[4.375rem]"
            width={208}
            height={70}
          />
        </a>

        <nav
          aria-label="Головна навігація"
          className="hidden flex-1 items-center justify-center gap-6 xl:flex"
        >
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-bold tracking-[-0.04em] md:text-lg"
                  aria-haspopup="true"
                >
                  {item.label}
                  <InsightIcon name="chevron-down" className="size-3" />
                </button>
                <ul
                  role="menu"
                  className="invisible absolute left-0 top-full z-10 min-w-[16rem] border border-border bg-card py-2 opacity-0 shadow-sm transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                >
                  {item.children.map((child) => (
                    <li key={child.href} role="none">
                      <a
                        role="menuitem"
                        href={child.href}
                        className="block px-4 py-2 text-sm font-bold hover:bg-foreground/5"
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-bold tracking-[-0.04em] hover:text-primary md:text-lg"
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden items-center gap-3 md:flex">
            {social.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-wide hover:text-primary"
                aria-label={`${link.label} — відкривається у новому вікні`}
              >
                {link.label.slice(0, 2)}
              </a>
            ))}
          </div>

          <a
            href={langHref}
            lang="en"
            hrefLang="en-GB"
            className="text-sm font-bold uppercase tracking-wide hover:text-primary"
          >
            En
          </a>
        </div>
      </Container>
    </header>
  )
}

export { UiSiteHeader }
