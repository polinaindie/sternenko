import type { ReportPalette } from "@workspace/ui/blocks/monthly-report-block"

import type {
  DocumentAttachmentItem,
  TransferMediaItem,
} from "./components/AttachmentViewer"
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

export const INCOME_SOURCES = [
  "Monobank",
  "ПриватБанк",
  "Portmone",
  "Рахунки в різних валютах",
  "Криптовалюта",
  "PayPal",
] as const

/** Slug keys for chart/CSS — labels may contain spaces or Cyrillic. */
export const INCOME_SOURCE_CHART_KEY: Record<(typeof INCOME_SOURCES)[number], string> = {
  Monobank: "monobank",
  "ПриватБанк": "privatbank",
  Portmone: "portmone",
  "Рахунки в різних валутах": "foreignAccounts",
  "Криптовалюта": "crypto",
  PayPal: "paypal",
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
}

/** Лінійки проєктів для зведеного розподілу закупівель (не прив’язано до періоду на сторінці). */
export const ISSUANCE_PROJECT_LINES = [
  "Поточний",
  "Шахедоріз",
  "Небесний",
  "РеДрон",
  "Секретний",
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
  "Опторіз": "Поточний",
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
  totalPurchaseAmountUah: number
  closedRequestsCount: number
  /** Приблизні збитки ворогу за весь час, USD (оцінка). */
  lossesUsd: number
  /** Місячна норма закупівель — поточний місяць, не залежить від фільтра. */
  monthlyNorm: {
    valueUah: number
    targetUah: number
  }
}

/** Спільна дата останнього оновлення даних на сторінці «Звіти». */
export const REPORTS_DATA_UPDATED_AT = "2026-06-18T14:00:00+03:00"

export const ISSUANCE_SNAPSHOT: IssuanceSnapshot = {
  updatedAt: REPORTS_DATA_UPDATED_AT,
  totalPurchaseAmountUah: 892_450_000,
  closedRequestsCount: 142,
  lossesUsd: 127_400_000,
  monthlyNorm: {
    valueUah: 68_500_000,
    targetUah: 85_000_000,
  },
}

const ISSUANCE_PRODUCTS_BY_CATEGORY: Record<
  IssuancePropertyCategory,
  readonly string[]
> = {
  "FPV-дрони": [
    "FPV-дрон Vector 7",
    "FPV-дрон Thunder 5",
    "Комплект FPV «Око»",
    "Дрон-перехоплювач SkyHunt",
  ],
  Оптика: ["Тепловізор Pulsar", "Приціл Holosun", "Бінокль Vector 10x42"],
  "Зв'язок": [
    "Антени VTX 5.8 GHz",
    "Ретранслятор Silvus",
    "Рація Motorola DP4400",
    "Модуль Starlink",
  ],
  БК: [
    "Стартер-комплект Shahed-cutter",
    "Набір БК для FPV",
    "Заряди для дронів",
    "Комплект боєприпасів",
  ],
}

const ISSUANCE_ROW_SEEDS: IssuanceRow[] = [
  {
    id: "1",
    date: "15.06.2026",
    productName: "FPV-дрон Vector 7",
    quantity: 50,
    unitPrice: 12_400,
    total: 620_000,
    fundraising: "Шахедоріз",
    recipient: "65 ОМБр бБпС \"РОНІНИ\", ЗСУ",
    project: "Шахедоріз",
    direction: "ППО",
    agency: "ЗСУ",
    unit: "65 ОМБр бБпС \"РОНІНИ\"",
    category: "FPV-дрони",
    attachments: {
      media: [
        {
          type: "image",
          src: "https://picsum.photos/seed/sternenko-issue-1-a/1200/800",
          alt: "Фото видачі FPV-дрон Vector 7",
        },
        {
          type: "video",
          src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
          poster: "https://picsum.photos/seed/sternenko-issue-1-b/1200/800",
          alt: "Відео передачі FPV-дронів підрозділу",
        },
        {
          type: "image",
          src: "https://picsum.photos/seed/sternenko-issue-1-c/1200/800",
          alt: "Фото видачі — загальний план",
        },
      ],
      act: [
        {
          src: "https://picsum.photos/seed/sternenko-act-1/800/1100",
          alt: "Акт видачі №1247 від 15.06.2026",
        },
      ],
      payment: [
        {
          src: "https://picsum.photos/seed/sternenko-pay-1/800/1100",
          alt: "Платіжне доручення №883412",
        },
      ],
    },
  },
  {
    id: "2",
    date: "14.06.2026",
    productName: "Антени VTX 5.8 GHz",
    quantity: 200,
    unitPrice: 890,
    total: 178_000,
    fundraising: "ReDrone",
    recipient: "93 ОМБр сб рУБпАК",
    project: "РеДрон",
    direction: "Розвідка",
    agency: "ЗСУ",
    unit: "93 ОМБр сб рУБпАК",
    category: "Зв'язок",
    attachments: {
      media: [
        {
          type: "image",
          src: "https://picsum.photos/seed/sternenko-issue-2/1200/800",
          alt: "Фото видачі антен VTX",
        },
        {
          type: "video",
          src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          poster: "https://picsum.photos/seed/sternenko-issue-2-v/1200/800",
          alt: "Відео передачі антен VTX",
        },
      ],
      act: [],
      payment: [
        {
          src: "https://picsum.photos/seed/sternenko-pay-2/800/1100",
          alt: "Рахунок-фактура №VTX-2026-14",
        },
      ],
    },
  },
  {
    id: "3",
    date: "13.06.2026",
    productName: "Стартер-комплект Shahed-cutter",
    quantity: 12,
    unitPrice: 45_000,
    total: 540_000,
    fundraising: "Шахедоріз",
    recipient: "118 ОБрТрО 1 обТрО, ТРО",
    project: "Шахедоріз",
    direction: "ППО",
    agency: "ТРО",
    unit: "118 ОБрТрО 1 обТрО",
    category: "БК",
    attachments: {
      media: [
        {
          type: "video",
          src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.webm",
          poster: "https://picsum.photos/seed/sternenko-issue-3/1200/800",
          alt: "Відео видачі комплекту Shahed-cutter",
        },
      ],
      act: [
        {
          src: "https://picsum.photos/seed/sternenko-act-3/800/1100",
          alt: "Акт видачі №1198 від 13.06.2026",
        },
      ],
      payment: [],
    },
  },
]

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

function formatIssuanceDate(date: Date): string {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`
}

function parseIssuanceRowDate(value: string): number {
  const [day, month, year] = value.split(".").map(Number)
  return new Date(year!, (month ?? 1) - 1, day ?? 1).getTime()
}

function unitPriceForCategory(
  category: IssuancePropertyCategory,
  rng: () => number
): number {
  switch (category) {
    case "FPV-дрони":
      return 8_000 + Math.floor(rng() * 18_000)
    case "Оптика":
      return 12_000 + Math.floor(rng() * 85_000)
    case "Зв'язок":
      return 400 + Math.floor(rng() * 4_500)
    case "БК":
      return 2_500 + Math.floor(rng() * 48_000)
  }
}

function generateIssuanceRows(): IssuanceRow[] {
  const rows: IssuanceRow[] = [...ISSUANCE_ROW_SEEDS]
  let id = ISSUANCE_ROW_SEEDS.length + 1

  const rangeStart = new Date(2025, 8, 1)
  const rangeEnd = new Date(2026, 5, 20)
  const daySpan = Math.max(
    1,
    Math.round((rangeEnd.getTime() - rangeStart.getTime()) / 86_400_000)
  )

  for (const [fundraisingIndex, fundraising] of FUNDRAISINGS.entries()) {
    const rng = createResultRng(0x8a3c21 + fundraisingIndex * 6_151)
    const rowCount = 6 + Math.floor(rng() * 7)

    for (let index = 0; index < rowCount; index += 1) {
      const category =
        ISSUANCE_PROPERTY_CATEGORIES[
          Math.floor(rng() * ISSUANCE_PROPERTY_CATEGORIES.length)
        ]!
      const products = ISSUANCE_PRODUCTS_BY_CATEGORY[category]
      const productName = products[Math.floor(rng() * products.length)]!
      const direction =
        ISSUANCE_DIRECTIONS[Math.floor(rng() * ISSUANCE_DIRECTIONS.length)]!
      const unit = ISSUANCE_UNITS[Math.floor(rng() * ISSUANCE_UNITS.length)]!
      const agency = ISSUANCE_AGENCIES[Math.floor(rng() * ISSUANCE_AGENCIES.length)]!
      const issueDate = new Date(rangeStart)
      issueDate.setDate(issueDate.getDate() + Math.floor(rng() * daySpan))

      const quantity = 8 + Math.floor(rng() * 180)
      const unitPrice = unitPriceForCategory(category, rng)
      const total = quantity * unitPrice

      rows.push({
        id: String(id),
        date: formatIssuanceDate(issueDate),
        productName,
        quantity,
        unitPrice,
        total,
        fundraising,
        recipient: `${unit}, ${agency}`,
        project: FUNDRAISING_TO_PROJECT[fundraising],
        direction,
        agency,
        unit,
        category,
        attachments: { media: [], act: [], payment: [] },
      })
      id += 1
    }
  }

  return rows.sort(
    (left, right) => parseIssuanceRowDate(right.date) - parseIssuanceRowDate(left.date)
  )
}

export const ISSUANCE_ROWS: IssuanceRow[] = generateIssuanceRows()

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
