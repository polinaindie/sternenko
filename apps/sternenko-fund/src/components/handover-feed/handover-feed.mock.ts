import type { FeedDay } from "./types"

/** Demo: 2 days — first with 2 items, second with 1 (sticky-header handoff). */
export const HANDOVER_FEED_MOCK: FeedDay[] = [
  {
    date: "2026-06-15",
    items: [
      {
        id: "h-1",
        productName: "FPV-дрон Vector 7",
        totalUAH: 620_000,
        unitCount: 50,
        unitPriceUAH: 12_400,
        project: "Шахедоріз",
        recipient: '65 ОМБр бБпС "РОНІНИ", ЗСУ',
        attachments: [
          { type: "photo", url: "#media-vector-7" },
          { type: "act", url: "#act-vector-7" },
          { type: "payment", url: "#payment-vector-7" },
        ],
      },
      {
        id: "h-2",
        productName: "Комплект FPV «Око»",
        totalUAH: 198_000,
        unitCount: 15,
        unitPriceUAH: 13_200,
        project: "Небесний",
        recipient: '1030 ОЗРАДН, ЗСУ',
        attachments: [
          { type: "photo", url: "#media-oko" },
          { type: "act", url: "#act-oko" },
        ],
      },
    ],
  },
  {
    date: "2026-06-14",
    items: [
      {
        id: "h-3",
        productName: "Дрон-перехоплювач SkyHunt",
        totalUAH: 1_240_000,
        unitCount: 100,
        unitPriceUAH: 12_400,
        project: "Шахедоріз",
        recipient: '42 ОМБр "ПЕРУН", ЗСУ',
        attachments: [{ type: "payment", url: "#payment-skyhunt" }],
      },
    ],
  },
]
