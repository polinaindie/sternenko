export const SITE_ORIGIN = "https://www.sternenkofund.org"

export type NavLink = {
  label: string
  href: string
  current?: boolean
}

export const primaryNav: NavLink[] = [
  { label: "Збори", href: `${SITE_ORIGIN}/fundraisings` },
  {
    label: "Звіти",
    href: `${SITE_ORIGIN}/reports`,
    current: true,
  },
  { label: "Партнерство", href: `${SITE_ORIGIN}/partnership` },
  { label: "Вакансії", href: `${SITE_ORIGIN}/vacancies` },
]

export const moreNav: NavLink[] = [
  { label: "Про фонд", href: `${SITE_ORIGIN}/about` },
  { label: "Виробникам", href: `${SITE_ORIGIN}/for-manufacturers` },
  { label: "FAQ", href: `${SITE_ORIGIN}/faq` },
]

export const contactsNav: NavLink = {
  label: "Контакти",
  href: `${SITE_ORIGIN}/contacts`,
}

export const donateHref = `${SITE_ORIGIN}/donate`
export const homeHref = `${SITE_ORIGIN}/`
export const ukrLocaleHref = `${SITE_ORIGIN}/reports`
export const engLocaleHref = `${SITE_ORIGIN}/en/reports`
