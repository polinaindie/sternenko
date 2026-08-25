import { ISSUANCE_PROJECT_LINES, type IssuanceProjectLine } from "../mock-data"
import { BRAND_INK, BRAND_PALETTE, type BrandSwatch } from "./brand-palette"

/** 5 лінійок проєктів — акценти з брендбуку (brand-palette). */
export const PROJECT_SWATCH: Record<IssuanceProjectLine, BrandSwatch> = {
  Поточний: { bg: BRAND_PALETTE.green.main, fg: BRAND_INK },
  Шахедоріз: { bg: BRAND_PALETTE.yellow.main, fg: BRAND_INK },
  Небесний: { bg: BRAND_PALETTE.blue.mid, fg: BRAND_INK },
  РеДрон: { bg: BRAND_PALETTE.gray.light, fg: BRAND_INK },
  Секретний: { bg: BRAND_PALETTE.orange.main, fg: BRAND_INK },
  Опторіз: { bg: BRAND_PALETTE.brown.mid, fg: BRAND_INK },
}

/** Заливка горизонтальних стовпців у графіку закритих запитів. */
export const PROJECT_BAR_FILL: Record<IssuanceProjectLine, string> =
  Object.fromEntries(
    Object.entries(PROJECT_SWATCH).map(([name, swatch]) => [name, swatch.bg])
  ) as Record<IssuanceProjectLine, string>

export function getProjectSwatch(name: IssuanceProjectLine): BrandSwatch {
  return PROJECT_SWATCH[name]
}

export function getProjectBarFill(name: IssuanceProjectLine): string {
  return PROJECT_BAR_FILL[name]
}

/** Акцент лінійки — заливка барів. */
export function getProjectAccentColor(name: IssuanceProjectLine): string {
  return PROJECT_SWATCH[name].bg
}

export function isIssuanceProjectLine(name: string): name is IssuanceProjectLine {
  return (ISSUANCE_PROJECT_LINES as readonly string[]).includes(name)
}
