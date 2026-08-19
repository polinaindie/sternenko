import type { ReportPalette } from "@workspace/ui/blocks/monthly-report-block"

import type {
  DocumentAttachmentItem,
  TransferMediaItem,
} from "./components/AttachmentViewer"
import { ISSUANCE_IMPORTED_ROWS } from "./data/issuance-rows.generated"
import { applyIssuanceAttachmentSamples } from "./data/issuance-attachment-samples"
import { expandIssuanceRowsForDemo } from "./data/expand-issuance-demo"
import { ISSUANCE_UNITS } from "./data/issuance-units"

export { ISSUANCE_UNITS } from "./data/issuance-units"
export type { IssuanceUnit } from "./data/issuance-units"

/** Активні та завершені збори — https://www.sternenkofund.org/fundraisings */
export const FUNDRAISINGS = [
  "Русоріз",
  "Шахедоріз",
  "Небесний Русоріз",
  "Опторіз",
  "ReDrone",
  "Секретний RUSORIZ 2.0",
  "Секретний RUSORIZ",
  "HAPPY OPTORIZ",
  "Конверт на перехоплення",
  "Дронвестиція",
  "Тотальний Русоріз",
  "Оптичний Русоріз",
  "Грім для ворогів",
  "Небесна інвестиція",
] as const

/**
 * Демо: збори без надходжень/видач у 2026 — у фільтрі лишаються видимими,
 * але неактивними за період «з початку року» (типовий дефолт на сторінці).
 */
export const FUNDRAISERS_DORMANT_IN_2026 = [
  "Секретний RUSORIZ 2.0",
  "Секретний RUSORIZ",
  "ReDrone",
  "HAPPY OPTORIZ",
  "Дронвестиція",
  "Небесна інвестиція",
  "Грім для ворогів",
] as const satisfies readonly (typeof FUNDRAISINGS)[number][]

const DORMANT_IN_2026 = new Set<string>(FUNDRAISERS_DORMANT_IN_2026)

export function isFundraiserDormantInYear(
  fundraising: (typeof FUNDRAISINGS)[number],
  year: number
): boolean {
  return year >= 2026 && DORMANT_IN_2026.has(fundraising)
}

export function activeFundraisingsForYear(
  year: number
): (typeof FUNDRAISINGS)[number][] {
  if (year < 2026) return [...FUNDRAISINGS]
  return FUNDRAISINGS.filter((fundraising) => !DORMANT_IN_2026.has(fundraising))
}

export const INCOME_SOURCES = [
  "Monobank",
  "ПриватБанк",
  "Гривневий рахунок",
  "Валютний рахунок",
] as const

/** Slug keys for chart/CSS — labels may contain spaces or Cyrillic. */
export const INCOME_SOURCE_CHART_KEY: Record<(typeof INCOME_SOURCES)[number], string> = {
  Monobank: "monobank",
  "ПриватБанк": "privatbank",
  "Гривневий рахунок": "uahAccount",
  "Валютний рахунок": "fxAccount",
}

export const INCOME_CHART_KEYS = INCOME_SOURCES.map(
  (source) => INCOME_SOURCE_CHART_KEY[source]
)

export type ChartGranularity = "day" | "week" | "month"

export type IssuanceAttachments = {
  media: TransferMediaItem[]
  act: DocumentAttachmentItem[]
  payment: DocumentAttachmentItem[]
}

/** Документ ще не завантажено, але звіт очікується (`awaiting` у реєстрі видач). */
export type IssuanceAttachmentsPending = {
  media: boolean
  act: boolean
  payment: boolean
}

export type IssuanceRow = {
  id: string
  date: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  fundraising: string
  recipient: string
  project: IssuanceProjectLine
  direction: IssuanceDirection
  agency: IssuanceAgency
  unit: string
  category: IssuancePropertyCategory
  attachments: IssuanceAttachments
  pendingAttachments: IssuanceAttachmentsPending
}

/** Лінійки проєктів для зведеного розподілу закупівель (не прив’язано до періоду на сторінці). */
export const ISSUANCE_PROJECT_LINES = [
  "Поточний",
  "Шахедоріз",
  "Небесний",
  "РеДрон",
  "Секретний",
  "Опторіз",
] as const

export type IssuanceProjectLine = (typeof ISSUANCE_PROJECT_LINES)[number]

export const ISSUANCE_DIRECTIONS = [
  "ППО",
  "Розвідка",
  "Штурмові",
  "Логістика",
] as const

export type IssuanceDirection = (typeof ISSUANCE_DIRECTIONS)[number]

export const ISSUANCE_AGENCIES = ["ЗСУ", "ТРО", "ДСНС"] as const

export type IssuanceAgency = (typeof ISSUANCE_AGENCIES)[number]

export const ISSUANCE_PROPERTY_CATEGORIES = [
  "FPV-дрони",
  "Оптика",
  "Зв'язок",
  "БК",
] as const

export type IssuancePropertyCategory = (typeof ISSUANCE_PROPERTY_CATEGORIES)[number]

/** Збір → лінійка проєкту для зведеного KPI та mock-рядків. */
export const FUNDRAISING_TO_PROJECT: Record<
  (typeof FUNDRAISINGS)[number],
  IssuanceProjectLine
> = {
  "Русоріз": "Поточний",
  "Шахедоріз": "Шахедоріз",
  "Небесний Русоріз": "Небесний",
  "Опторіз": "Опторіз",
  ReDrone: "РеДрон",
  "Секретний RUSORIZ 2.0": "Секретний",
  "Секретний RUSORIZ": "Секретний",
  "HAPPY OPTORIZ": "Поточний",
  "Конверт на перехоплення": "Небесний",
  "Дронвестиція": "Поточний",
  "Тотальний Русоріз": "Поточний",
  "Оптичний Русоріз": "Поточний",
  "Грім для ворогів": "Поточний",
  "Небесна інвестиція": "Небесний",
}

/**
 * Пакетний знімок KPI закупівель — оновлюється на бекенді раз на день або тиждень,
 * не перераховується при зміні періоду чи фільтрів таблиці.
 */
export type IssuanceSnapshot = {
  /** ISO datetime останнього пакетного оновлення. */
  updatedAt: string
}

/** Спільна дата останнього оновлення даних на сторінці «Звіти». */
export const REPORTS_DATA_UPDATED_AT = "2026-07-06T13:13:29+03:00"

export const ISSUANCE_SNAPSHOT: IssuanceSnapshot = {
  updatedAt: REPORTS_DATA_UPDATED_AT,
}


export const ISSUANCE_ROWS: IssuanceRow[] = applyIssuanceAttachmentSamples(
  expandIssuanceRowsForDemo(
    ISSUANCE_IMPORTED_ROWS.map((row) => ({
      ...row,
      attachments: {
        media: [...row.attachments.media],
        act: [...row.attachments.act],
        payment: [...row.attachments.payment],
      },
    }))
  )
)

// --- Результати за зборами --------------------------------------------------
// Combat / закупівельні показники по кожному збору, розкладені на місячні
// зрізи в межах звітного вікна (2025-01 … 2026-06). Періодний фільтр на
// сторінці звіту агрегує ці зрізи за обраний інтервал, тож блоки по зборах і
// hero «1 ₴ ≈ X $» завжди узгоджені з income-транзакціями за той самий період.

export type FundraisingBreakdownItem = {
  label: string
  count: number
  amountUah: number
}

export type FundraisingResultRow = {
  /** ISO дата (YYYY-MM-DD) місячного зрізу. */
  date: string
  fundraising: (typeof FUNDRAISINGS)[number]
  /** Combat- або закупівельна кількість за зріз. */
  quantity: number
  /** Приблизні збитки ворогу в USD за зріз (0 для суто закупівельних зборів). */
  lossesUsd: number
  /** Розбивка по типах (лише закупівельні збори). */
  breakdown?: FundraisingBreakdownItem[]
  /** Знімок виконання плану у відсотках (лише збори з планом). */
  planPercent?: number
}

export type FundraisingReportConfig = {
  fundraising: (typeof FUNDRAISINGS)[number]
  /** Візуальний скін збору (data-report-palette). */
  palette: ReportPalette
  /** Підпис під hero-числом. */
  heroLabel: string
  showBreakdown?: boolean
  showPlanPercent?: boolean
}

// Кожен з 14 зборів отримує палітру (один із 6 скінів — повторно для зборів без
// власного) та підпис hero-метрики. Закупівельні збори додатково мають розбивку
// по типах і прогрес плану.
export const FUNDRAISING_REPORT_CONFIG: FundraisingReportConfig[] = [
  { fundraising: "Русоріз", palette: "potochnyi", heroLabel: "цілей уражено" },
  { fundraising: "Шахедоріз", palette: "shahedoriz", heroLabel: "БПЛА збито" },
  { fundraising: "Небесний Русоріз", palette: "nebesnyi", heroLabel: "БПЛА збито" },
  {
    fundraising: "Опторіз",
    palette: "fpv",
    heroLabel: "оптичних систем передано",
    showBreakdown: true,
    showPlanPercent: true,
  },
  { fundraising: "ReDrone", palette: "redrone", heroLabel: "FPV перероблено" },
  {
    fundraising: "Секретний RUSORIZ 2.0",
    palette: "shahedoriz",
    heroLabel: "цілей уражено",
  },
  {
    fundraising: "Секретний RUSORIZ",
    palette: "potochnyi",
    heroLabel: "цілей уражено",
  },
  {
    fundraising: "HAPPY OPTORIZ",
    palette: "fpv",
    heroLabel: "оптоволоконних FPV передано",
    showBreakdown: true,
  },
  {
    fundraising: "Конверт на перехоплення",
    palette: "nebesnyi",
    heroLabel: "цілей перехоплено",
  },
  {
    fundraising: "Дронвестиція",
    palette: "fpv",
    heroLabel: "дронів закуплено",
    showBreakdown: true,
    showPlanPercent: true,
  },
  {
    fundraising: "Тотальний Русоріз",
    palette: "potochnyi",
    heroLabel: "цілей уражено",
  },
  {
    fundraising: "Оптичний Русоріз",
    palette: "donations",
    heroLabel: "оптичних FPV передано",
    showBreakdown: true,
  },
  { fundraising: "Грім для ворогів", palette: "donations", heroLabel: "цілей уражено" },
  { fundraising: "Небесна інвестиція", palette: "nebesnyi", heroLabel: "БПЛА збито" },
]

const FUNDRAISING_RESULT_START = new Date(2025, 0, 15)
const FUNDRAISING_RESULT_END = new Date(2026, 5, 15)

// Типи закупівельних дронів для розбивки + орієнтовна ціна одиниці (₴).
const BREAKDOWN_TYPES = [
  { label: "звичайних", weight: 0.5, price: 12_400 },
  { label: "зенітних", weight: 0.14, price: 18_900 },
  { label: "перехоплювачі", weight: 0.09, price: 26_500 },
  { label: "оптоволокно", weight: 0.15, price: 21_300 },
  { label: "інших", weight: 0.12, price: 9_800 },
] as const

function buildBreakdown(
  total: number,
  rng: () => number
): FundraisingBreakdownItem[] {
  let remaining = total
  return BREAKDOWN_TYPES.map((type, index) => {
    const isLast = index === BREAKDOWN_TYPES.length - 1
    const jitter = 0.85 + rng() * 0.3
    const raw = isLast
      ? remaining
      : Math.min(remaining, Math.round(total * type.weight * jitter))
    const count = Math.max(0, raw)
    remaining = Math.max(0, remaining - count)
    return { label: type.label, count, amountUah: count * type.price }
  })
}

function createResultRng(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pad(value: number): string {
  return String(value).padStart(2, "0")
}

function generateFundraisingResults(): FundraisingResultRow[] {
  const rows: FundraisingResultRow[] = []

  FUNDRAISING_REPORT_CONFIG.forEach((config, configIndex) => {
    const rng = createResultRng(0x5f3a17 + configIndex * 7919)
    const isProcurement = Boolean(config.showBreakdown)
    const cursor = new Date(FUNDRAISING_RESULT_START)
    let monthIndex = 0

    while (cursor <= FUNDRAISING_RESULT_END) {
      const date = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-15`

      const quantity = isProcurement
        ? 200 + Math.floor(rng() * 500)
        : 40 + Math.floor(rng() * 220)

      // Закупівельні збори не мають прямих бойових втрат; бойові — ~$300–700 за ціль.
      const lossPerUnitUsd = isProcurement ? 0 : 300 + Math.floor(rng() * 400)
      const lossesUsd = Math.round((quantity * lossPerUnitUsd) / 100) * 100

      const row: FundraisingResultRow = {
        date,
        fundraising: config.fundraising,
        quantity,
        lossesUsd,
      }

      if (config.showBreakdown) {
        row.breakdown = buildBreakdown(quantity, rng)
      }

      if (config.showPlanPercent) {
        row.planPercent = Math.min(97, 58 + monthIndex * 2 + Math.floor(rng() * 5))
      }

      rows.push(row)
      cursor.setMonth(cursor.getMonth() + 1)
      monthIndex += 1
    }
  })

  return rows
}

export const FUNDRAISING_RESULTS: FundraisingResultRow[] =
  generateFundraisingResults()
