import { useEffect, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"
import { Container } from "@workspace/ui/layout/container"

import { FilterApplyButton } from "../../pages/reports/components/report-ui"

import logoNav from "../../assets/brand/logo-nav.svg"
import { GlobeIcon } from "./icons"
import {
  contactsNav,
  donateHref,
  engLocaleHref,
  homeHref,
  moreNav,
  primaryNav,
  ukrLocaleHref,
  type NavLink,
} from "./nav"
import styles from "./SiteHeader.module.css"

function NavMenuLink({
  item,
  current = item.current,
  onNavigate,
}: {
  item: NavLink
  current?: boolean
  onNavigate?: () => void
}) {
  return (
    <a
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={cn(styles.navMenuLink, current && styles.navMenuLinkCurrent)}
      onClick={onNavigate}
    >
      {item.label}
    </a>
  )
}

type SiteHeaderProps = {
  /** Сторінки помилок не належать жодному розділу — там активний пункт не позначаємо. */
  markCurrentNav?: boolean
}

export function SiteHeader({ markCurrentNav = true }: SiteHeaderProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  // Keep --site-header-offset in sync with the real fixed header height so
  // page padding / sticky tops clear the bar on every breakpoint (incl. 1920+).
  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const syncOffset = () => {
      const height = Math.ceil(header.getBoundingClientRect().height)
      document.documentElement.style.setProperty(
        "--site-header-offset",
        `${height}px`
      )
    }

    syncOffset()
    const observer = new ResizeObserver(syncOffset)
    observer.observe(header)
    window.addEventListener("resize", syncOffset)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", syncOffset)
      document.documentElement.style.removeProperty("--site-header-offset")
    }
  }, [])

  useEffect(() => {
    if (!mobileOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [mobileOpen])

  return (
    <header ref={headerRef} className={styles.navComponent} role="banner">
      <Container className={styles.navContainer}>
          <a href={homeHref} className={styles.navBrand}>
            <img
              src={logoNav}
              alt='Благодійний фонд "Спільнота Стерненка"'
              className={styles.navLogo}
              width={98}
              height={52}
            />
          </a>

          <div className={styles.navActions}>
            <div className={styles.navCluster}>
              <nav
                id="site-mobile-nav"
                aria-label="Головна навігація"
                className={cn(styles.navMenu, mobileOpen && styles.navMenuOpen)}
              >
                {primaryNav.map((item) => (
                  <NavMenuLink
                    key={item.label}
                    item={item}
                    current={markCurrentNav && item.current}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}

                <div className={styles.navFoldedItems}>
                  {moreNav.map((item) => (
                    <NavMenuLink
                      key={item.label}
                      item={item}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </div>

                <NavMenuLink
                  item={contactsNav}
                  onNavigate={() => setMobileOpen(false)}
                />

                <div className={styles.localesWrapper}>
                  <div className={styles.localesList} role="list">
                    <a
                      href={ukrLocaleHref}
                      hrefLang="uk"
                      lang="uk"
                      aria-current="page"
                      className={cn(styles.localeLink, styles.localeLinkCurrent)}
                      role="listitem"
                    >
                      <span className={styles.localeIcon}>
                        <GlobeIcon />
                      </span>
                      UKR
                    </a>
                    <a
                      href={engLocaleHref}
                      hrefLang="en"
                      lang="en"
                      className={styles.localeLink}
                      role="listitem"
                    >
                      <span className={styles.localeIcon}>
                        <GlobeIcon />
                      </span>
                      ENG
                    </a>
                  </div>
                </div>
              </nav>

              <FilterApplyButton
                asChild
                variant="alternate"
                className="bg-white text-[#080808] hover:bg-[#E1E1E1] dark:bg-white dark:text-[#080808] dark:hover:bg-[#E1E1E1]"
              >
                <a href={donateHref}>Задонатити</a>
              </FilterApplyButton>
            </div>

            <button
              type="button"
              className={cn(
                styles.navButton,
                mobileOpen && styles.navButtonOpen
              )}
              aria-expanded={mobileOpen}
              aria-controls="site-mobile-nav"
              aria-label={mobileOpen ? "Закрити меню" : "Відкрити меню"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span className={styles.navIconWrapper}>
                <span
                  className={cn(styles.navIcon, styles.navIconTop)}
                  aria-hidden
                />
                <span
                  className={cn(styles.navIcon, styles.navIconBottom)}
                  aria-hidden
                />
              </span>
            </button>
          </div>
      </Container>
    </header>
  )
}
