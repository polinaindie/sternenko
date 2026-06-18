export type UiNavItem = {
  label: string
  href?: string
  children?: { label: string; href: string }[]
}

export type UiHeroSlide = {
  imageSrc: string
  imageAlt: string
  href: string
}

export type UiProgrammeCategory = {
  title: string
  href: string
  imageSrc: string
}

export type UiNewsItem = {
  title: string
  href: string
  imageSrc: string
  date: string
}
