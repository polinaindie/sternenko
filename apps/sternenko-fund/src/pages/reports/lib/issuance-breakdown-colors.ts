import { FUNDRAISINGS } from "../mock-data"
import { BRAND_PALETTE } from "./brand-palette"

const { yellow, orange, brown, green, blue, gray } = BRAND_PALETTE

/**
 * Гармонійна послідовність для діаграми закритих запитів.
 * Порядок як у брендбуку: жовтий → помаранчевий → коричневий → зелений → блакитний.
 * Перші 5 рядків — main (найнасиченіші «великі» блоки), далі mid і light.
 * Кольори призначаються за позицією в рейтингу, щоб сусідні бари не зливались.
 */
export const ISSUANCE_BREAKDOWN_CHART_PALETTE = [
  yellow.main,
  orange.main,
  brown.main,
  green.main,
  blue.main,
  yellow.mid,
  orange.mid,
  brown.mid,
  green.mid,
  blue.mid,
  yellow.light,
  orange.light,
  brown.light,
  green.light,
  blue.light,
  gray.light,
] as const

/** Збір → фіксований акцент брендбуку (поверх рангу в діаграмі). */
export const ISSUANCE_BREAKDOWN_FUNDRAISING_OVERRIDES: Partial<
  Record<(typeof FUNDRAISINGS)[number], string>
> = {
  // Шахедоріз — фірмовий зелений з брендбуку.
  "Шахедоріз": green.main,
  // Поточний русоріз — світліший sage з брендбуку, читабельніший на темному полотні.
  "Русоріз": green.mid,
  // Небесний — яскраво-блакитний з брендбуку.
  "Небесний Русоріз": blue.mid,
  // ReDrone — коричневий з брендбуку.
  ReDrone: brown.main,
}

export function getIssuanceBreakdownFillColorByRank(rank: number): string {
  return ISSUANCE_BREAKDOWN_CHART_PALETTE[
    rank % ISSUANCE_BREAKDOWN_CHART_PALETTE.length
  ]!
}

export function getIssuanceBreakdownFillColor(
  fundraising: string,
  paletteRank: number
): string {
  const override =
    ISSUANCE_BREAKDOWN_FUNDRAISING_OVERRIDES[
      fundraising as (typeof FUNDRAISINGS)[number]
    ]

  if (override) return override
  return getIssuanceBreakdownFillColorByRank(paletteRank)
}

export function buildIssuanceBreakdownFillColors(
  fundraisings: readonly string[]
): string[] {
  let paletteRank = 0

  return fundraisings.map((fundraising) => {
    const override =
      ISSUANCE_BREAKDOWN_FUNDRAISING_OVERRIDES[
        fundraising as (typeof FUNDRAISINGS)[number]
      ]

    if (override) return override

    const fill = getIssuanceBreakdownFillColorByRank(paletteRank)
    paletteRank += 1
    return fill
  })
}
