import { FUNDRAISINGS } from "../mock-data"
import { BRAND_INK, BRAND_PALETTE, type BrandSwatch } from "./brand-palette"

/**
 * Унікальний колір тега для кожного збору — відтінки з брендбуку (brand-palette).
 * Єдиний підхід: темний текст (#1E1E1E) на світлих/середніх акцентах.
 * Жоден bg не повторюється між різними зборами.
 */
export const FUNDRAISING_SWATCH: Record<(typeof FUNDRAISINGS)[number], BrandSwatch> = {
  "Русоріз": { bg: BRAND_PALETTE.green.main, fg: BRAND_INK },
  "Шахедоріз": { bg: BRAND_PALETTE.yellow.main, fg: BRAND_INK },
  "Небесний Русоріз": { bg: BRAND_PALETTE.blue.mid, fg: BRAND_INK },
  "Опторіз": { bg: BRAND_PALETTE.brown.main, fg: BRAND_INK },
  ReDrone: { bg: BRAND_PALETTE.gray.light, fg: BRAND_INK },
  "Секретний RUSORIZ 2.0": { bg: BRAND_PALETTE.orange.main, fg: BRAND_INK },
  "Секретний RUSORIZ": { bg: "#FE6A34", fg: BRAND_INK },
  "HAPPY OPTORIZ": { bg: BRAND_PALETTE.brown.light, fg: BRAND_INK },
  "Конверт на перехоплення": { bg: BRAND_PALETTE.yellow.mid, fg: BRAND_INK },
  "Дронвестиція": { bg: BRAND_PALETTE.green.mid, fg: BRAND_INK },
  "Тотальний Русоріз": { bg: BRAND_PALETTE.green.light, fg: BRAND_INK },
  "Оптичний Русоріз": { bg: BRAND_PALETTE.brown.mid, fg: BRAND_INK },
  "Грім для ворогів": { bg: BRAND_PALETTE.blue.light, fg: BRAND_INK },
  "Небесна інвестиція": { bg: BRAND_PALETTE.yellow.light, fg: BRAND_INK },
}

export const FUNDRAISING_FILL: Record<(typeof FUNDRAISINGS)[number], string> =
  Object.fromEntries(
    Object.entries(FUNDRAISING_SWATCH).map(([name, swatch]) => [name, swatch.bg])
  ) as Record<(typeof FUNDRAISINGS)[number], string>

export const FUNDRAISING_TAG_FALLBACK: BrandSwatch = {
  bg: BRAND_PALETTE.orange.main,
  fg: BRAND_INK,
}

export function getFundraisingSwatch(name: string): BrandSwatch {
  return (
    FUNDRAISING_SWATCH[name as (typeof FUNDRAISINGS)[number]] ??
    FUNDRAISING_TAG_FALLBACK
  )
}

export function getFundraisingFillColor(name: string): string | undefined {
  return FUNDRAISING_FILL[name as (typeof FUNDRAISINGS)[number]]
}
