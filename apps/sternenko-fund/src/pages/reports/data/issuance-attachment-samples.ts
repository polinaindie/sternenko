import type {
  DocumentAttachmentItem,
  TransferMediaItem,
} from "../components/AttachmentViewer"

import { ISSUANCE_REPORTING_END, ISSUANCE_REPORTING_START } from "./issuance-reporting"

type IssuanceRowLike = {
  id: string
  date: string
  productName: string
  attachments: {
    media: readonly TransferMediaItem[]
    act: readonly DocumentAttachmentItem[]
    payment: readonly DocumentAttachmentItem[]
  }
}

function parseIssuanceDate(date: string): number {
  const [day, month, year] = date.split(".").map(Number)
  return new Date(year!, month! - 1, day!).getTime()
}

function isWithinDefaultReportingWindow(date: string): boolean {
  const parsed = parseIssuanceDate(date)
  return parsed >= ISSUANCE_REPORTING_START.getTime() && parsed <= ISSUANCE_REPORTING_END.getTime()
}

/** Той самий порядок, що в IssuanceTab за замовчуванням: дата ↓, потім id (uk). */
function issuanceDefaultDisplayOrder(a: IssuanceRowLike, b: IssuanceRowLike): number {
  const byDate = parseIssuanceDate(b.date) - parseIssuanceDate(a.date)
  if (byDate !== 0) return byDate
  return a.id.localeCompare(b.id, "uk")
}

function firstPageDemoRows<T extends IssuanceRowLike>(rows: T[]): T[] {
  return [...rows]
    .filter((row) => isWithinDefaultReportingWindow(row.date))
    .sort(issuanceDefaultDisplayOrder)
    .slice(0, 2)
}

function demoMedia(productName: string, withVideo: boolean): TransferMediaItem[] {
  const items: TransferMediaItem[] = [
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
      alt: `Фото передачі — ${productName}`,
    },
  ]
  if (withVideo) {
    items.push({
      type: "video",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster:
        "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=80",
      alt: `Відеозвіт передачі — ${productName}`,
    })
  }
  return items
}

function demoAct(productName: string, date: string): DocumentAttachmentItem[] {
  return [
    {
      src: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
      alt: `Акт видачі — ${productName} від ${date}`,
    },
  ]
}

/** Приклади фото/відео та актів на перших 2 рядках 1-ї сторінки таблиці видач. */
export function applyIssuanceAttachmentSamples<T extends IssuanceRowLike>(rows: T[]): T[] {
  const demoRows = firstPageDemoRows(rows)
  const samplesById = new Map(
    demoRows.map((row, index) => [
      row.id,
      {
        media: demoMedia(row.productName, index === 0),
        act: demoAct(row.productName, row.date),
      },
    ])
  )

  return rows.map((row) => {
    const sample = samplesById.get(row.id)
    if (!sample) {
      return {
        ...row,
        attachments: {
          media: [...row.attachments.media],
          act: [...row.attachments.act],
          payment: [...row.attachments.payment],
        },
      }
    }

    return {
      ...row,
      attachments: {
        media: sample.media,
        act: sample.act,
        payment: [...row.attachments.payment],
      },
    }
  })
}
